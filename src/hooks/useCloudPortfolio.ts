import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Asset, Category, HistoryEntry, DEFAULT_CATEGORIES, ColorKey } from '@/types/portfolio';
import { useAuth } from '@/contexts/AuthContext';

interface DbCategory {
  id: string;
  user_id: string;
  name: string;
  icon: string;
  color: string;
  interest_rate: number;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface DbAsset {
  id: string;
  user_id: string;
  category_id: string;
  name: string;
  amount: number;
  monthly_contribution: number | null;
  contribution_day: number | null;
  created_at: string;
  updated_at: string;
}

interface DbHistoryEntry {
  id: string;
  user_id: string;
  type: string;
  asset_name: string;
  category_name: string;
  amount: number;
  timestamp: string;
}

export function useCloudPortfolio() {
  const { user } = useAuth();
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  // Convert DB category to app category
  const toAppCategory = (db: DbCategory): Category => ({
    id: db.id,
    name: db.name,
    icon: db.icon,
    color: db.color as ColorKey,
    interestRate: Number(db.interest_rate),
    isDefault: db.is_default,
    isActive: db.is_active,
  });

  // Convert DB asset to app asset
  const toAppAsset = (db: DbAsset): Asset => ({
    id: db.id,
    name: db.name,
    amount: Number(db.amount),
    categoryId: db.category_id,
    monthlyContribution: db.monthly_contribution ? Number(db.monthly_contribution) : undefined,
    contributionDay: db.contribution_day ?? undefined,
    createdAt: new Date(db.created_at),
    updatedAt: new Date(db.updated_at),
  });

  // Convert DB history to app history
  const toAppHistory = (db: DbHistoryEntry): HistoryEntry => ({
    id: db.id,
    type: db.type as HistoryEntry['type'],
    assetName: db.asset_name,
    categoryName: db.category_name,
    amount: Number(db.amount),
    timestamp: new Date(db.timestamp),
  });

  // Fetch all data from cloud
  const fetchData = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const [categoriesRes, assetsRes, historyRes] = await Promise.all([
        supabase.from('categories').select('*').eq('user_id', user.id),
        supabase.from('assets').select('*').eq('user_id', user.id),
        supabase.from('portfolio_history').select('*').eq('user_id', user.id).order('timestamp', { ascending: false }).limit(50),
      ]);

      if (categoriesRes.data) {
        const dbCategories = categoriesRes.data as DbCategory[];
        setCategories(dbCategories.map(toAppCategory));
      }

      if (assetsRes.data) {
        const dbAssets = assetsRes.data as DbAsset[];
        setAssets(dbAssets.map(toAppAsset));
      }

      if (historyRes.data) {
        const dbHistory = historyRes.data as DbHistoryEntry[];
        setHistory(dbHistory.map(toAppHistory));
      }
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Initialize default categories for new users
  const initializeDefaultCategories = useCallback(async () => {
    if (!user) return;

    const { data: existingCategories } = await supabase
      .from('categories')
      .select('id')
      .eq('user_id', user.id)
      .limit(1);

    if (existingCategories && existingCategories.length === 0) {
      const defaultCats = DEFAULT_CATEGORIES.map(cat => ({
        user_id: user.id,
        name: cat.name,
        icon: cat.icon,
        color: cat.color,
        interest_rate: cat.interestRate,
        is_default: true,
        is_active: true,
      }));

      await supabase.from('categories').insert(defaultCats);
      await fetchData();
    }
  }, [user, fetchData]);

  useEffect(() => {
    if (user) {
      initializeDefaultCategories().then(() => fetchData());
    } else {
      setCategories([]);
      setAssets([]);
      setHistory([]);
      setLoading(false);
    }
  }, [user, initializeDefaultCategories, fetchData]);

  // Add history entry
  const addHistoryEntry = useCallback(async (type: HistoryEntry['type'], assetName: string, categoryName: string, amount: number) => {
    if (!user) return;

    const { data, error } = await supabase
      .from('portfolio_history')
      .insert({
        user_id: user.id,
        type,
        asset_name: assetName,
        category_name: categoryName,
        amount,
      })
      .select()
      .single();

    if (!error && data) {
      const dbEntry = data as DbHistoryEntry;
      setHistory(prev => [toAppHistory(dbEntry), ...prev].slice(0, 50));
    }
  }, [user]);

  // Update user_portfolios stats
  const updatePortfolioStats = useCallback(async () => {
    if (!user) return;

    const activeCategories = categories.filter(c => c.isActive !== false);
    const activeCategoryIds = new Set(activeCategories.map(c => c.id));
    const activeAssets = assets.filter(a => activeCategoryIds.has(a.categoryId));
    const totalValue = activeAssets.reduce((sum, a) => sum + a.amount, 0);

    await supabase
      .from('user_portfolios')
      .update({
        total_value: totalValue,
        assets_count: assets.length,
        categories_count: categories.length,
        last_updated: new Date().toISOString(),
      })
      .eq('user_id', user.id);
  }, [user, assets, categories]);

  // Add asset
  const addAsset = useCallback(async (name: string, amount: number, categoryId: string, monthlyContribution?: number, contributionDay?: number) => {
    if (!user) return;
    setSyncing(true);

    const category = categories.find(c => c.id === categoryId);

    const { data, error } = await supabase
      .from('assets')
      .insert({
        user_id: user.id,
        category_id: categoryId,
        name,
        amount,
        monthly_contribution: monthlyContribution || 0,
        contribution_day: contributionDay || 1,
      })
      .select()
      .single();

    if (!error && data) {
      const dbAsset = data as DbAsset;
      setAssets(prev => [...prev, toAppAsset(dbAsset)]);
      if (category) {
        await addHistoryEntry('add', name, category.name, amount);
      }
      await updatePortfolioStats();
    }

    setSyncing(false);
  }, [user, categories, addHistoryEntry, updatePortfolioStats]);

  // Update asset
  const updateAsset = useCallback(async (id: string, updates: Partial<Omit<Asset, 'id' | 'createdAt'>>) => {
    if (!user) return;
    setSyncing(true);

    const asset = assets.find(a => a.id === id);
    const category = categories.find(c => c.id === (updates.categoryId || asset?.categoryId));

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.monthlyContribution !== undefined) dbUpdates.monthly_contribution = updates.monthlyContribution;
    if (updates.contributionDay !== undefined) dbUpdates.contribution_day = updates.contributionDay;

    const { data, error } = await supabase
      .from('assets')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      const dbAsset = data as DbAsset;
      setAssets(prev => prev.map(a => a.id === id ? toAppAsset(dbAsset) : a));
      if (category) {
        await addHistoryEntry('update', updates.name || asset?.name || '', category.name, updates.amount || asset?.amount || 0);
      }
      await updatePortfolioStats();
    }

    setSyncing(false);
  }, [user, assets, categories, addHistoryEntry, updatePortfolioStats]);

  // Delete asset
  const deleteAsset = useCallback(async (id: string) => {
    if (!user) return;
    setSyncing(true);

    const asset = assets.find(a => a.id === id);
    const category = categories.find(c => c.id === asset?.categoryId);

    const { error } = await supabase
      .from('assets')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setAssets(prev => prev.filter(a => a.id !== id));
      if (asset && category) {
        await addHistoryEntry('delete', asset.name, category.name, asset.amount);
      }
      await updatePortfolioStats();
    }

    setSyncing(false);
  }, [user, assets, categories, addHistoryEntry, updatePortfolioStats]);

  // Add category
  const addCategory = useCallback(async (name: string, icon: string, color: Category['color'], interestRate: number = 5) => {
    if (!user) return null;
    setSyncing(true);

    const { data, error } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name,
        icon,
        color,
        interest_rate: interestRate,
        is_default: false,
        is_active: true,
      })
      .select()
      .single();

    setSyncing(false);

    if (!error && data) {
      const dbCategory = data as DbCategory;
      const newCategory = toAppCategory(dbCategory);
      setCategories(prev => [...prev, newCategory]);
      await updatePortfolioStats();
      return newCategory;
    }

    return null;
  }, [user, updatePortfolioStats]);

  // Update category
  const updateCategory = useCallback(async (id: string, updates: Partial<Omit<Category, 'id'>>) => {
    if (!user) return;
    setSyncing(true);

    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.icon !== undefined) dbUpdates.icon = updates.icon;
    if (updates.color !== undefined) dbUpdates.color = updates.color;
    if (updates.interestRate !== undefined) dbUpdates.interest_rate = updates.interestRate;
    if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive;

    const { data, error } = await supabase
      .from('categories')
      .update(dbUpdates)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (!error && data) {
      const dbCategory = data as DbCategory;
      setCategories(prev => prev.map(c => c.id === id ? toAppCategory(dbCategory) : c));
      await updatePortfolioStats();
    }

    setSyncing(false);
  }, [user, updatePortfolioStats]);

  // Toggle category active
  const toggleCategoryActive = useCallback(async (id: string) => {
    const category = categories.find(c => c.id === id);
    if (category) {
      await updateCategory(id, { isActive: !category.isActive });
    }
  }, [categories, updateCategory]);

  // Delete category
  const deleteCategory = useCallback(async (id: string) => {
    if (!user) return;
    setSyncing(true);

    // Assets are deleted automatically via CASCADE
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (!error) {
      setAssets(prev => prev.filter(a => a.categoryId !== id));
      setCategories(prev => prev.filter(c => c.id !== id));
      await updatePortfolioStats();
    }

    setSyncing(false);
  }, [user, updatePortfolioStats]);

  // Add contribution
  const addContribution = useCallback(async (assetId: string, amount: number) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    await updateAsset(assetId, { amount: asset.amount + amount });
  }, [assets, updateAsset]);

  // Computed values
  const getTotalValue = useCallback(() => {
    const activeCategories = categories.filter(c => c.isActive !== false);
    const activeCategoryIds = new Set(activeCategories.map(c => c.id));
    return assets.filter(a => activeCategoryIds.has(a.categoryId)).reduce((sum, asset) => sum + asset.amount, 0);
  }, [assets, categories]);

  const getCategoryTotal = useCallback((categoryId: string) => {
    return assets.filter(a => a.categoryId === categoryId).reduce((sum, a) => sum + a.amount, 0);
  }, [assets]);

  const getAssetsByCategory = useCallback((categoryId: string) => {
    return assets.filter(a => a.categoryId === categoryId);
  }, [assets]);

  const getCategoryProfit = useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return 0;
    const total = assets.filter(a => a.categoryId === categoryId).reduce((sum, a) => sum + a.amount, 0);
    return total * (category.interestRate / 100);
  }, [categories, assets]);

  const getTotalProjectedProfit = useCallback(() => {
    return categories.filter(c => c.isActive !== false).reduce((sum, cat) => {
      const total = assets.filter(a => a.categoryId === cat.id).reduce((s, a) => s + a.amount, 0);
      return sum + (total * (cat.interestRate / 100));
    }, 0);
  }, [categories, assets]);

  const getWeightedAverageRate = useCallback(() => {
    const activeCategories = categories.filter(c => c.isActive !== false);
    const activeCategoryIds = new Set(activeCategories.map(c => c.id));
    const activeAssets = assets.filter(a => activeCategoryIds.has(a.categoryId));
    const totalVal = activeAssets.reduce((sum, asset) => sum + asset.amount, 0);
    if (totalVal === 0) return 0;
    return activeCategories.reduce((sum, cat) => {
      const catTotal = activeAssets.filter(a => a.categoryId === cat.id).reduce((s, a) => s + a.amount, 0);
      return sum + (cat.interestRate * (catTotal / totalVal));
    }, 0);
  }, [categories, assets]);

  const getTotalMonthlyContribution = useCallback(() => {
    const activeCategories = categories.filter(c => c.isActive !== false);
    const activeCategoryIds = new Set(activeCategories.map(c => c.id));
    return assets
      .filter(a => activeCategoryIds.has(a.categoryId))
      .reduce((sum, asset) => sum + (asset.monthlyContribution || 0), 0);
  }, [categories, assets]);

  const getFirstAssetDate = useCallback(() => {
    if (assets.length === 0) return new Date();
    return assets.reduce((earliest, a) => 
      new Date(a.createdAt) < earliest ? new Date(a.createdAt) : earliest, 
      new Date(assets[0].createdAt)
    );
  }, [assets]);

  const getLargestAsset = useCallback(() => {
    if (assets.length === 0) return null;
    return assets.reduce((max, a) => a.amount > max.amount ? a : max, assets[0]);
  }, [assets]);

  const getAverageAssetValue = useCallback(() => {
    if (assets.length === 0) return 0;
    return assets.reduce((sum, a) => sum + a.amount, 0) / assets.length;
  }, [assets]);

  const getLargestProfit = useCallback(() => {
    if (categories.length === 0) return null;
    let maxProfit = 0;
    let maxCategory: Category | null = null;
    
    categories.forEach(cat => {
      const total = assets.filter(a => a.categoryId === cat.id).reduce((s, a) => s + a.amount, 0);
      const profit = total * (cat.interestRate / 100);
      if (profit > maxProfit) {
        maxProfit = profit;
        maxCategory = cat;
      }
    });
    
    return maxCategory ? { category: maxCategory, profit: maxProfit } : null;
  }, [categories, assets]);

  const getCategoryMonthlyContribution = useCallback((categoryId: string) => {
    return assets
      .filter(a => a.categoryId === categoryId)
      .reduce((sum, asset) => sum + (asset.monthlyContribution || 0), 0);
  }, [assets]);

  return {
    assets,
    categories,
    history,
    loading,
    syncing,
    addAsset,
    updateAsset,
    deleteAsset,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryActive,
    addContribution,
    getTotalValue,
    getCategoryTotal,
    getAssetsByCategory,
    getLargestAsset,
    getAverageAssetValue,
    getCategoryProfit,
    getTotalProjectedProfit,
    getWeightedAverageRate,
    getTotalMonthlyContribution,
    getFirstAssetDate,
    getLargestProfit,
    getCategoryMonthlyContribution,
    refetch: fetchData,
  };
}
