import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Category } from '@/types/portfolio';
import { colorConfig } from '@/lib/categoryColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface PortfolioChartProps {
  data: { categoryId: string; value: number }[];
  categories: Category[];
}

export function PortfolioChart({ data, categories }: PortfolioChartProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  
  const chartData = data
    .filter(d => d.value > 0)
    .map(d => {
      const category = categories.find(c => c.id === d.categoryId);
      return {
        name: category?.name || t('unknown'),
        value: d.value,
        categoryId: d.categoryId,
        color: category ? colorConfig[category.color].hex : 'hsl(0, 0%, 50%)',
      };
    });

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-72 glass glass-border rounded-2xl">
        <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4">
          <div className="w-8 h-8 rounded-full border-4 border-muted-foreground/30 border-t-primary animate-spin" />
        </div>
        <p className="text-muted-foreground text-center">
          {t('addAssetsToSeeStructure')}
        </p>
      </div>
    );
  }

  const total = chartData.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="glass glass-border rounded-2xl p-6 animate-fade-in">
      <h3 className="text-lg font-semibold mb-4">{t('portfolioStructure')}</h3>
      
      <div className="h-64 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={3}
              dataKey="value"
              strokeWidth={0}
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.color}
                  className="transition-all duration-300 hover:opacity-80"
                />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  const percentage = ((data.value / total) * 100).toFixed(1);
                  return (
                    <div className="glass glass-border rounded-xl px-4 py-3 shadow-lg">
                      <p className="font-semibold">{data.name}</p>
                      <p className="text-sm text-muted-foreground">{formatAmount(data.value)}</p>
                      <p className="text-sm text-primary font-medium">{percentage}%</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <p className="text-2xl font-bold">{chartData.length}</p>
            <p className="text-xs text-muted-foreground">{t('categoriesLabel')}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-4">
        {chartData.map((item) => (
          <div key={item.categoryId} className="flex items-center gap-2 py-1">
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-muted-foreground truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
