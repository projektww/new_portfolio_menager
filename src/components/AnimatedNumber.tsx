import { useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { useCurrency } from '@/contexts/CurrencyContext';

interface AnimatedNumberProps {
  value: number;
  format?: 'currency' | 'compact' | 'number' | 'percent';
  duration?: number;
  className?: string;
}

export function AnimatedNumber({ 
  value, 
  format = 'currency', 
  duration = 500,
  className 
}: AnimatedNumberProps) {
  const animatedValue = useAnimatedNumber(value, duration);
  const { formatAmount, formatCompact } = useCurrency();

  const formattedValue = () => {
    switch (format) {
      case 'currency':
        return formatAmount(animatedValue);
      case 'compact':
        return formatCompact(animatedValue);
      case 'percent':
        return `${animatedValue.toFixed(1)}%`;
      case 'number':
      default:
        return animatedValue.toFixed(0);
    }
  };

  return <span className={className}>{formattedValue()}</span>;
}
