import { useMemo, useState, useEffect } from 'react';
import { Bell, X, Check, Calendar } from 'lucide-react';
import { Category, Asset } from '@/types/portfolio';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { colorConfig } from '@/lib/categoryColors';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';

interface ContributionNotification {
  id: string;
  assetId: string;
  assetName: string;
  categoryId: string;
  categoryName: string;
  categoryColor: Category['color'];
  amount: number;
  daysUntil: number;
  contributionDay: number;
}

interface ContributionNotificationsProps {
  categories: Category[];
  assets: Asset[];
  onConfirmContribution: (assetId: string, amount: number) => void;
}

const DISMISSED_KEY = 'dismissed-contribution-notifications';

export function ContributionNotifications({ categories, assets, onConfirmContribution }: ContributionNotificationsProps) {
  const { t } = useLanguage();
  const { formatAmount } = useCurrency();
  
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(DISMISSED_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const currentMonth = `${new Date().getFullYear()}-${new Date().getMonth()}`;
        const valid = parsed.filter((id: string) => id.startsWith(currentMonth));
        return new Set(valid);
      } catch {
        return new Set();
      }
    }
    return new Set();
  });

  useEffect(() => {
    localStorage.setItem(DISMISSED_KEY, JSON.stringify([...dismissedIds]));
  }, [dismissedIds]);

  const notifications = useMemo(() => {
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    const result: ContributionNotification[] = [];
    
    const activeCategoryIds = new Set(categories.filter(c => c.isActive !== false).map(c => c.id));
    
    assets
      .filter(a => activeCategoryIds.has(a.categoryId) && a.monthlyContribution && a.monthlyContribution > 0 && a.contributionDay)
      .forEach(asset => {
        const category = categories.find(c => c.id === asset.categoryId);
        if (!category) return;
        
        const contributionDay = asset.contributionDay!;
        
        let daysUntil: number;
        let isOverdue = false;
        
        if (contributionDay >= currentDay) {
          daysUntil = contributionDay - currentDay;
        } else {
          daysUntil = currentDay - contributionDay;
          isOverdue = true;
        }
        
        if (daysUntil <= 7 || isOverdue) {
          const notificationId = `${currentYear}-${currentMonth}-${asset.id}`;
          
          result.push({
            id: notificationId,
            assetId: asset.id,
            assetName: asset.name,
            categoryId: category.id,
            categoryName: category.name,
            categoryColor: category.color,
            amount: asset.monthlyContribution!,
            daysUntil: isOverdue ? -daysUntil : daysUntil,
            contributionDay,
          });
        }
      });
    
    const filtered = result.filter(n => !dismissedIds.has(n.id));
    return filtered.sort((a, b) => a.daysUntil - b.daysUntil);
  }, [categories, assets, dismissedIds]);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
  };

  const handleConfirm = (notification: ContributionNotification) => {
    onConfirmContribution(notification.assetId, notification.amount);
    handleDismiss(notification.id);
  };

  if (notifications.length === 0) return null;

  const getUrgencyText = (daysUntil: number) => {
    if (daysUntil < 0) return t('overdueDays', { n: Math.abs(daysUntil) });
    if (daysUntil === 0) return t('todayContribution');
    if (daysUntil === 1) return t('tomorrow');
    return t('inDays', { n: daysUntil });
  };

  const getUrgencyClass = (daysUntil: number) => {
    if (daysUntil < 0) return 'bg-destructive/10 border-destructive/30';
    if (daysUntil === 0) return 'bg-cat-rose/10 border-cat-rose/30';
    if (daysUntil <= 3) return 'bg-cat-amber/10 border-cat-amber/30';
    return 'bg-primary/5 border-primary/20';
  };

  return (
    <div className="mb-6 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-4 h-4 text-muted-foreground" />
        <h3 className="text-sm font-medium text-muted-foreground">{t('contributionReminders')}</h3>
      </div>
      
      <div className="flex flex-wrap gap-3">
        {notifications.map((notification) => {
          const colors = colorConfig[notification.categoryColor];
          const isOverdue = notification.daysUntil < 0;
          const showConfirmButton = notification.daysUntil <= 3;
          
          return (
            <div
              key={notification.id}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl border transition-all',
                getUrgencyClass(notification.daysUntil)
              )}
            >
              <div className={cn('p-2 rounded-lg', isOverdue ? 'bg-destructive/20' : colors.bg + '/20')}>
                <Calendar className={cn('w-4 h-4', isOverdue ? 'text-destructive' : colors.text)} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm truncate">{notification.assetName}</span>
                  <span className={cn(
                    'text-xs px-2 py-0.5 rounded-full font-medium',
                    isOverdue ? 'bg-destructive/20 text-destructive' :
                    notification.daysUntil === 0 ? 'bg-cat-rose/20 text-cat-rose' : 
                    notification.daysUntil <= 3 ? 'bg-cat-amber/20 text-cat-amber' : 'bg-primary/10 text-primary'
                  )}>
                    {getUrgencyText(notification.daysUntil)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {notification.categoryName} • {formatAmount(notification.amount)} • {t('dayOfMonth', { n: notification.contributionDay })}
                </p>
              </div>
              
              <div className="flex items-center gap-1">
                {showConfirmButton && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleConfirm(notification)}
                    className="h-8 gap-1 text-cat-emerald hover:text-cat-emerald hover:bg-cat-emerald/10"
                  >
                    <Check className="w-4 h-4" />
                    <span className="hidden sm:inline">{t('confirm')}</span>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDismiss(notification.id)}
                  className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
