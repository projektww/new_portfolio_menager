import { User, Settings, HelpCircle, LogOut, FileSpreadsheet, FolderPlus, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from './ThemeToggle';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';

interface UserPanelProps {
  onExport?: () => void;
  onAddCategory?: () => void;
}

export function UserPanel({ onExport, onAddCategory }: UserPanelProps) {
  const { t, lang } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleExport = () => {
    if (onExport) {
      onExport();
      toast.success(t('dataExported'));
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success(lang === 'pl' ? 'Wylogowano pomyślnie' : 'Logged out successfully');
    navigate(lang === 'pl' ? '/pl' : '/');
  };

  const handleSettings = () => {
    navigate(lang === 'pl' ? '/settings/pl' : '/settings');
  };

  const handleLogin = () => {
    navigate(lang === 'pl' ? '/auth/pl' : '/auth');
  };

  return (
    <div className="flex items-center gap-1.5 sm:gap-2">
      <ThemeToggle />
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8 sm:h-9 sm:w-9">
            <User className="w-4 h-4" />
            <span className="sr-only">{t('userPanel')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>{t('myAccount')}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {user ? (
            <>
              <DropdownMenuItem disabled className="text-sm text-muted-foreground">
                {user.email}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* Mobile-only: Add Category */}
              {onAddCategory && (
                <DropdownMenuItem onClick={onAddCategory} className="sm:hidden">
                  <FolderPlus className="mr-2 h-4 w-4" />
                  <span>{t('newCategory')}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleSettings}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('settings')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExport}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                <span>{t('exportToCSV')}</span>
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={() => navigate('/admin')}>
                  <Shield className="mr-2 h-4 w-4" />
                  <span>{t('adminPanel')}</span>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-destructive focus:text-destructive"
                onClick={handleSignOut}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t('logout')}</span>
              </DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem onClick={handleLogin}>
              <User className="mr-2 h-4 w-4" />
              <span>{lang === 'pl' ? 'Zaloguj się' : 'Sign In'}</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
