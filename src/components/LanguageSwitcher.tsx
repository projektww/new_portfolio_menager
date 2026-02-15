import { Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { Language } from '@/lib/i18n';

interface LanguageSwitcherProps {
  currentLang: Language;
  isApp?: boolean;
}

export function LanguageSwitcher({ currentLang, isApp = false }: LanguageSwitcherProps) {
  const getPathForLang = (lang: Language) => {
    if (isApp) {
      return lang === 'pl' ? '/app/pl' : '/app';
    }
    return lang === 'pl' ? '/pl' : '/';
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="h-9 w-9">
          <Globe className="w-4 h-4" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild className={currentLang === 'pl' ? 'bg-secondary' : ''}>
          <Link to={getPathForLang('pl')} className="w-full cursor-pointer">
            🇵🇱 Polski
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className={currentLang === 'en' ? 'bg-secondary' : ''}>
          <Link to={getPathForLang('en')} className="w-full cursor-pointer">
            🇬🇧 English
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
