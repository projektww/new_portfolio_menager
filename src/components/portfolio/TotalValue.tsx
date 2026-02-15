import { Wallet, TrendingUp, EyeOff, Eye } from 'lucide-react';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { getPositionLabel, getCategoryLabel } from '@/lib/i18n';

interface TotalValueProps {
  value: number;
  assetsCount: number;
  categoriesCount: number;
  projectedProfit: number;
  weightedRate: number;
  valuesHidden?: boolean;
  onToggleHidden?: () => void;
}

export function TotalValue({ 
  value, 
  assetsCount, 
  categoriesCount, 
  projectedProfit,
  weightedRate,
  valuesHidden = false,
  onToggleHidden,
}: TotalValueProps) {
  const { lang, t } = useLanguage();
  const monthlyProfit = projectedProfit / 12;

  return (
    <div className="relative overflow-hidden rounded-2xl glass glass-border p-8 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent" />
      <div className="absolute top-0 right-0 w-80 h-80 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-pulse-soft" />
      <div className="absolute bottom-0 left-0 w-60 h-60 bg-primary/3 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-3 rounded-xl bg-primary/20 backdrop-blur-sm">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="text-muted-foreground font-medium">{t('portfolioValue')}</span>
              {onToggleHidden && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onToggleHidden}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                  title={valuesHidden ? t('showValues') : t('hideValues')}
                >
                  {valuesHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                </Button>
              )}
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {valuesHidden ? (
                <span className="text-muted-foreground">********</span>
              ) : (
                <AnimatedNumber value={value} format="currency" duration={600} />
              )}
            </h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2 text-cat-emerald">
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">
                  {valuesHidden ? '********' : (
                    <>+<AnimatedNumber value={projectedProfit} format="currency" duration={600} /> {t('thisYear')}</>
                  )}
                </span>
              </div>
              <span className="text-muted-foreground hidden sm:inline">•</span>
              <p className="text-muted-foreground">
                {assetsCount} {getPositionLabel(assetsCount, lang)} {t('inCategories')} {categoriesCount} {getCategoryLabel(categoriesCount, lang)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 px-6 py-5 rounded-2xl glass glass-border">
            <div className="p-3 rounded-xl bg-cat-emerald/20">
              <TrendingUp className="w-6 h-6 text-cat-emerald" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground font-medium">{t('monthlyProfit')}</p>
              <p className="font-bold text-cat-emerald text-2xl md:text-3xl">
                {valuesHidden ? '********' : (
                  <>+<AnimatedNumber value={monthlyProfit} format="currency" duration={600} /></>
                )}
              </p>
              <p className="text-sm text-muted-foreground">
                {t('averageAnnual', { rate: weightedRate.toFixed(1) })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}