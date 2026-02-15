import { useState } from 'react';
import { 
  TrendingUp, FileText, Lock, Wallet, Banknote, PieChart, 
  Plus, Trash2, Pencil, Settings, Building, Coins, CreditCard,
  DollarSign, Gem, Gift, Globe, Home, Landmark, Layers,
  LineChart, Package, Percent, Shield, Star, Target, Vault, Zap,
  CalendarPlus, Power, PowerOff, ChevronDown, ChevronUp
} from 'lucide-react';
import { Category, Asset } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { colorConfig } from '@/lib/categoryColors';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  TrendingUp, FileText, Lock, Wallet, Banknote, PieChart,
  Building, Coins, CreditCard, DollarSign, Gem, Gift,
  Globe, Home, Landmark, Layers, LineChart, Package,
  Percent, Shield, Star, Target, Vault, Zap
};

interface CategoryCardProps {
  category: Category;
  total: number;
  assets: Asset[];
  percentage: number;
  projectedProfit: number;
  monthlyContribution: number;
  onAdd: () => void;
  onEdit: (asset: Asset) => void;
  onDelete: (id: string) => void;
  onEditCategory: () => void;
  onToggleActive: () => void;
  onDeleteCategory?: () => void;
  animationDelay?: number;
  isCompact?: boolean;
  valuesHidden?: boolean;
}

