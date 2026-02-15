import { useMemo, useState } from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart, Line } from 'recharts';
import { Category, Asset } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TrendingUp, Wallet, PiggyBank, Percent, ArrowUpRight, ChevronRight, BarChart3 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getDateLocale } from '@/lib/i18n';

interface ForecastPanelProps {
  totalValue: number;
  weightedRate: number;
  categories: Category[];
  assets: Asset[];
  getCategoryTotal: (categoryId: string) => number;
  totalMonthlyContribution: number;
  firstAssetDate: Date;
}

type ForecastPeriod = '1y' | '5y' | '10y';
type ForecastStep = 'select' | 'stats' | 'chart';

export function ForecastPanel({ 
  totalValue, 
  weightedRate, 
  categories, 
  assets,
  getCategoryTotal, 
  totalMonthlyContribution,
  firstAssetDate 
}: ForecastPanelProps) {
  const { lang, t } = useLanguage();
  const { formatAmount, formatCompact } = useCurrency();
  const dateLocale = getDateLocale(lang);
  
  const [step, setStep] = useState<ForecastStep>('select');
  const [period, setPeriod] = useState<ForecastPeriod>('1y');
  
  const periodMonths = { '1y': 12, '5y': 60, '10y': 120 };
  const periodLabels = { '1y': t('year1'), '5y': t('years5'), '10y': t('years10') };
  const periodDescriptions = { '1y': t('shortTerm'), '5y': t('mediumTerm'), '10y': t('longTerm') };

  const data = useMemo(() => {
    const points: Array<{
      date: string;
      value: number | null;
      forecast: number | null;
      contributions: number | null;
      isForecast: boolean;
      monthIndex: number;
      contribution: number;
    }> = [];
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    
    const firstDate = new Date(firstAssetDate);
    const monthsSinceFirst = Math.max(
      0,
      (currentYear - firstDate.getFullYear()) * 12 + (currentMonth - firstDate.getMonth())
    );
    
    const assetsByMonth = new Map<string, number>();
    const contributionsByMonth = new Map<string, number>();
    let runningTotal = 0;
    let runningContributions = 0;
    
    const sortedAssets = [...assets].sort((a, b) => 
      new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
    
    sortedAssets.forEach(asset => {
      const assetDate = new Date(asset.createdAt);
      const monthKey = `${assetDate.getFullYear()}-${assetDate.getMonth()}`;
      runningTotal += asset.amount;
      assetsByMonth.set(monthKey, runningTotal);
      
      if (asset.name.startsWith('Dopłata -') || asset.name.startsWith('Contribution -')) {
        runningContributions += asset.amount;
      }
      contributionsByMonth.set(monthKey, runningContributions);
    });
    
    const maxHistory = period === '1y' ? 12 : period === '5y' ? 36 : 48;
    const historyMonths = Math.min(monthsSinceFirst, maxHistory);
    let lastKnownValue = 0;
    let lastKnownContributions = 0;
    let cumulativeContribution = 0;
    
    for (let i = -historyMonths; i <= 0; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (assetsByMonth.has(monthKey)) {
        lastKnownValue = assetsByMonth.get(monthKey)!;
      }
      
      if (contributionsByMonth.has(monthKey)) {
        lastKnownContributions = contributionsByMonth.get(monthKey)!;
      }
      
      const hasData = date >= firstDate;
      
      points.push({
        date: date.toLocaleDateString(dateLocale, { month: 'short', year: '2-digit' }),
        value: hasData ? (i === 0 ? totalValue : lastKnownValue) : null,
        forecast: null,
        contributions: hasData ? lastKnownContributions : null,
        isForecast: false,
        monthIndex: i,
        contribution: 0,
      });
    }
    
    const monthlyRate = weightedRate / 100 / 12;
    const forecastMonths = periodMonths[period];
    
    for (let i = 1; i <= forecastMonths; i++) {
      const date = new Date(currentYear, currentMonth + i, 1);
      
      const compoundedValue = totalValue * Math.pow(1 + monthlyRate, i);
      const contributionValue = totalMonthlyContribution > 0 && monthlyRate > 0
        ? totalMonthlyContribution * ((Math.pow(1 + monthlyRate, i) - 1) / monthlyRate)
        : totalMonthlyContribution * i;
      
      const forecastValue = compoundedValue + contributionValue;
      cumulativeContribution = totalMonthlyContribution * i;
      
      const interval = period === '1y' ? 1 : period === '5y' ? 3 : 6;
      if (i % interval === 0 || i === forecastMonths) {
        points.push({
          date: date.toLocaleDateString(dateLocale, { month: 'short', year: '2-digit' }),
          value: null,
          forecast: forecastValue,
          contributions: null,
          isForecast: true,
          monthIndex: i,
          contribution: cumulativeContribution,
        });
      }
    }
    
    return points;
  }, [totalValue, weightedRate, period, assets, firstAssetDate, totalMonthlyContribution, dateLocale]);

  const forecastMonths = periodMonths[period];
  const monthlyRate = weightedRate / 100 / 12;
  
  const compoundedValue = totalValue * Math.pow(1 + monthlyRate, forecastMonths);
  const contributionValue = totalMonthlyContribution > 0 && monthlyRate > 0
    ? totalMonthlyContribution * ((Math.pow(1 + monthlyRate, forecastMonths) - 1) / monthlyRate)
    : totalMonthlyContribution * forecastMonths;
  
  const projectedValue = compoundedValue + contributionValue;
  const projectedProfit = projectedValue - totalValue - (totalMonthlyContribution * forecastMonths);
  const totalContributions = totalMonthlyContribution * forecastMonths;
  const percentageGrowth = totalValue > 0 ? ((projectedValue - totalValue) / totalValue) * 100 : 0;
  const historicalDataPoints = data.filter(d => d.value !== null && d.monthIndex < 0).length;

  if (totalValue === 0) {
    return (
      <div className="glass glass-border rounded-2xl p-6 animate-slide-up">
        <h3 className="text-lg font-semibold mb-4">{t('forecastTitle')}</h3>
        <div className="h-40 flex items-center justify-center text-muted-foreground">
          {t('addAssetsToSeeForecast')}
        </div>
      </div>
    );
  }

  const handlePeriodSelect = (p: ForecastPeriod) => {
    setPeriod(p);
    setStep('stats');
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-6">
      {(['select', 'stats', 'chart'] as ForecastStep[]).map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <button
            onClick={() => setStep(s)}
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all',
              step === s 
                ? 'bg-primary text-primary-foreground' 
                : s === 'select' || (s === 'stats' && step !== 'select') || (s === 'chart' && step === 'chart')
                  ? 'bg-secondary text-foreground cursor-pointer hover:bg-secondary/80'
                  : 'bg-secondary/50 text-muted-foreground'
            )}
          >
            {i + 1}
          </button>
          {i < 2 && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
        </div>
      ))}
    </div>
  );

  const getSubtitleText = () => {
    if (step === 'select') return t('selectPeriod');
    if (step === 'stats') return t('statsFor', { period: periodLabels[period] });
    if (historicalDataPoints > 0) {
      return t('historyAndForecast', { months: historicalDataPoints, period: periodLabels[period] });
    }
    return t('forecastFor', { period: periodLabels[period] });
  };

  return (
    <div className="glass glass-border rounded-2xl p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold">{t('forecastTitle')}</h3>
          <p className="text-sm text-muted-foreground mt-1">
            {getSubtitleText()}
          </p>
        </div>
        {step !== 'select' && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setStep('select')}
          >
            {t('changePeriod')}
          </Button>
        )}
      </div>
      
      {renderStepIndicator()}

      {/* Step 1: Select Period */}
      {step === 'select' && (
        <div className="grid grid-cols-3 gap-4">
          {(Object.entries(periodLabels) as [ForecastPeriod, string][]).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handlePeriodSelect(key)}
              className="p-6 rounded-xl bg-secondary/40 border border-border/50 hover:border-primary/50 hover:bg-secondary/60 transition-all duration-200 text-center group"
            >
              <div className="p-3 rounded-xl bg-primary/10 w-fit mx-auto mb-3 group-hover:bg-primary/20 transition-colors">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <p className="font-semibold text-lg mb-1">{label}</p>
              <p className="text-sm text-muted-foreground">
                {periodDescriptions[key]}
              </p>
            </button>
          ))}
        </div>
      )}

      {/* Step 2: Show Stats */}
      {step === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{t('initialValue')}</p>
              </div>
              <p className="font-bold text-lg">{formatAmount(totalValue)}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-primary/10 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-primary" />
                <p className="text-xs text-muted-foreground">{t('after', { period: periodLabels[period] })}</p>
              </div>
              <p className="font-bold text-lg text-primary">{formatAmount(projectedValue)}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-cat-emerald/10 border border-cat-emerald/20">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUpRight className="w-4 h-4 text-cat-emerald" />
                <p className="text-xs text-muted-foreground">{t('interestProfit')}</p>
              </div>
              <p className="font-bold text-lg text-cat-emerald">+{formatAmount(projectedProfit)}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <PiggyBank className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{t('totalContributions')}</p>
              </div>
              <p className="font-bold text-lg">{formatAmount(totalContributions)}</p>
            </div>
            
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-4 h-4 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{t('totalGrowth')}</p>
              </div>
              <p className="font-bold text-lg">{percentageGrowth.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button onClick={() => setStep('chart')} className="gap-2">
              {t('seeChart')}
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Show Chart */}
      {step === 'chart' && (
        <div className="space-y-6">
          {/* Mini stats row */}
          <div className="grid grid-cols-4 gap-3 text-center">
            <div>
              <p className="text-xl font-bold">{formatAmount(totalValue)}</p>
              <p className="text-xs text-muted-foreground">{t('start')}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-primary">{formatAmount(projectedValue)}</p>
              <p className="text-xs text-muted-foreground">{t('after', { period: periodLabels[period] })}</p>
            </div>
            <div>
              <p className="text-xl font-bold text-cat-emerald">+{formatAmount(projectedProfit)}</p>
              <p className="text-xs text-muted-foreground">{t('interestProfit')}</p>
            </div>
            <div>
              <p className="text-xl font-bold">{percentageGrowth.toFixed(1)}%</p>
              <p className="text-xs text-muted-foreground">{t('growth')}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 10, right: 10, bottom: 5, left: 10 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142 76% 36%)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(142 76% 36%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorContributions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(38 92% 50%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(38 92% 50%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  tickFormatter={(value) => formatCompact(value)}
                  tickLine={false}
                  axisLine={false}
                  width={65}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                    padding: '12px 16px',
                  }}
                  formatter={(value: number, name: string) => [
                    formatAmount(value),
                    name === 'forecast' ? t('forecastLabel') : name === 'contributions' ? t('contributionsSum') : t('portfolioValueLabel')
                  ]}
                  labelStyle={{ color: 'hsl(var(--foreground))', fontWeight: 600, marginBottom: '4px' }}
                />
                <ReferenceLine 
                  x={data.find(d => d.monthIndex === 0)?.date} 
                  stroke="hsl(var(--muted-foreground))" 
                  strokeDasharray="5 5"
                  label={{ value: t('today'), position: 'top', fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  fill="url(#colorValue)"
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2.5}
                  dot={false}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(142 76% 36%)"
                  fill="url(#colorForecast)"
                  strokeWidth={2.5}
                  strokeDasharray="8 4"
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="forecast"
                  stroke="hsl(142 76% 36%)"
                  strokeWidth={2.5}
                  strokeDasharray="8 4"
                  dot={false}
                  connectNulls={false}
                />
                <Area
                  type="monotone"
                  dataKey="contributions"
                  stroke="hsl(38 92% 50%)"
                  fill="url(#colorContributions)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
                <Line
                  type="monotone"
                  dataKey="contributions"
                  stroke="hsl(38 92% 50%)"
                  strokeWidth={2}
                  dot={false}
                  connectNulls={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 text-sm flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-5 h-1 bg-primary rounded-full" />
              <span className="text-muted-foreground">{t('portfolioValueLabel')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-1 bg-cat-emerald rounded-full" style={{ background: 'repeating-linear-gradient(90deg, hsl(142 76% 36%), hsl(142 76% 36%) 4px, transparent 4px, transparent 8px)' }} />
              <span className="text-muted-foreground">{t('forecastLabel')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-5 h-1 rounded-full" style={{ backgroundColor: 'hsl(38 92% 50%)' }} />
              <span className="text-muted-foreground">{t('contributionsSum')}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
