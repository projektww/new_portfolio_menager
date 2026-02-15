import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

export type Currency = 'PLN' | 'EUR';

// Approximate exchange rate - in production this would come from an API
const EUR_TO_PLN_RATE = 4.32;

interface CurrencyContextType {
  currency: Currency;
  toggleCurrency: () => void;
  setCurrency: (currency: Currency) => void;
  convert: (amountInPLN: number) => number;
  formatAmount: (amountInPLN: number) => string;
  formatCompact: (amountInPLN: number) => string;
  currencySymbol: string;
}

const CurrencyContext = createContext<CurrencyContextType | null>(null);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrencyState] = useState<Currency>(() => {
    const saved = localStorage.getItem('preferred-currency');
    return (saved === 'EUR' || saved === 'PLN') ? saved : 'PLN';
  });

  const setCurrency = useCallback((newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem('preferred-currency', newCurrency);
  }, []);

  const toggleCurrency = useCallback(() => {
    setCurrency(currency === 'PLN' ? 'EUR' : 'PLN');
  }, [currency, setCurrency]);

  const convert = useCallback((amountInPLN: number): number => {
    if (currency === 'EUR') {
      return amountInPLN / EUR_TO_PLN_RATE;
    }
    return amountInPLN;
  }, [currency]);

  const formatAmount = useCallback((amountInPLN: number): string => {
    const amount = convert(amountInPLN);
    if (currency === 'EUR') {
      return new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount);
    }
    return new Intl.NumberFormat('pl-PL', {
      style: 'currency',
      currency: 'PLN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  }, [currency, convert]);

  const formatCompact = useCallback((amountInPLN: number): string => {
    const amount = convert(amountInPLN);
    const symbol = currency === 'EUR' ? '€' : 'zł';
    
    if (Math.abs(amount) >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ${symbol}`;
    }
    if (Math.abs(amount) >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ${symbol}`;
    }
    return formatAmount(amountInPLN);
  }, [currency, convert, formatAmount]);

  const currencySymbol = currency === 'EUR' ? '€' : 'zł';

  return (
    <CurrencyContext.Provider value={{ 
      currency, 
      toggleCurrency, 
      setCurrency, 
      convert, 
      formatAmount, 
      formatCompact,
      currencySymbol 
    }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
