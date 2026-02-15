import { createContext, useContext, ReactNode } from 'react';
import { Language, getTranslations, t, TranslationKey } from '@/lib/i18n';

interface LanguageContextType {
  lang: Language;
  translations: ReturnType<typeof getTranslations>;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

interface LanguageProviderProps {
  lang: Language;
  children: ReactNode;
}

export function LanguageProvider({ lang, children }: LanguageProviderProps) {
  const translations = getTranslations(lang);
  
  const translate = (key: TranslationKey, params?: Record<string, string | number>) => {
    return t(lang, key, params);
  };

  return (
    <LanguageContext.Provider value={{ lang, translations, t: translate }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
