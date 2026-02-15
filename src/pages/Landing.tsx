import { Link } from 'react-router-dom';
// Polish version - accessible at /pl
import { 
  Wallet, TrendingUp, PieChart, Bell, Shield, BarChart3, 
  ChevronRight, Check, Star, ArrowRight, LineChart, Percent,
  CalendarCheck, Target, Zap, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useSEO, seoConfigs } from '@/hooks/useSEO';

const features = [
  {
    icon: Wallet,
    title: 'Wszystkie inwestycje w jednym miejscu',
    description: 'Śledź swoje lokaty, obligacje, akcje, fundusze i inne aktywa w przejrzystym panelu.'
  },
  {
    icon: TrendingUp,
    title: 'Prognoza zysków',
    description: 'Automatyczne obliczanie przewidywanych zysków na podstawie oprocentowania każdej pozycji.'
  },
  {
    icon: PieChart,
    title: 'Wizualizacja portfela',
    description: 'Interaktywne wykresy pokazujące strukturę Twojego portfela i rozkład aktywów.'
  },
  {
    icon: Bell,
    title: 'Powiadomienia o dopłatach',
    description: 'Automatyczne przypomnienia o zbliżających się terminach regularnych wpłat.'
  },
  {
    icon: LineChart,
    title: 'Symulacja przyszłości',
    description: 'Sprawdź jak będzie wyglądał Twój portfel za 1, 5 lub 10 lat z uwzględnieniem dopłat.'
  },
  {
    icon: Shield,
    title: 'Bezpieczeństwo danych',
    description: 'Twoje dane pozostają na Twoim urządzeniu. Pełna kontrola nad prywatnością.'
  },
];

const benefits = [
  'Darmowe konto bez ograniczeń',
  'Brak ukrytych opłat',
  'Nieograniczona liczba kategorii',
  'Eksport do CSV i arkuszy kalkulacyjnych',
  'Automatyczne obliczanie zysków',
  'Tryb ciemny i jasny',
];

const categories = [
  { name: 'Giełda', icon: TrendingUp, color: 'bg-cat-emerald' },
  { name: 'Obligacje', icon: BarChart3, color: 'bg-cat-violet' },
  { name: 'Lokaty', icon: Percent, color: 'bg-cat-amber' },
  { name: 'Fundusze', icon: PieChart, color: 'bg-cat-sky' },
  { name: 'Kryptowaluty', icon: Zap, color: 'bg-cat-orange' },
  { name: 'Oszczędności', icon: Wallet, color: 'bg-cat-lime' },
];

