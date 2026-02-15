import { Clock, Plus, Pencil, Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { HistoryEntry } from '@/types/portfolio';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { getDateLocale } from '@/lib/i18n';
import { useAuth } from '@/contexts/AuthContext';

interface HistoryPanelProps {
  history: HistoryEntry[];
}

export function HistoryPanel({ history }: HistoryPanelProps) {
  const { lang, t } = useLanguage();
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const dateLocale = getDateLocale(lang);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return t('justNow');
    if (minutes < 60) return t('minutesAgo', { n: minutes });
    if (hours < 24) return t('hoursAgo', { n: hours });
    if (days < 7) return t('daysAgo', { n: days });
    return date.toLocaleDateString(dateLocale);
  };

  const getIcon = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'add': return Plus;
      case 'update': return Pencil;
      case 'delete': return Trash2;
    }
  };

  const getIconColor = (type: HistoryEntry['type']) => {
    switch (type) {
      case 'add': return 'text-cat-lime bg-cat-lime/20';
      case 'update': return 'text-cat-amber bg-cat-amber/20';
      case 'delete': return 'text-destructive bg-destructive/20';
    }
  };

  const getChangeDisplay = (type: HistoryEntry['type'], amount: number) => {
    if (type === 'add') {
      return (
        <span className="flex items-center gap-1 text-cat-lime font-semibold text-sm">
          <TrendingUp className="w-3.5 h-3.5" />
          +{formatAmount(amount)}
        </span>
      );
    }
    if (type === 'delete') {
      return (
        <span className="flex items-center gap-1 text-destructive font-semibold text-sm">
          <TrendingDown className="w-3.5 h-3.5" />
          -{formatAmount(amount)}
        </span>
      );
    }
    return (
      <span className="text-muted-foreground text-sm">
        {formatAmount(amount)}
      </span>
    );
  };

  if (history.length === 0) {
    return (
      <div className="glass glass-border rounded-2xl p-6 animate-fade-in">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{t('recentChanges')}</h3>
        </div>
        <p className="text-muted-foreground text-sm text-center py-8">
          {t('noHistory')}
        </p>
      </div>
    );
  }

  return (
    <div className="glass glass-border rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Clock className="w-5 h-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">{t('recentChanges')}</h3>
        </div>
        {user && (
          <Link to="/history" className="text-sm text-primary hover:underline">
            {t('showAll')}
          </Link>
        )}
      </div>
      
      <div className="space-y-3 max-h-72 overflow-y-auto">
        {history.slice(0, 10).map((entry, index) => {
          const Icon = getIcon(entry.type);
          return (
            <div 
              key={entry.id} 
              className="flex items-start gap-3 py-2 animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className={cn('p-2 rounded-lg shrink-0', getIconColor(entry.type))}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium truncate">{entry.assetName}</p>
                <p className="text-xs text-muted-foreground">
                  {entry.categoryName}
                </p>
              </div>
              <div className="flex flex-col items-end gap-0.5 shrink-0">
                {getChangeDisplay(entry.type, entry.amount)}
                <span className="text-xs text-muted-foreground">
                  {formatTime(entry.timestamp)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