export function CategoryCard({
  category,
  total,
  assets,
  percentage,
  projectedProfit,
  monthlyContribution,
  onAdd,
  onEdit,
  onDelete,
  onEditCategory,
  onToggleActive,
  onDeleteCategory,
  animationDelay = 0,
  isCompact = false,
  valuesHidden = false,
}: CategoryCardProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [expandedAssetId, setExpandedAssetId] = useState<string | null>(null);
  
  const Icon = iconMap[category.icon] || Wallet;
  const colors = colorConfig[category.color];
  const isInactive = category.isActive === false;

  const averageRate = assets.length > 0 
    ? category.interestRate
    : category.interestRate;
  
  const profitAmount = (total * averageRate) / 100;

  // Compact version for inactive categories
  if (isCompact) {
    return (
      <div
        className="group relative overflow-hidden rounded-xl glass glass-border p-4 transition-all duration-300 opacity-60 hover:opacity-90 animate-slide-up"
        style={{ animationDelay: `${animationDelay}ms` }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('p-2 rounded-lg border', colors.bg + '/20', colors.border)}>
              <Icon className={cn('w-4 h-4', colors.text)} />
            </div>
            <div>
              <h4 className="font-medium text-sm">{category.name}</h4>
              <p className="text-xs text-muted-foreground">
                {valuesHidden ? '******' : formatAmount(total)}
              </p>
            </div>
          </div>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleActive}
              className="h-8 w-8"
              title={t('activate')}
            >
              <Power className="w-4 h-4 text-primary" />
            </Button>
            {onDeleteCategory && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onDeleteCategory}
                className="h-8 w-8 text-destructive hover:text-destructive"
                title={t('delete')}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-2xl glass glass-border p-6 transition-all duration-500 hover:border-border animate-slide-up card-hover",
        isInactive && "opacity-50"
      )}
      style={{ animationDelay: `${animationDelay}ms` }}
    >
      {/* Background gradient */}
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-60 dark:opacity-60', colors.gradient)} />
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className={cn('p-3 rounded-xl border backdrop-blur-sm', colors.bg + '/20', colors.border)}>
              <Icon className={cn('w-5 h-5', colors.text)} />
            </div>
            <div>
              <h3 className="font-semibold text-lg">{category.name}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">{averageRate}%</span>
                <span className="text-muted-foreground">•</span>
                <span className="text-cat-emerald font-medium">+{formatAmount(profitAmount)}/{t('perYear').replace('/', '')}</span>
              </div>
            </div>
          </div>
          
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleActive}
              className="h-8 w-8"
              title={t('deactivate')}
            >
              <PowerOff className="w-4 h-4 text-muted-foreground" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onEditCategory}
              className="h-8 w-8"
            >
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onAdd}
              className="h-8 w-8"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Monthly contribution badge */}
        {monthlyContribution > 0 && (
          <div className="mb-4 flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/15 border border-primary/30 w-fit">
            <CalendarPlus className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              +{formatAmount(monthlyContribution)}{t('perMonth')}
            </span>
          </div>
        )}

        {/* Value & Progress */}
        <div className="mb-5">
          <p className="text-3xl font-bold mb-3">
            {valuesHidden ? (
              <span className="text-muted-foreground">******</span>
            ) : (
              <AnimatedNumber value={total} format="currency" duration={500} />
            )}
          </p>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-2 bg-secondary/80 rounded-full overflow-hidden">
              <div
                className={cn('h-full rounded-full transition-all duration-700 ease-out', colors.bg)}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              />
            </div>
            <span className={cn('text-sm font-semibold tabular-nums', colors.text)}>
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>

        {/* Assets list */}
        {assets.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {assets.map((asset, index) => {
              const assetProfit = (asset.amount * category.interestRate) / 100;
              const isExpanded = expandedAssetId === asset.id;
              
              const monthsSinceCreation = Math.max(1, Math.floor((Date.now() - new Date(asset.createdAt).getTime()) / (1000 * 60 * 60 * 24 * 30)));
              const estimatedContributions = (asset.monthlyContribution || 0) * monthsSinceCreation;
              
              return (
                <Collapsible
                  key={asset.id}
                  open={isExpanded}
                  onOpenChange={() => setExpandedAssetId(isExpanded ? null : asset.id)}
                >
                  <div
                    className="rounded-xl bg-secondary/40 backdrop-blur-sm transition-all duration-200 hover:bg-secondary/60"
                    style={{ animationDelay: `${(animationDelay || 0) + (index + 1) * 50}ms` }}
                  >
                    <CollapsibleTrigger asChild>
                      <div className="flex items-center justify-between py-2.5 px-3 cursor-pointer group/item">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-medium truncate">{asset.name}</p>
                            {asset.monthlyContribution && asset.monthlyContribution > 0 && (
                              <CalendarPlus className="w-3 h-3 text-primary shrink-0" />
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <span>{formatAmount(asset.amount)}</span>
                            <span>•</span>
                            <span className="text-cat-emerald">+{formatAmount(assetProfit)}/{t('perYear').replace('/', '')}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </CollapsibleTrigger>
                    
                    <CollapsibleContent>
                      <div className="px-3 pb-3 pt-1 border-t border-border/30 space-y-3">
                        {/* Asset details */}
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="p-2 rounded-lg bg-secondary/50">
                            <p className="text-muted-foreground">{t('annualInterestRate')}</p>
                            <p className="font-medium">{t('yearlyRate', { rate: category.interestRate })}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-secondary/50">
                            <p className="text-muted-foreground">{t('yearlyProfit')}</p>
                            <p className="font-medium text-cat-emerald">+{formatAmount(assetProfit)}</p>
                          </div>
                          {asset.monthlyContribution && asset.monthlyContribution > 0 && (
                            <>
                              <div className="p-2 rounded-lg bg-secondary/50">
                                <p className="text-muted-foreground">{t('monthlyContributionShort')}</p>
                                <p className="font-medium text-primary">{formatAmount(asset.monthlyContribution)}</p>
                              </div>
                              <div className="p-2 rounded-lg bg-secondary/50">
                                <p className="text-muted-foreground">{t('contributedTotal')}</p>
                                <p className="font-medium">{formatAmount(estimatedContributions)}</p>
                              </div>
                            </>
                          )}
                          {asset.contributionDay && (
                            <div className="p-2 rounded-lg bg-secondary/50 col-span-2">
                              <p className="text-muted-foreground">{t('contributionDay')}</p>
                              <p className="font-medium">{t('dayOfMonth', { n: asset.contributionDay })}</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(asset);
                            }}
                          >
                            <Pencil className="w-3 h-3 mr-1" />
                            {t('edit')}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(asset.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        )}

        {/* Empty state */}
        {assets.length === 0 && (
          <button
            onClick={onAdd}
            className="w-full py-6 border-2 border-dashed border-border/50 rounded-xl text-muted-foreground hover:border-border hover:text-foreground transition-colors flex flex-col items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="text-sm">{t('firstAsset')}</span>
          </button>
        )}
      </div>
    </div>
  );
}
