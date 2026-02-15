import { useState, useEffect, useCallback } from 'react';
import { Asset, Category, HistoryEntry, DEFAULT_CATEGORIES } from '@/types/portfolio';

const ASSETS_KEY = 'portfolio-assets';
const CATEGORIES_KEY = 'portfolio-categories';
const HISTORY_KEY = 'portfolio-history';

export function usePortfolio() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  // Load from localStorage
  useEffect(() => {
    const storedAssets = localStorage.getItem(ASSETS_KEY);
    const storedCategories = localStorage.getItem(CATEGORIES_KEY);
    const storedHistory = localStorage.getItem(HISTORY_KEY);

    if (storedAssets) {
      try {
        const parsed = JSON.parse(storedAssets);
        setAssets(parsed.map((a: Asset) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        })));
      } catch {
        setAssets([]);
      }
    }

    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories));
      } catch {
        setCategories(DEFAULT_CATEGORIES);
      }
    } else {
      setCategories(DEFAULT_CATEGORIES);
    }

    if (storedHistory) {
      try {
        const parsed = JSON.parse(storedHistory);
        setHistory(parsed.map((h: HistoryEntry) => ({
          ...h,
          timestamp: new Date(h.timestamp),
        })));
      } catch {
        setHistory([]);
      }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }, [history]);

  const addHistoryEntry = useCallback((type: HistoryEntry['type'], assetName: string, categoryName: string, amount: number) => {
    const entry: HistoryEntry = {
      id: crypto.randomUUID(),
      type,
      assetName,
      categoryName,
      amount,
      timestamp: new Date(),
    };
    setHistory(prev => [entry, ...prev].slice(0, 50)); // Keep last 50 entries
  }, []);

  const addAsset = useCallback((name: string, amount: number, categoryId: string, monthlyContribution?: number, contributionDay?: number) => {
    const category = categories.find(c => c.id === categoryId);
    const newAsset: Asset = {
      id: crypto.randomUUID(),
      name,
      amount,
      categoryId,
      monthlyContribution,
      contributionDay,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAssets(prev => [...prev, newAsset]);
    if (category) {
      addHistoryEntry('add', name, category.name, amount);
    }
  }, [categories, addHistoryEntry]);

  const updateAsset = useCallback((id: string, updates: Partial<Omit<Asset, 'id' | 'createdAt'>>) => {
    setAssets(prev => prev.map(a => {
      if (a.id === id) {
        const category = categories.find(c => c.id === (updates.categoryId || a.categoryId));
        if (category) {
          addHistoryEntry('update', updates.name || a.name, category.name, updates.amount || a.amount);
        }
        return { ...a, ...updates, updatedAt: new Date() };
      }
      return a;
    }));
  }, [categories, addHistoryEntry]);

  const deleteAsset = useCallback((id: string) => {
    const asset = assets.find(a => a.id === id);
    if (asset) {
      const category = categories.find(c => c.id === asset.categoryId);
      if (category) {
        addHistoryEntry('delete', asset.name, category.name, asset.amount);
      }
    }
    setAssets(prev => prev.filter(a => a.id !== id));
  }, [assets, categories, addHistoryEntry]);

  const addCategory = useCallback((name: string, icon: string, color: Category['color'], interestRate: number = 5) => {
    const newCategory: Category = {
      id: crypto.randomUUID(),
      name,
      icon,
      color,
      interestRate,
      isDefault: false,
      isActive: true,
    };
    setCategories(prev => [...prev, newCategory]);
    return newCategory;
  }, []);

  const toggleCategoryActive = useCallback((id: string) => {
    setCategories(prev => prev.map(c => 
      c.id === id ? { ...c, isActive: c.isActive === false ? true : false } : c
    ));
  }, []);

  const updateCategory = useCallback((id: string, updates: Partial<Omit<Category, 'id'>>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  }, []);

  const deleteCategory = useCallback((id: string) => {
    // Also delete all assets in this category
    setAssets(prev => prev.filter(a => a.categoryId !== id));
    setCategories(prev => prev.filter(c => c.id !== id));
  }, []);

  const getTotalValue = useCallback(() => {
    // Only count assets from active categories
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
    // Sum from assets instead of categories
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

  const addContribution = useCallback((assetId: string, amount: number) => {
    const asset = assets.find(a => a.id === assetId);
    if (!asset) return;
    
    updateAsset(assetId, { amount: asset.amount + amount });
  }, [assets, updateAsset]);

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
  };
}
