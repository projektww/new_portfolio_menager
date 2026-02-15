import { useEffect } from 'react';

interface SEOConfig {
  title: string;
  description: string;
  lang?: string;
}

export function useSEO({ title, description, lang = 'en' }: SEOConfig) {
  useEffect(() => {
    // Update document title
    document.title = title;
    
    // Update or create meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      metaDescription.setAttribute('content', description);
      document.head.appendChild(metaDescription);
    }
    
    // Update html lang attribute
    document.documentElement.lang = lang;
    
    // Update og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) {
      ogTitle.setAttribute('content', title);
    }
    
    // Update og:description
    let ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) {
      ogDescription.setAttribute('content', description);
    }
  }, [title, description, lang]);
}

// SEO configurations for different pages
export const seoConfigs = {
  authPL: {
    title: 'Logowanie | pllwallet.com',
    description: 'Zaloguj się lub utwórz konto, aby zarządzać swoim portfelem inwestycyjnym.',
    lang: 'pl' as const,
  },
  authEN: {
    title: 'Sign In | pllwallet.com',
    description: 'Sign in or create an account to manage your investment portfolio.',
    lang: 'en' as const,
  },
  landingEN: {
    title: 'pllwallet.com - Investment Portfolio Manager',
    description: 'Free investment portfolio tracker - manage stocks, bonds, deposits, savings, cash, and funds. No registration required.',
    lang: 'en' as const,
  },
  landingPL: {
    title: 'pllwallet.com - Zarządzanie Portfelem Inwestycyjnym',
    description: 'Darmowa aplikacja do śledzenia portfela inwestycyjnego - zarządzaj akcjami, obligacjami, lokatami, oszczędnościami i funduszami. Bez rejestracji.',
    lang: 'pl' as const,
  },
  appEN: {
    title: 'Dashboard - pllwallet.com',
    description: 'Track your investment portfolio value, analyze returns and plan contributions with pllwallet.',
    lang: 'en' as const,
  },
  appPL: {
    title: 'Panel - pllwallet.com',
    description: 'Śledź wartość swojego portfela inwestycyjnego, analizuj zyski i planuj dopłaty z pllwallet.',
    lang: 'pl' as const,
  },
  settingsPL: {
    title: 'Ustawienia | pllwallet.com',
    description: 'Dostosuj ustawienia swojego konta - motyw, walutę i język.',
    lang: 'pl' as const,
  },
  settingsEN: {
    title: 'Settings | pllwallet.com',
    description: 'Customize your account settings - theme, currency and language.',
    lang: 'en' as const,
  },
  adminPL: {
    title: 'Panel Admina | pllwallet.com',
    description: 'Panel administracyjny do zarządzania użytkownikami i statystykami.',
    lang: 'pl' as const,
  },
};
