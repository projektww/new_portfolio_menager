import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuthContext } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Users, Briefcase, DollarSign, TrendingUp, Loader2, Shield, RefreshCw, ArrowUpDown } from 'lucide-react';
import { useSEO } from '@/hooks/useSEO';

interface UserData {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  categories_count: number;
  assets_count: number;
  total_value: number;
  currency: string;
  role: string;
  account_status: string;
}

type SortField = 'name' | 'date' | 'value' | 'role';

export default function Admin() {
  useSEO({
    title: 'Panel Administratora | pllwallet.com',
    description: 'Panel zarządzania użytkownikami i statystykami',
    lang: 'pl',
  });
  
  const navigate = useNavigate();
  const { user, loading, isAdmin } = useAuthContext();
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [sortField, setSortField] = useState<SortField>('date');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [rateLoading, setRateLoading] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate('/auth/pl');
    else if (!loading && user && !isAdmin) {
      toast.error('Brak uprawnień administratora');
      navigate('/app/pl');
    }
  }, [user, loading, isAdmin, navigate]);

  const fetchExchangeRate = async () => {
    setRateLoading(true);
    try {
      const res = await fetch('https://api.nbp.pl/api/exchangerates/rates/a/eur/?format=json');
      const data = await res.json();
      setExchangeRate(data.rates[0].mid);
    } catch {
      toast.error('Nie udało się pobrać kursu walut');
    } finally {
      setRateLoading(false);
    }
  };

  useEffect(() => { fetchExchangeRate(); }, []);

  const fetchAdminData = async () => {
    if (!isAdmin) return;
    setIsRefreshing(true);
    try {
      const [profilesRes, portfoliosRes, rolesRes] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: false }),
        supabase.from('user_portfolios').select('*'),
        supabase.from('user_roles').select('*'),
      ]);

      if (profilesRes.error) throw profilesRes.error;
      if (portfoliosRes.error) throw portfoliosRes.error;
      if (rolesRes.error) throw rolesRes.error;

      const combinedUsers: UserData[] = (profilesRes.data || []).map(profile => {
        const portfolio = portfoliosRes.data?.find(p => p.user_id === profile.user_id);
        const role = rolesRes.data?.find(r => r.user_id === profile.user_id);
        return {
          id: profile.user_id,
          email: profile.email || '',
          full_name: profile.full_name || '',
          created_at: profile.created_at,
          categories_count: portfolio?.categories_count || 0,
          assets_count: portfolio?.assets_count || 0,
          total_value: Number(portfolio?.total_value) || 0,
          currency: portfolio?.currency || 'PLN',
          role: role?.role || 'user',
          account_status: (profile as any).account_status || 'free',
        };
      });

      setUsers(combinedUsers);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Błąd podczas pobierania danych');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => { if (isAdmin) fetchAdminData(); }, [isAdmin]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole as any })
      .eq('user_id', userId);
    
    if (error) {
      toast.error('Nie udało się zmienić roli');
    } else {
      toast.success('Rola zmieniona');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    }
  };

  const handleStatusChange = async (userId: string, newStatus: string) => {
    const { error } = await supabase
      .from('profiles')
      .update({ account_status: newStatus })
      .eq('user_id', userId);
    
    if (error) {
      toast.error('Nie udało się zmienić statusu');
    } else {
      toast.success('Status zmieniony');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, account_status: newStatus } : u));
    }
  };

  const handleCurrencyChange = async (userId: string, newCurrency: string) => {
    const { error } = await supabase
      .from('user_portfolios')
      .update({ currency: newCurrency })
      .eq('user_id', userId);
    
    if (error) {
      toast.error('Nie udało się zmienić waluty');
    } else {
      toast.success('Waluta zmieniona');
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, currency: newCurrency } : u));
    }
  };

  const sortedUsers = useMemo(() => {
    return [...users].sort((a, b) => {
      switch (sortField) {
        case 'name': return (a.full_name || a.email).localeCompare(b.full_name || b.email);
        case 'date': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'value': return b.total_value - a.total_value;
        case 'role': return a.role.localeCompare(b.role);
        default: return 0;
      }
    });
  }, [users, sortField]);

  const stats = useMemo(() => ({
    totalUsers: users.length,
    totalCategories: users.reduce((s, u) => s + u.categories_count, 0),
    totalAssets: users.reduce((s, u) => s + u.assets_count, 0),
    totalPortfolioValue: users.reduce((s, u) => s + u.total_value, 0),
  }), [users]);

  const formatCurrency = (value: number, currency: string = 'PLN') => {
    return new Intl.NumberFormat('pl-PL', { style: 'currency', currency }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pl-PL', { year: 'numeric', month: 'short', day: 'numeric' });
  };

  const roleBadge = (role: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      admin: 'default', moderator: 'outline', user: 'secondary',
    };
    const labels: Record<string, string> = {
      admin: 'Administrator', moderator: 'Moderator', user: 'Użytkownik',
    };
    return <Badge variant={variants[role] || 'secondary'}>{labels[role] || role}</Badge>;
  };

  const statusBadge = (status: string) => {
    return (
      <Badge variant={status === 'premium' ? 'default' : 'secondary'}
        className={status === 'premium' ? 'bg-cat-amber text-white' : ''}>
        {status === 'premium' ? 'Premium' : 'Bezpłatne'}
      </Badge>
    );
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => navigate('/app/pl')}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Powrót
            </Button>
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              <h1 className="text-2xl font-bold">Panel Administratora</h1>
            </div>
          </div>
          <Button variant="outline" onClick={fetchAdminData} disabled={isRefreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Odśwież
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="glass glass-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Użytkownicy</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalUsers}</div></CardContent>
          </Card>
          <Card className="glass glass-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Kategorie</CardTitle>
              <Briefcase className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalCategories}</div></CardContent>
          </Card>
          <Card className="glass glass-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Aktywa</CardTitle>
              <TrendingUp className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{stats.totalAssets}</div></CardContent>
          </Card>
          <Card className="glass glass-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Wartość portfeli</CardTitle>
              <DollarSign className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent><div className="text-2xl font-bold">{formatCurrency(stats.totalPortfolioValue)}</div></CardContent>
          </Card>
        </div>

        {/* Exchange Rate Card */}
        <Card className="glass glass-border mb-8">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Kurs EUR/PLN (NBP)</CardTitle>
              <CardDescription>Aktualny średni kurs wymiany</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={fetchExchangeRate} disabled={rateLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${rateLoading ? 'animate-spin' : ''}`} />
              Odśwież kurs
            </Button>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">
              {exchangeRate ? `1 EUR = ${exchangeRate.toFixed(4)} PLN` : 'Ładowanie...'}
            </div>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card className="glass glass-border">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <CardTitle>Lista użytkowników</CardTitle>
                <CardDescription>Zarządzaj rolami, statusami i walutami użytkowników</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
                <Select value={sortField} onValueChange={(v) => setSortField(v as SortField)}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Nazwa</SelectItem>
                    <SelectItem value="date">Data rejestracji</SelectItem>
                    <SelectItem value="value">Wartość portfela</SelectItem>
                    <SelectItem value="role">Rola</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {sortedUsers.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">Brak użytkowników</div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Użytkownik</TableHead>
                      <TableHead>Rola</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Waluta</TableHead>
                      <TableHead className="text-center">Kat.</TableHead>
                      <TableHead className="text-center">Aktywa</TableHead>
                      <TableHead className="text-right">Wartość</TableHead>
                      <TableHead>Data</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedUsers.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{u.full_name || 'Brak nazwy'}</div>
                            <div className="text-sm text-muted-foreground">{u.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v)}>
                            <SelectTrigger className="w-[140px] h-8">
                              <SelectValue>{roleBadge(u.role)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">Administrator</SelectItem>
                              <SelectItem value="moderator">Moderator</SelectItem>
                              <SelectItem value="user">Użytkownik</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select value={u.account_status} onValueChange={(v) => handleStatusChange(u.id, v)}>
                            <SelectTrigger className="w-[120px] h-8">
                              <SelectValue>{statusBadge(u.account_status)}</SelectValue>
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Bezpłatne</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Select value={u.currency} onValueChange={(v) => handleCurrencyChange(u.id, v)}>
                            <SelectTrigger className="w-[90px] h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PLN">PLN</SelectItem>
                              <SelectItem value="EUR">EUR</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className="text-center">{u.categories_count}</TableCell>
                        <TableCell className="text-center">{u.assets_count}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(u.total_value, u.currency)}
                        </TableCell>
                        <TableCell>{formatDate(u.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
