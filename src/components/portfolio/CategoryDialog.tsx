import { useState, useEffect } from 'react';
import { 
  TrendingUp, FileText, Lock, Wallet, Banknote, PieChart, 
  Building, Coins, CreditCard, DollarSign, Gem, Gift, Globe, 
  Home, Landmark, Layers, LineChart, Package, Percent, Shield, 
  Star, Target, Vault, Zap, Trash2, ArrowRight, ArrowLeft, Check
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Category, ColorKey, AVAILABLE_COLORS, AVAILABLE_ICONS } from '@/types/portfolio';
import { cn } from '@/lib/utils';
import { colorConfig } from '@/lib/categoryColors';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const iconComponents: Record<string, React.FC<{ className?: string }>> = {
  TrendingUp, FileText, Lock, Wallet, Banknote, PieChart,
  Building, Coins, CreditCard, DollarSign, Gem, Gift,
  Globe, Home, Landmark, Layers, LineChart, Package,
  Percent, Shield, Star, Target, Vault, Zap
};

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (name: string, icon: string, color: ColorKey, interestRate: number) => void;
  onUpdate?: (id: string, updates: { name?: string; icon?: string; color?: ColorKey; interestRate?: number }) => void;
  onDelete?: (id: string) => void;
  editingCategory?: Category | null;
}

export function CategoryDialog({
  open,
  onOpenChange,
  onAdd,
  onUpdate,
  onDelete,
  editingCategory,
}: CategoryDialogProps) {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string>('Wallet');
  const [color, setColor] = useState<ColorKey>('emerald');
  const [interestRate, setInterestRate] = useState(5);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const totalSteps = 2;

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setIcon(editingCategory.icon);
      setColor(editingCategory.color);
      setInterestRate(editingCategory.interestRate ?? 5);
      setStep(1);
    } else {
      setName('');
      setIcon('Wallet');
      setColor('emerald');
      setInterestRate(5);
      setStep(1);
    }
  }, [editingCategory, open]);

  const handleSubmit = () => {
    if (!name.trim()) return;

    if (editingCategory && onUpdate) {
      onUpdate(editingCategory.id, { name: name.trim(), icon, color, interestRate });
    } else {
      onAdd(name.trim(), icon, color, interestRate);
    }
    
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (editingCategory && onDelete) {
      onDelete(editingCategory.id);
      setShowDeleteAlert(false);
      onOpenChange(false);
    }
  };

  const canProceed = () => {
    if (step === 1) return name.trim().length > 0;
    return true;
  };

  const handleNext = () => {
    if (step < totalSteps && canProceed()) {
      setStep(step + 1);
    } else if (step === totalSteps) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const SelectedIcon = iconComponents[icon] || Wallet;
  const colors = colorConfig[color];

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg glass">
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center justify-between">
              <span>{editingCategory ? t('editCategory') : t('newCategoryTitle')}</span>
              <div className="flex gap-1">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      i + 1 === step ? 'bg-primary w-6' : i + 1 < step ? 'bg-primary' : 'bg-muted'
                    )}
                  />
                ))}
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6 mt-4">
            {/* Step 1: Name and Interest Rate */}
            {step === 1 && (
              <div className="space-y-6 animate-fade-in">
                <div className="space-y-2">
                  <Label htmlFor="catName">{t('categoryName')}</Label>
                  <Input
                    id="catName"
                    placeholder={t('categoryNamePlaceholder')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoFocus
                    className="h-12 text-lg"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>{t('annualInterestRate')}</Label>
                    <span className="text-xl font-bold text-primary">{interestRate}%</span>
                  </div>
                  <Slider
                    value={[interestRate]}
                    onValueChange={(value) => setInterestRate(value[0])}
                    max={20}
                    min={0}
                    step={0.5}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>0%</span>
                    <span>10%</span>
                    <span>20%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Color and Icon */}
            {step === 2 && (
              <div className="space-y-6 animate-fade-in">
                {/* Preview */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className={cn('p-3 rounded-xl border', colors.bg + '/20', colors.border)}>
                    <SelectedIcon className={cn('w-6 h-6', colors.text)} />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{name}</p>
                    <p className="text-sm text-muted-foreground">
                      {t('yearlyRate', { rate: interestRate })}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t('color')}</Label>
                  <div className="grid grid-cols-5 gap-2">
                    {AVAILABLE_COLORS.map((c) => (
                      <button
                        key={c.key}
                        type="button"
                        onClick={() => setColor(c.key)}
                        className={cn(
                          'h-10 rounded-xl transition-all duration-200',
                          c.class,
                          color === c.key 
                            ? 'ring-2 ring-offset-2 ring-offset-background ring-foreground scale-110' 
                            : 'hover:scale-105 opacity-70 hover:opacity-100'
                        )}
                        title={c.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>{t('icon')}</Label>
                  <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto p-1">
                    {AVAILABLE_ICONS.map((iconName) => {
                      const IconComponent = iconComponents[iconName];
                      const iconColors = colorConfig[color];
                      return (
                        <button
                          key={iconName}
                          type="button"
                          onClick={() => setIcon(iconName)}
                          className={cn(
                            'h-11 w-11 rounded-xl flex items-center justify-center transition-all duration-200 border',
                            icon === iconName 
                              ? cn(iconColors.bg + '/20', iconColors.border, iconColors.text, 'scale-110')
                              : 'bg-secondary/50 border-transparent text-muted-foreground hover:text-foreground hover:bg-secondary'
                          )}
                        >
                          <IconComponent className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
            
            {/* Navigation */}
            <div className="flex gap-3 pt-4">
              {editingCategory && !editingCategory.isDefault && onDelete && step === 1 && (
                <Button 
                  type="button" 
                  variant="destructive" 
                  onClick={() => setShowDeleteAlert(true)}
                  className="h-12"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
              
              {step > 1 ? (
                <Button type="button" variant="outline" onClick={handleBack} className="h-12 gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t('back')}
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 h-12">
                  {t('cancel')}
                </Button>
              )}
              
              <Button 
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 h-12 gap-2"
              >
                {step === totalSteps ? (
                  <>
                    <Check className="w-4 h-4" />
                    {editingCategory ? t('save') : t('addCategory')}
                  </>
                ) : (
                  <>
                    {t('next')}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent className="glass">
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteCategory')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteCategoryDescription', { name: editingCategory?.name || '' })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {t('deleteCategoryConfirm')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
