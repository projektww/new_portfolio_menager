import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export type ThemePreference = 'light' | 'dark' | 'system';
export type CurrencyPreference = 'PLN' | 'EUR';
export type LanguagePreference = 'pl' | 'en';

interface UserSettings {
  theme: ThemePreference;
  currency: CurrencyPreference;
  language: LanguagePreference;
}

const DEFAULT_SETTINGS: UserSettings = {
  theme: 'system',
  currency: 'PLN',
  language: 'pl',
};

export function useUserSettings() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch settings from cloud
  const fetchSettings = useCallback(async () => {
    if (!user) {
      // Load from localStorage for non-authenticated users
      const theme = localStorage.getItem('theme') as ThemePreference || 'system';
      const currency = localStorage.getItem('preferred-currency') as CurrencyPreference || 'PLN';
      const language = localStorage.getItem('preferred-language') as LanguagePreference || 'pl';
      setSettings({ theme, currency, language });
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('user_settings')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching settings:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setSettings({
          theme: data.theme as ThemePreference,
          currency: data.currency as CurrencyPreference,
          language: data.language as LanguagePreference,
        });
      } else {
        // Create default settings for the user
        await supabase
          .from('user_settings')
          .insert({
            user_id: user.id,
            theme: DEFAULT_SETTINGS.theme,
            currency: DEFAULT_SETTINGS.currency,
            language: DEFAULT_SETTINGS.language,
          });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Update settings
  const updateSettings = useCallback(async (newSettings: Partial<UserSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    setSaving(true);

    // Always save to localStorage for immediate effect
    if (newSettings.theme) localStorage.setItem('theme', newSettings.theme);
    if (newSettings.currency) localStorage.setItem('preferred-currency', newSettings.currency);
    if (newSettings.language) localStorage.setItem('preferred-language', newSettings.language);

    if (user) {
      try {
        await supabase
          .from('user_settings')
          .update({
            theme: updated.theme,
            currency: updated.currency,
            language: updated.language,
          })
          .eq('user_id', user.id);
      } catch (error) {
        console.error('Error updating settings:', error);
      }
    }

    setSaving(false);
  }, [user, settings]);

  return {
    settings,
    loading,
    saving,
    updateSettings,
    refetch: fetchSettings,
  };
}
