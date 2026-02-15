import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, User, Palette, Globe, DollarSign, ArrowLeft, LogOut, Shield, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { useUserSettings } from '@/hooks/useUserSettings';
import { toast } from 'sonner';
import { useSEO, seoConfigs } from '@/hooks/useSEO';

const Settings = () => {
  useSEO(seoConfigs.settingsPL);
  const { user, signOut, isAdmin, loading: authLoading } = useAuth();
  const { settings, loading, saving, updateSettings } = useUserSettings();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth/pl');
    }
  }, [user, authLoading, navigate]);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Wylogowano pomyślnie');
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/pl')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex items-center gap-2">
                <SettingsIcon className="w-6 h-6 text-primary" />
                <h1 className="text-xl font-bold">Ustawienia</h1>
              </div>
            </div>
            {isAdmin && (
              <Button variant="outline" onClick={() => navigate('/admin')}>
                <Shield className="w-4 h-4 mr-2" />
                Panel Admina
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-6">
          {/* Profile Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profil
              </CardTitle>
              <CardDescription>Informacje o Twoim koncie</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{user.user_metadata?.full_name || 'Użytkownik'}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Theme Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5" />
                Motyw
              </CardTitle>
              <CardDescription>Wybierz preferowany motyw aplikacji</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.theme}
                onValueChange={(value) => updateSettings({ theme: value as 'light' | 'dark' | 'system' })}
                disabled={saving}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="light" />
                  <Label htmlFor="light">Jasny</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="dark" />
                  <Label htmlFor="dark">Ciemny</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="system" />
                  <Label htmlFor="system">Systemowy</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Currency Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Waluta
              </CardTitle>
              <CardDescription>Wybierz domyślną walutę wyświetlania</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.currency}
                onValueChange={(value) => updateSettings({ currency: value as 'PLN' | 'EUR' })}
                disabled={saving}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="PLN" id="pln" />
                  <Label htmlFor="pln">PLN (Polski złoty)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="EUR" id="eur" />
                  <Label htmlFor="eur">EUR (Euro)</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Language Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Język
              </CardTitle>
              <CardDescription>Wybierz język interfejsu</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={settings.language}
                onValueChange={(value) => {
                  updateSettings({ language: value as 'pl' | 'en' });
                  // Redirect to the appropriate language version
                  if (value === 'en') {
                    navigate('/en');
                  } else {
                    navigate('/pl');
                  }
                }}
                disabled={saving}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pl" id="polish" />
                  <Label htmlFor="polish">🇵🇱 Polski</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="en" id="english" />
                  <Label htmlFor="english">🇬🇧 English</Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          <Separator />

          {/* Logout Section */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <LogOut className="w-5 h-5" />
                Wyloguj
              </CardTitle>
              <CardDescription>Zakończ bieżącą sesję</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="destructive" onClick={handleSignOut}>
                <LogOut className="w-4 h-4 mr-2" />
                Wyloguj się
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Settings;
