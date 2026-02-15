import { Sparkles, CalendarPlus, TrendingUp, BarChart3, Award } from 'lucide-react';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Asset, Category } from '@/types/portfolio';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface StatsPanelProps {
  totalValue: number;
  projectedProfit: number;
  monthlyContribution: number;
  largestAsset: Asset | null;
  averageValue: number;
  getLargestProfit: () => { category: Category; profit: number } | null;
}

export function StatsPanel({
  totalValue,
  projectedProfit,
  monthlyContribution,
  largestAsset,
  averageValue,
  getLargestProfit,
}: StatsPanelProps) {
  const { t } = useLanguage();
  const { formatAmount, formatCompact } = useCurrency();
  const yearlyWithSavings = projectedProfit + (monthlyContribution * 12);
  const projectedValue = totalValue + yearlyWithSavings;
  const largestProfitData = getLargestProfit();

  return (
    <div className="glass glass-border rounded-2xl p-6 animate-slide-up">
      <h3 className="text-lg font-semibold mb-5">{t('portfolioStats')}</h3>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Projected value */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-cat-emerald/10 to-cat-emerald/5 border border-cat-emerald/20 transition-all duration-200 hover:border-cat-emerald/40 hover:shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-cat-emerald/20">
              <Sparkles className="w-5 h-5 text-cat-emerald" />
            </div>
          </div>
          <p className="text-2xl font-bold text-cat-emerald mb-1">
            <AnimatedNumber value={projectedValue} format="currency" duration={600} />
          </p>
          <p className="text-xs text-muted-foreground">{t('forecast1YearLabel')}</p>
          <p className="text-xs text-cat-emerald/80 mt-1">
            +<AnimatedNumber value={yearlyWithSavings} format="currency" duration={600} />
          </p>
        </div>

        {/* Monthly contributions */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 transition-all duration-200 hover:border-primary/40 hover:shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <CalendarPlus className="w-5 h-5 text-primary" />
            </div>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">
            <AnimatedNumber value={monthlyContribution} format="currency" duration={600} />
          </p>
          <p className="text-xs text-muted-foreground">{t('monthlyContributionsLabel')}</p>
          <p className="text-xs text-primary/80 mt-1">
            {formatAmount(monthlyContribution * 12)}{t('perYear')}
          </p>
        </div>

        {/* Largest position */}
        <div className="p-4 rounded-xl bg-secondary/40 border border-border/50 transition-all duration-200 hover:bg-secondary/60 hover:border-border hover:shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-secondary">
              <TrendingUp className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">
            {largestAsset ? formatCompact(largestAsset.amount) : '—'}
          </p>
          <p className="text-xs text-muted-foreground">{t('largestPosition')}</p>
          {largestAsset && (
            <p className="text-xs text-muted-foreground mt-1 truncate">
              {largestAsset.name}
            </p>
          )}
        </div>

        {/* Average value */}
        <div className="p-4 rounded-xl bg-secondary/40 border border-border/50 transition-all duration-200 hover:bg-secondary/60 hover:border-border hover:shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-2 rounded-lg bg-secondary">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
            </div>
          </div>
          <p className="text-2xl font-bold mb-1">
            {formatCompact(averageValue)}
          </p>
          <p className="text-xs text-muted-foreground">{t('averageValue')}</p>
          {largestProfitData && (
            <p className="text-xs text-cat-emerald mt-1 truncate">
              {t('bestCategory', { name: largestProfitData.category.name })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
