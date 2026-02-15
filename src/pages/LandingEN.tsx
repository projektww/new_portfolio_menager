import { Link } from 'react-router-dom';
// English version - default at /
import { 
  Wallet, TrendingUp, PieChart, Bell, Shield, BarChart3, 
  ChevronRight, Check, Star, ArrowRight, LineChart, Percent,
  CalendarCheck, Target, Zap, LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { getTranslations, formatCurrencyByLang } from '@/lib/i18n';
import { useSEO, seoConfigs } from '@/hooks/useSEO';

const t = getTranslations('en');

const features = [
  { icon: Wallet, title: t.feature1Title, description: t.feature1Desc },
  { icon: TrendingUp, title: t.feature2Title, description: t.feature2Desc },
  { icon: PieChart, title: t.feature3Title, description: t.feature3Desc },
  { icon: Bell, title: t.feature4Title, description: t.feature4Desc },
  { icon: LineChart, title: t.feature5Title, description: t.feature5Desc },
  { icon: Shield, title: t.feature6Title, description: t.feature6Desc },
];

const benefits = [
  t.benefit1, t.benefit2, t.benefit3, t.benefit4, t.benefit5, t.benefit6
];

const categories = [
  { name: t.catStocks, icon: TrendingUp, color: 'bg-cat-emerald' },
  { name: t.catBonds, icon: BarChart3, color: 'bg-cat-violet' },
  { name: t.catDeposits, icon: Percent, color: 'bg-cat-amber' },
  { name: t.catFunds, icon: PieChart, color: 'bg-cat-sky' },
  { name: t.catCrypto, icon: Zap, color: 'bg-cat-orange' },
  { name: t.catSavings, icon: Wallet, color: 'bg-cat-lime' },
];

export default function LandingEN() {
  useSEO(seoConfigs.landingEN);
  const appPath = '/app';
  
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
              <LanguageSwitcher currentLang="en" />
              <ThemeToggle />
              <Link to="/auth">
                <Button variant="ghost" className="gap-2">
                  <LogIn className="w-4 h-4" />
                  {t.login}
                </Button>
              </Link>
              <Link to={appPath}>
                <Button className="gap-2">
                  {t.openApp}
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
              {t.badge}
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 animate-slide-up">
              {t.heroTitle1}
              <span className="block text-gradient">{t.heroTitle2}</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              {t.heroDescription}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to={appPath}>
                <Button size="lg" className="gap-2 text-lg px-8 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
                  {t.startFree}
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline" className="gap-2 text-lg px-8 py-6 rounded-xl">
                  {t.learnMore}
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
                    <span className="text-muted-foreground font-medium">{t.portfolioValue}</span>
                  </div>
                  <p className="text-4xl lg:text-5xl font-bold mb-2">$31,862.50</p>
                  <div className="flex items-center gap-2 text-cat-emerald">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-medium">+$3,112.50 {t.thisYear}</span>
                  </div>
                </div>
                
                {/* Monthly Profit */}
                <div className="glass glass-border rounded-2xl p-6 bg-gradient-to-br from-cat-emerald/20 to-cat-emerald/5 border-2 border-cat-emerald/30">
                  <div className="flex items-center gap-2 mb-3">
                    <Percent className="w-5 h-5 text-cat-emerald" />
                    <span className="text-muted-foreground text-sm">{t.monthlyProfit}</span>
                  </div>
                  <p className="text-2xl lg:text-3xl font-bold text-cat-emerald">+$214.06</p>
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
              {t.featuresTitle}
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t.featuresSubtitle}
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
                {t.benefitsTitle}
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                {t.benefitsSubtitle}
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

              <Link to="/app" className="inline-block mt-8">
                <Button size="lg" className="gap-2">
                  {t.tryNow}
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
                        <span className="text-sm text-muted-foreground">{t.forecast1Year}</span>
                      </div>
                      <p className="text-xl font-bold">$34,975</p>
                    </div>
                    <div className="bg-secondary/50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CalendarCheck className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">{t.monthlyContributions}</span>
                      </div>
                      <p className="text-xl font-bold">$625</p>
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
            {t.ctaTitle}
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            {t.ctaSubtitle}
          </p>
          
          <Link to="/app">
            <Button size="lg" className="gap-2 text-lg px-10 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all">
              {t.openApp}
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>

          <p className="mt-6 text-sm text-muted-foreground">
            {t.noRegistration}
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
              {' '}— web development Poznań
            </p>
            
            <div className="flex items-center gap-4">
              <a href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.features}
              </a>
              <Link to="/app" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {t.app}
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
