import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Plus, Pencil, Trash2, TrendingUp, TrendingDown, Filter, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useCurrency } from '@/contexts/CurrencyContext';
import { supabase } from '@/integrations/supabase/client';
import { HistoryEntry } from '@/types/portfolio';
import { getDateLocale } from '@/lib/i18n';
import { cn } from '@/lib/utils';
import { useSEO } from '@/hooks/useSEO';

type FilterType = 'all' | 'add' | 'update' | 'delete';

export default function History() {
  const { lang, t } = useLanguage();
  const { formatAmount } = useCurrency();
  const { user } = useAuth();
  const navigate = useNavigate();
  const dateLocale = getDateLocale(lang);
  
  useSEO({
    title: lang === 'pl' ? 'Historia zmian | pllwallet.com' : 'Change History | pllwallet.com',
    description: lang === 'pl' ? 'Pełna historia zmian portfela' : 'Full portfolio change history',
    lang,
  });

  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [limit, setLimit] = useState(50);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate(lang === 'pl' ? '/auth/pl' : '/auth');
      return;
    }
    fetchHistory();
  }, [user, limit]);

  const fetchHistory = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('portfolio_history')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: false })
      .limit(limit + 1);

    if (!error && data) {
      setHasMore(data.length > limit);
      const entries: HistoryEntry[] = data.slice(0, limit).map(d => ({
        id: d.id,
        type: d.type as HistoryEntry['type'],
        assetName: d.asset_name,
        categoryName: d.category_name,
        amount: Number(d.amount),
        timestamp: new Date(d.timestamp),
      }));
      setHistory(entries);
    }
    setLoading(false);
  };

  const filtered = useMemo(() => {
    if (filter === 'all') return history;
    return history.filter(h => h.type === filter);
  }, [history, filter]);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(dateLocale, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const appPath = lang === 'pl' ? '/app/pl' : '/app';
  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: t('filterAll') },
    { key: 'add', label: t('filterAdded') },
    { key: 'update', label: t('filterUpdated') },
    { key: 'delete', label: t('filterDeleted') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate(appPath)}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" />
            <h1 className="text-xl font-bold">{t('allChanges')}</h1>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-6 flex-wrap">
          {filters.map(f => (
            <Button
              key={f.key}
              variant={filter === f.key ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f.key)}
            >
              {f.label}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((entry, i) => {
            const Icon = getIcon(entry.type);
            return (
              <div
                key={entry.id}
                className="glass glass-border rounded-xl p-4 flex items-center gap-4 animate-fade-in"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                <div className={cn('p-2.5 rounded-lg shrink-0', getIconColor(entry.type))}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium truncate">{entry.assetName}</p>
                  <p className="text-sm text-muted-foreground">{entry.categoryName}</p>
                </div>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={cn('font-semibold text-sm flex items-center gap-1', {
                    'text-cat-lime': entry.type === 'add',
                    'text-destructive': entry.type === 'delete',
                    'text-muted-foreground': entry.type === 'update',
                  })}>
                    {entry.type === 'add' && <TrendingUp className="w-3.5 h-3.5" />}
                    {entry.type === 'delete' && <TrendingDown className="w-3.5 h-3.5" />}
                    {entry.type === 'add' ? '+' : entry.type === 'delete' ? '-' : ''}{formatAmount(entry.amount)}
                  </span>
                  <span className="text-xs text-muted-foreground">{formatDate(entry.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>

        {filtered.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-12">{t('noHistory')}</p>
        )}

        {hasMore && (
          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => setLimit(l => l + 50)}>
              {t('loadMore')}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
