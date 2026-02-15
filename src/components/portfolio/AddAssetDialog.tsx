import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Category, Asset } from '@/types/portfolio';
import { cn } from '@/lib/utils';
import { colorConfig } from '@/lib/categoryColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { 
  TrendingUp, FileText, Lock, Wallet, Banknote, PieChart, 
  Building, Coins, CreditCard, DollarSign, Gem, Gift, Globe, 
  Home, Landmark, Layers, LineChart, Package, Percent, Shield, 
  Star, Target, Vault, Zap, ChevronRight, CalendarPlus
} from 'lucide-react';

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  TrendingUp, FileText, Lock, Wallet, Banknote, PieChart,
  Building, Coins, CreditCard, DollarSign, Gem, Gift,
  Globe, Home, Landmark, Layers, LineChart, Package,
  Percent, Shield, Star, Target, Vault, Zap
};

interface AddAssetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, amount: number, categoryId: string, monthlyContribution?: number, contributionDay?: number) => void;
  onUpdate?: (id: string, updates: { name?: string; amount?: number; categoryId?: string; monthlyContribution?: number; contributionDay?: number }) => void;
  editingAsset?: Asset | null;
  defaultCategoryId?: string;
  categories: Category[];
}

export function AddAssetDialog({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  editingAsset,
  defaultCategoryId,
  categories,
}: AddAssetDialogProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  const [step, setStep] = useState<'category' | 'details'>(defaultCategoryId ? 'details' : 'category');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState<string>(defaultCategoryId || '');
  const [monthlyContribution, setMonthlyContribution] = useState<string>('');
  const [contributionDay, setContributionDay] = useState<number | undefined>(undefined);

  useEffect(() => {
    if (open) {
      if (editingAsset) {
        setName(editingAsset.name);
        setAmount(editingAsset.amount.toString());
        setCategoryId(editingAsset.categoryId);
        setMonthlyContribution(editingAsset.monthlyContribution?.toString() || '');
        setContributionDay(editingAsset.contributionDay);
        setStep('details');
      } else {
        setName('');
        setAmount('');
        setMonthlyContribution('');
        setContributionDay(undefined);
        if (defaultCategoryId) {
          setCategoryId(defaultCategoryId);
          setStep('details');
        } else {
          setCategoryId('');
          setStep('category');
        }
      }
    }
  }, [editingAsset, defaultCategoryId, open]);

  const handleCategorySelect = (id: string) => {
    setCategoryId(id);
    setStep('details');
  };

  const handleBack = () => {
    setStep('category');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount.replace(',', '.').replace(/\s/g, ''));
    const parsedContribution = monthlyContribution ? parseFloat(monthlyContribution.replace(',', '.').replace(/\s/g, '')) : undefined;
    
    if (!name.trim() || isNaN(parsedAmount) || parsedAmount <= 0 || !categoryId) return;

    if (editingAsset && onUpdate) {
      onUpdate(editingAsset.id, { 
        name: name.trim(), 
        amount: parsedAmount, 
        categoryId,
        monthlyContribution: parsedContribution && parsedContribution > 0 ? parsedContribution : undefined,
        contributionDay: parsedContribution && parsedContribution > 0 ? contributionDay : undefined,
      });
    } else {
      onAdd(
        name.trim(), 
        parsedAmount, 
        categoryId,
        parsedContribution && parsedContribution > 0 ? parsedContribution : undefined,
        parsedContribution && parsedContribution > 0 ? contributionDay : undefined
      );
    }
    
    onOpenChange(false);
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const IconComponent = selectedCategory ? iconComponents[selectedCategory.icon] : null;
  const colors = selectedCategory ? colorConfig[selectedCategory.color] : null;
  const parsedContribution = monthlyContribution ? parseFloat(monthlyContribution.replace(',', '.').replace(/\s/g, '')) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md glass">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {editingAsset ? t('editAsset') : t('addNewAsset')}
          </DialogTitle>
        </DialogHeader>
        
        {step === 'category' && !editingAsset && (
          <div className="space-y-4 mt-4">
            <p className="text-sm text-muted-foreground">{t('selectCategoryForAsset')}</p>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((cat) => {
                const CatIcon = iconComponents[cat.icon];
                const catColors = colorConfig[cat.color];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategorySelect(cat.id)}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-xl border transition-all duration-200',
                      'bg-secondary/30 border-border/50 hover:border-primary/50 hover:bg-secondary/50',
                      'text-left group'
                    )}
                  >
                    <div className={cn('p-2 rounded-lg', catColors.bg + '/20', catColors.text)}>
                      <CatIcon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{cat.name}</p>
                      <p className="text-xs text-muted-foreground">{t('yearlyRate', { rate: cat.interestRate })}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </button>
                );
              })}
            </div>
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full h-12 mt-4">
              {t('cancel')}
            </Button>
          </div>
        )}

        {step === 'details' && (
          <form onSubmit={handleSubmit} className="space-y-5 mt-4">
            {/* Selected category display */}
            {selectedCategory && IconComponent && colors && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/30 border border-border/50">
                <div className={cn('p-2 rounded-lg', colors.bg + '/20', colors.text)}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{selectedCategory.name}</p>
                  <p className="text-xs text-muted-foreground">{t('interestRateLabel', { rate: selectedCategory.interestRate })}</p>
                </div>
                {!editingAsset && !defaultCategoryId && (
                  <Button type="button" variant="ghost" size="sm" onClick={handleBack}>
                    {t('change')}
                  </Button>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">{t('amount')}</Label>
              <Input
                id="amount"
                type="text"
                inputMode="decimal"
                placeholder="0,00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                autoFocus
                className="h-14 text-2xl font-bold text-center"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">{t('positionName')}</Label>
              <Input
                id="name"
                placeholder={t('positionNamePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Monthly contribution section */}
            <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 space-y-4">
              <div className="flex items-center gap-2">
                <CalendarPlus className="w-4 h-4 text-primary" />
                <Label className="font-medium">{t('monthlyContributionOptional')}</Label>
              </div>
              
              <div className="space-y-2">
                <Input
                  type="text"
                  inputMode="decimal"
                  placeholder="0,00"
                  value={monthlyContribution}
                  onChange={(e) => setMonthlyContribution(e.target.value)}
                  className="h-12"
                />
                {parsedContribution > 0 && (
                  <p className="text-xs text-cat-emerald">+{formatAmount(parsedContribution)}{t('perMonth')}</p>
                )}
              </div>

              {parsedContribution > 0 && (
                <div className="flex items-center gap-3">
                  <Label className="whitespace-nowrap text-sm">{t('contributionDay')}</Label>
                  <select
                    value={contributionDay || ''}
                    onChange={(e) => setContributionDay(e.target.value ? Number(e.target.value) : undefined)}
                    className="flex-1 h-10 rounded-lg border border-input bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="">{t('noReminder')}</option>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                      <option key={day} value={day}>{t('dayOfMonth', { n: day })}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  if (!editingAsset && !defaultCategoryId) {
                    handleBack();
                  } else {
                    onOpenChange(false);
                  }
                }} 
                className="flex-1 h-12"
              >
                {!editingAsset && !defaultCategoryId ? t('back') : t('cancel')}
              </Button>
              <Button type="submit" className="flex-1 h-12">
                {editingAsset ? t('saveChanges') : t('addAsset')}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
