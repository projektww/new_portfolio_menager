import { Dashboard } from '@/components/portfolio/Dashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { useSEO, seoConfigs } from '@/hooks/useSEO';

const Index = () => {
  useSEO(seoConfigs.appPL);
  
  return (
    <LanguageProvider lang="pl">
      <CurrencyProvider>
        <Dashboard />
      </CurrencyProvider>
    </LanguageProvider>
  );
};

export default Index;
