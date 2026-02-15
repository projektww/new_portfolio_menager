export type ColorKey = 'emerald' | 'violet' | 'amber' | 'sky' | 'lime' | 'rose' | 'orange' | 'cyan' | 'indigo' | 'pink';

export interface Asset {
  id: string;
  name: string;
  amount: number;
  categoryId: string;
  monthlyContribution?: number; // Monthly contribution for this asset
  contributionDay?: number; // Day of month for contribution (1-28)
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: ColorKey;
  interestRate: number; // Annual interest rate in percent
  isDefault?: boolean;
  isActive?: boolean; // Whether category is active or disabled
}

export type SortOption = 'value' | 'monthlyContribution' | 'interestRate' | 'profit';

export interface HistoryEntry {
  id: string;
  type: 'add' | 'update' | 'delete';
  assetName: string;
  categoryName: string;
  amount: number;
  timestamp: Date;
}

export const AVAILABLE_COLORS: { key: ColorKey; label: string; class: string }[] = [
  { key: 'emerald', label: 'Szmaragdowy', class: 'bg-cat-emerald' },
  { key: 'violet', label: 'Fioletowy', class: 'bg-cat-violet' },
  { key: 'amber', label: 'Bursztynowy', class: 'bg-cat-amber' },
  { key: 'sky', label: 'Błękitny', class: 'bg-cat-sky' },
  { key: 'lime', label: 'Limonkowy', class: 'bg-cat-lime' },
  { key: 'rose', label: 'Różowy', class: 'bg-cat-rose' },
  { key: 'orange', label: 'Pomarańczowy', class: 'bg-cat-orange' },
  { key: 'cyan', label: 'Cyjan', class: 'bg-cat-cyan' },
  { key: 'indigo', label: 'Indygo', class: 'bg-cat-indigo' },
  { key: 'pink', label: 'Różowy jasny', class: 'bg-cat-pink' },
];

export const AVAILABLE_ICONS = [
  'TrendingUp', 'FileText', 'Lock', 'Wallet', 'Banknote', 'PieChart',
  'Building', 'Coins', 'CreditCard', 'DollarSign', 'Gem', 'Gift',
  'Globe', 'Home', 'Landmark', 'Layers', 'LineChart', 'Package',
  'Percent', 'Shield', 'Star', 'Target', 'Vault', 'Zap'
] as const;

export const DEFAULT_CATEGORIES: Category[] = [
  { id: 'stocks', name: 'Giełda', icon: 'TrendingUp', color: 'emerald', interestRate: 8, isDefault: true, isActive: true },
  { id: 'bonds', name: 'Obligacje', icon: 'FileText', color: 'violet', interestRate: 6, isDefault: true, isActive: true },
  { id: 'deposits', name: 'Lokaty', icon: 'Lock', color: 'amber', interestRate: 5, isDefault: true, isActive: true },
  { id: 'savings', name: 'Konta oszczędnościowe', icon: 'Wallet', color: 'sky', interestRate: 4, isDefault: true, isActive: true },
  { id: 'bank', name: 'Konto bankowe', icon: 'Landmark', color: 'indigo', interestRate: 0, isDefault: true, isActive: true },
  { id: 'cash', name: 'Gotówka', icon: 'Banknote', color: 'lime', interestRate: 0, isDefault: true, isActive: true },
  { id: 'funds', name: 'Fundusze', icon: 'PieChart', color: 'rose', interestRate: 7, isDefault: true, isActive: true },
  { id: 'crypto', name: 'Kryptowaluty', icon: 'Coins', color: 'orange', interestRate: 10, isDefault: true, isActive: true },
  { id: 'other', name: 'Inne', icon: 'Package', color: 'cyan', interestRate: 0, isDefault: true, isActive: true },
];