export default function Landing() {
  useSEO(seoConfigs.landingPL);
  const appPath = '/app/pl';
  
  return (
    <div className="min-h-screen bg-background">
      {/* Animated background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cat-violet/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-cat-amber/5 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      {/* Header */}
      <header className="relative border-b border-border/50 backdrop-blur-xl bg-background/80 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Wallet className="w-6 h-6 text-primary" />
              </div>
              <span className="text-xl font-bold">pllwallet.com</span>
            </div>
            <div className="flex items-center gap-4">
              <LanguageSwitcher currentLang="pl" />
              <ThemeToggle />
              <Link to="/auth/pl">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  Zaloguj się
                </Button>
              </Link>
              <Link to={appPath}>
                <Button className="gap-2">
                  Otwórz aplikację
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-8 animate-fade-in">
              <Star className="w-4 h-4" />
              100% darmowe • Bez rejestracji • Prywatność gwarantowana
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
              Śledź wartość swojego
              <span className="block text-gradient">portfela inwestycyjnego</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Proste narzędzie do zarządzania wszystkimi Twoimi inwestycjami. 
              Obliczaj zyski, planuj dopłaty i monitoruj wzrost swojego majątku.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/app/pl">
                <Button size="lg" className="gap-2 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  Zacznij za darmo
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 rounded-xl">
                  Dowiedz się więcej
                </Button>
              </a>
            </div>
          </div>

          {/* Hero Image / Demo Preview */}
          <div className="mt-16 lg:mt-24 relative animate-slide-up" style={{ animationDelay: '300ms' }}>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
            <div className="glass glass-border rounded-3xl p-8 lg:p-12 shadow-2xl">
              {/* Mock Dashboard Preview */}
              <div className="grid md:grid-cols-3 gap-6">
                {/* Total Value Card */}
                <div className="md:col-span-2 glass glass-border rounded-2xl p-6 bg-gradient-to-br from-primary/10 via-transparent to-transparent">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 rounded-xl bg-primary/20">
                      <Wallet className="w-6 h-6 text-primary" />
                    </div>
                    <span className="text-muted-foreground font-medium">Wartość portfela</span>
                  </div>
                  <p className="text-4xl lg:text-5xl font-bold mb-2">127 450,00 zł</p>
                  <div className="flex items-center gap-2 text-cat-emerald">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">+12 450 zł w tym roku</span>
                  </div>
                </div>
                
                {/* Monthly Profit */}
                <div className="glass glass-border rounded-2xl p-6 bg-gradient-to-br from-cat-emerald/20 to-cat-emerald/5 border-2 border-cat-emerald/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent className="w-5 h-5 text-cat-emerald" />
                    <span className="text-muted-foreground text-sm">Zysk miesięczny</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-cat-emerald">+856,25 zł</p>
                </div>
              </div>

              {/* Categories Preview */}
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {categories.map((cat, index) => (
                  <div 
                    key={cat.name}
                    className="glass glass-border rounded-xl p-4 flex flex-col items-center gap-2 hover:scale-105 transition-transform cursor-pointer"
                    style={{ animationDelay: `${400 + index * 50}ms` }}
                  >
                    <div className={`p-2 rounded-lg ${cat.color}/20`}>
                      <cat.icon className={`w-5 h-5 text-${cat.color.replace('bg-', '')}`} />
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 lg:py-32 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Wszystko czego potrzebujesz
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Kompletny zestaw narzędzi do zarządzania Twoim portfelem inwestycyjnym
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass glass-border rounded-2xl p-6 hover:scale-[1.02] transition-all duration-300 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="p-3 rounded-xl bg-primary/10 w-fit mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Dlaczego warto korzystać z Mój Portfel?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Stworzyliśmy narzędzie, które jest proste w obsłudze, ale jednocześnie 
                wyposażone we wszystkie funkcje potrzebne do efektywnego zarządzania inwestycjami.
              </p>
              
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div 
                    key={benefit}
                    className="flex items-center gap-3 animate-slide-up"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="p-1 rounded-full bg-cat-emerald/20">
                      <Check className="w-4 h-4 text-cat-emerald" />
                    </div>
                    <span className="font-medium">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/app/pl" className="inline-block mt-8">
                <Button size="lg" className="gap-2">
                  Wypróbuj teraz
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <div className="relative">
              <div className="glass glass-border rounded-2xl p-6 shadow-xl">
                <div className="space-y-4">
                  {/* Stats Preview */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-cat-violet" />
                        <span className="text-sm text-muted-foreground">Prognoza (1 rok)</span>
                      </div>
                      <p className="text-xl font-bold">139 900 zł</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarCheck className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Dopłaty mies.</span>
                      </div>
                      <p className="text-xl font-bold">2 500 zł</p>
                    </div>
                  </div>
                  
                  {/* Chart Preview */}
                  <div className="h-40 bg-secondary/30 rounded-xl flex items-end justify-around px-4 pb-4">
                    {[40, 55, 45, 60, 75, 65, 80, 90, 85, 95, 100, 110].map((height, i) => (
                      <div 
                        key={i}
                        className="w-4 bg-gradient-to-t from-primary to-primary/50 rounded-t"
                        style={{ height: `${height}%` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-cat-violet/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-5xl font-bold mb-6">
            Zacznij śledzić swoje inwestycje już dziś
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Dołącz do tysięcy osób, które już korzystają z Mój Portfel 
            do zarządzania swoim majątkiem.
          </p>
          
          <Link to="/app/pl">
            <Button size="lg" className="gap-2 text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              Otwórz aplikację
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            Bez rejestracji • Bez karty kredytowej • 100% za darmo
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-primary/20">
                <Wallet className="w-5 h-5 text-primary" />
              </div>
              <span className="font-semibold">pllwallet.com</span>
            </div>
            
            <p className="text-sm text-muted-foreground text-center">
              Made by{' '}
              <a 
                href="https://projektenter.pl" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary hover:underline font-medium"
              >
                projektENTER
              </a>
              {' '}— strony internetowe Poznań
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Funkcje
              </a>
              <Link to="/app/pl" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Aplikacja
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
