import { useCurrency, Currency } from '@/contexts/CurrencyContext';
import { Button } from '@/components/ui/button';

export function CurrencySwitcher() {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="flex items-center rounded-lg border border-border overflow-hidden bg-muted/30">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency('PLN')}
        className={`rounded-none px-3 py-1 h-8 text-xs font-medium transition-all ${
          currency === 'PLN' 
            ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
            : 'hover:bg-muted'
        }`}
      >
        PLN
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setCurrency('EUR')}
        className={`rounded-none px-3 py-1 h-8 text-xs font-medium transition-all ${
          currency === 'EUR' 
            ? 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground' 
            : 'hover:bg-muted'
        }`}
      >
        EUR
      </Button>
    </div>
  );
}
