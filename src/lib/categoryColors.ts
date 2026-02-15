import { ColorKey } from '@/types/portfolio';

export const colorConfig: Record<ColorKey, {
  text: string;
  bg: string;
  border: string;
  gradient: string;
  hex: string;
}> = {
  emerald: {
    text: 'text-cat-emerald',
    bg: 'bg-cat-emerald',
    border: 'border-cat-emerald/30',
    gradient: 'from-cat-emerald/20 via-cat-emerald/5 to-transparent',
    hex: 'hsl(160, 84%, 45%)',
  },
  violet: {
    text: 'text-cat-violet',
    bg: 'bg-cat-violet',
    border: 'border-cat-violet/30',
    gradient: 'from-cat-violet/20 via-cat-violet/5 to-transparent',
    hex: 'hsl(262, 83%, 58%)',
  },
  amber: {
    text: 'text-cat-amber',
    bg: 'bg-cat-amber',
    border: 'border-cat-amber/30',
    gradient: 'from-cat-amber/20 via-cat-amber/5 to-transparent',
    hex: 'hsl(38, 92%, 50%)',
  },
  sky: {
    text: 'text-cat-sky',
    bg: 'bg-cat-sky',
    border: 'border-cat-sky/30',
    gradient: 'from-cat-sky/20 via-cat-sky/5 to-transparent',
    hex: 'hsl(199, 89%, 48%)',
  },
  lime: {
    text: 'text-cat-lime',
    bg: 'bg-cat-lime',
    border: 'border-cat-lime/30',
    gradient: 'from-cat-lime/20 via-cat-lime/5 to-transparent',
    hex: 'hsl(142, 71%, 45%)',
  },
  rose: {
    text: 'text-cat-rose',
    bg: 'bg-cat-rose',
    border: 'border-cat-rose/30',
    gradient: 'from-cat-rose/20 via-cat-rose/5 to-transparent',
    hex: 'hsl(340, 82%, 52%)',
  },
  orange: {
    text: 'text-cat-orange',
    bg: 'bg-cat-orange',
    border: 'border-cat-orange/30',
    gradient: 'from-cat-orange/20 via-cat-orange/5 to-transparent',
    hex: 'hsl(25, 95%, 53%)',
  },
  cyan: {
    text: 'text-cat-cyan',
    bg: 'bg-cat-cyan',
    border: 'border-cat-cyan/30',
    gradient: 'from-cat-cyan/20 via-cat-cyan/5 to-transparent',
    hex: 'hsl(185, 94%, 42%)',
  },
  indigo: {
    text: 'text-cat-indigo',
    bg: 'bg-cat-indigo',
    border: 'border-cat-indigo/30',
    gradient: 'from-cat-indigo/20 via-cat-indigo/5 to-transparent',
    hex: 'hsl(239, 84%, 67%)',
  },
  pink: {
    text: 'text-cat-pink',
    bg: 'bg-cat-pink',
    border: 'border-cat-pink/30',
    gradient: 'from-cat-pink/20 via-cat-pink/5 to-transparent',
    hex: 'hsl(330, 81%, 60%)',
  },
};
