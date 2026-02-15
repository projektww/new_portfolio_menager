import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderPlus, ArrowUpDown, Wallet, Loader2 } from 'lucide-react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useCloudPortfolio } from '@/hooks/useCloudPortfolio';
import { useAuth } from '@/contexts/AuthContext';
import { Category, Asset, SortOption } from '@/types/portfolio';
import { TotalValue } from './TotalValue';
import { CategoryCard } from './CategoryCard';
import { PortfolioChart } from './PortfolioChart';
import { AddAssetDialog } from './AddAssetDialog';
import { CategoryDialog } from './CategoryDialog';
import { HistoryPanel } from './HistoryPanel';
import { ForecastPanel } from './ForecastPanel';
import { StatsPanel } from './StatsPanel';
import { ContributionNotifications } from './ContributionNotifications';
import { UserPanel } from '@/components/UserPanel';
import { Button } from '@/components/ui/button';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { CurrencySwitcher } from '@/components/CurrencySwitcher';
import { exportToCSV } from '@/lib/exportData';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Dashboard() {
  const { lang, t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  
  // Use cloud portfolio for logged-in users, local for guests
  const localPortfolio = usePortfolio();
  const cloudPortfolio = useCloudPortfolio();
  
  const portfolio = user ? cloudPortfolio : localPortfolio;
  const isCloudLoading = user && cloudPortfolio.loading;
  
  const {
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
  } = portfolio;

  const [assetDialogOpen, setAssetDialogOpen] = useState(false);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('value');
  const [valuesHidden, setValuesHidden] = useState(false);

  const totalValue = getTotalValue();
  const largestAsset = getLargestAsset();
  const averageValue = getAverageAssetValue();
  const projectedProfit = getTotalProjectedProfit();
  const weightedRate = getWeightedAverageRate();
  const totalMonthlyContribution = getTotalMonthlyContribution();
  const firstAssetDate = getFirstAssetDate();

  const { activeCategories, inactiveCategories } = useMemo(() => {
    const active = categories.filter(c => c.isActive !== false);
    const inactive = categories.filter(c => c.isActive === false);
    return { activeCategories: active, inactiveCategories: inactive };
  }, [categories]);

  const sortedActiveCategories = useMemo(() => {
    return [...activeCategories].sort((a, b) => {
      switch (sortBy) {
        case 'value':
          return getCategoryTotal(b.id) - getCategoryTotal(a.id);
        case 'monthlyContribution':
          return getCategoryMonthlyContribution(b.id) - getCategoryMonthlyContribution(a.id);
        case 'interestRate':
          return b.interestRate - a.interestRate;
        case 'profit':
          return getCategoryProfit(b.id) - getCategoryProfit(a.id);
        default:
          return getCategoryTotal(b.id) - getCategoryTotal(a.id);
      }
    });
  }, [activeCategories, sortBy, getCategoryTotal, getCategoryProfit, getCategoryMonthlyContribution]);

  const handleAddAsset = (categoryId?: string) => {
    setSelectedCategoryId(categoryId);
    setEditingAsset(null);
    setAssetDialogOpen(true);
  };

  const handleEditAsset = (asset: Asset) => {
    setEditingAsset(asset);
    setSelectedCategoryId(asset.categoryId);
    setAssetDialogOpen(true);
  };

  const handleAddCategory = () => {
    setEditingCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const chartData = categories.filter(c => c.isActive !== false).map((cat) => ({
    categoryId: cat.id,
    value: getCategoryTotal(cat.id),
  }));

  const activeCategoriesCount = categories.filter(c => c.isActive !== false && getCategoryTotal(c.id) > 0).length;

  const sortLabels: Record<SortOption, string> = {
    value: t('sortValue'),
    monthlyContribution: t('sortMonthlyContribution'),
    interestRate: t('sortInterestRate'),
    profit: t('sortProfit'),
  };

  const handleExport = useCallback(() => {
    exportToCSV(assets, categories, getCategoryTotal);
  }, [assets, categories, getCategoryTotal]);

  const handleConfirmContribution = useCallback((assetId: string, amount: number) => {
    addContribution(assetId, amount);
    const asset = assets.find(a => a.id === assetId);
    const category = asset ? categories.find(c => c.id === asset.categoryId) : null;
    toast({
      title: t('contributionConfirmed'),
      description: t('contributionConfirmedDesc', { 
        amount: amount.toLocaleString(lang === 'en' ? 'en-US' : 'pl-PL'), 
        asset: asset?.name || '', 
        category: category?.name || '' 
      }),
    });
  }, [addContribution, assets, categories, t, lang]);

  const landingPath = lang === 'pl' ? '/pl' : '/';

  // Show loading state for cloud portfolio
  if (authLoading || isCloudLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">{lang === 'pl' ? 'Ładowanie portfela...' : 'Loading portfolio...'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cat-violet/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <Link to={landingPath} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="p-1.5 sm:p-2 rounded-xl bg-primary/20">
                <Wallet className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              </div>
              <span className="text-lg sm:text-xl font-bold hidden sm:inline">pllwallet.com</span>
            </Link>
            <div className="flex items-center gap-1.5 sm:gap-3">
              <CurrencySwitcher />
              <LanguageSwitcher currentLang={lang} isApp />
              <Button variant="outline" size="sm" onClick={handleAddCategory} className="gap-1 sm:gap-2 hidden sm:flex">
                <FolderPlus className="w-4 h-4" />
                <span className="hidden md:inline">{t('newCategory')}</span>
              </Button>
              <Button size="sm" onClick={() => handleAddAsset()} className="gap-1 sm:gap-2">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">{t('addAsset')}</span>
              </Button>
              <UserPanel onExport={handleExport} onAddCategory={handleAddCategory} />
            </div>
          </div>
        </div>
      </header>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <TotalValue 
            value={totalValue} 
            assetsCount={assets.length}
            categoriesCount={activeCategoriesCount}
            projectedProfit={projectedProfit}
            weightedRate={weightedRate}
            valuesHidden={valuesHidden}
            onToggleHidden={() => setValuesHidden(!valuesHidden)}
          />
        </div>

        <ContributionNotifications 
          categories={categories} 
          assets={assets}
          onConfirmContribution={handleConfirmContribution}
        />

        <div className="grid lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">{t('categories')}</h2>
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                      <ArrowUpDown className="w-4 h-4" />
                      <span className="hidden sm:inline">{t('sortBy')}</span>
                      <span className="font-medium">{sortLabels[sortBy]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-popover">
                    <DropdownMenuItem onClick={() => setSortBy('value')}>{t('sortValue')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('monthlyContribution')}>{t('sortMonthlyContribution')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('interestRate')}>{t('sortInterestRate')}</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setSortBy('profit')}>{t('sortProfit')}</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span className="text-sm text-muted-foreground">{categories.length} {t('categoriesCount')}</span>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {sortedActiveCategories.map((category, index) => {
                const categoryTotal = getCategoryTotal(category.id);
                const percentage = totalValue > 0 ? (categoryTotal / totalValue) * 100 : 0;
                const categoryProfit = getCategoryProfit(category.id);
                const categoryContribution = getCategoryMonthlyContribution(category.id);
                
                return (
                  <CategoryCard
                    key={category.id}
                    category={category}
                    total={categoryTotal}
                    assets={getAssetsByCategory(category.id)}
                    percentage={percentage}
                    projectedProfit={categoryProfit}
                    monthlyContribution={categoryContribution}
                    onAdd={() => handleAddAsset(category.id)}
                    onEdit={handleEditAsset}
                    onDelete={deleteAsset}
                    onEditCategory={() => handleEditCategory(category)}
                    onToggleActive={() => toggleCategoryActive(category.id)}
                    animationDelay={index * 80}
                    isCompact={false}
                    valuesHidden={valuesHidden}
                  />
                );
              })}
            </div>

            {inactiveCategories.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">{t('inactiveCategories')}</h3>
                <div className="grid sm:grid-cols-3 gap-3">
                  {inactiveCategories.map((category, index) => {
                    const categoryTotal = getCategoryTotal(category.id);
                    const percentage = totalValue > 0 ? (categoryTotal / totalValue) * 100 : 0;
                    const categoryProfit = getCategoryProfit(category.id);
                    const categoryContribution = getCategoryMonthlyContribution(category.id);
                    
                    return (
                      <CategoryCard
                        key={category.id}
                        category={category}
                        total={categoryTotal}
                        assets={getAssetsByCategory(category.id)}
                        percentage={percentage}
                        projectedProfit={categoryProfit}
                        monthlyContribution={categoryContribution}
                        onAdd={() => handleAddAsset(category.id)}
                        onEdit={handleEditAsset}
                        onDelete={deleteAsset}
                        onEditCategory={() => handleEditCategory(category)}
                        onToggleActive={() => toggleCategoryActive(category.id)}
                        onDeleteCategory={() => deleteCategory(category.id)}
                        animationDelay={index * 50}
                        isCompact={true}
                        valuesHidden={valuesHidden}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold">{t('overview')}</h2>
            <PortfolioChart data={chartData} categories={categories.filter(c => c.isActive !== false)} />
            <HistoryPanel history={history} />
          </div>
        </div>

        {/* Stats Panel at bottom */}
        <div className="mb-8">
          <StatsPanel
            totalValue={totalValue}
            projectedProfit={projectedProfit}
            monthlyContribution={totalMonthlyContribution}
            largestAsset={largestAsset}
            averageValue={averageValue}
            getLargestProfit={getLargestProfit}
          />
        </div>

        {/* Forecast Panel at bottom */}
        <div className="mb-8">
          <ForecastPanel 
            totalValue={totalValue}
            weightedRate={weightedRate}
            categories={categories.filter(c => c.isActive !== false)}
            assets={assets}
            getCategoryTotal={getCategoryTotal}
            totalMonthlyContribution={totalMonthlyContribution}
            firstAssetDate={firstAssetDate}
          />
        </div>

        <footer className="mt-16 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            {t('madeBy')}{' '}
            <a href="https://projektenter.pl" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
              projektENTER
            </a>
            {' '}{t('locationTag')}
          </p>
        </footer>
      </div>

      <AddAssetDialog
        open={assetDialogOpen}
        onOpenChange={setAssetDialogOpen}
        onAdd={addAsset}
        onUpdate={updateAsset}
        editingAsset={editingAsset}
        defaultCategoryId={selectedCategoryId}
        categories={categories.filter(c => c.isActive !== false)}
      />

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        onAdd={addCategory}
        onUpdate={updateCategory}
        onDelete={deleteCategory}
        editingCategory={editingCategory}
      />
    </div>
  );
}
