import { Dashboard } from '@/components/portfolio/Dashboard';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { CurrencyProvider } from '@/contexts/CurrencyContext';
import { useSEO, seoConfigs } from '@/hooks/useSEO';

const IndexEN = () => {
  useSEO(seoConfigs.appEN);
  
  return (
    <LanguageProvider lang="en">
      <CurrencyProvider>
        <Dashboard />
      </CurrencyProvider>
    </LanguageProvider>
  );
};

export default IndexEN;
