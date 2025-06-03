import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface ThemeColors {
  primary: string;    // For header, active sections, tabs, primary buttons
  secondary: string;  // For secondary buttons
  tableHeader: string; // For table headers
}

interface ThemeState {
  colors: ThemeColors;
  setTheme: (colors: ThemeColors) => Promise<void>;
  syncThemeFromDb: () => Promise<void>;
  applyThemeToDOM: (colors: ThemeColors) => void;
}

// Default theme based on the first preset
const defaultTheme: ThemeColors = {
  primary: '#000000',    // Black
  secondary: '#a6a8ac',  // Gray
  tableHeader: '#f6f6f6' // Light gray
};

// Function to apply theme colors to CSS variables
const applyThemeToDOM = (colors: ThemeColors) => {
  document.documentElement.style.setProperty('--theme-primary', colors.primary);
  document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
  document.documentElement.style.setProperty('--theme-table-header', colors.tableHeader);
};

// Create a broadcast channel for cross-tab communication
const themeChannel = typeof window !== 'undefined' ? new BroadcastChannel('theme-sync') : null;

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colors: defaultTheme,
      applyThemeToDOM,
      setTheme: async (colors: ThemeColors) => {
        // Update local state
        set({ colors });
        
        // Apply theme to DOM
        applyThemeToDOM(colors);

        // Update database if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { error } = await supabase
            .from('user_themes')
            .upsert({
              auth_id: session.user.id,
              theme_colors: colors,
              updated_at: new Date().toISOString()
            });

          if (error) {
            console.error('Failed to update theme in database:', error);
          }
        }

        // Broadcast theme change to other tabs
        themeChannel?.postMessage(colors);
      },
      syncThemeFromDb: async () => {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const { data, error } = await supabase
            .from('user_themes')
            .select('theme_colors')
            .eq('auth_id', session.user.id)
            .single();

          if (error) {
            console.error('Failed to fetch theme from database:', error);
            return;
          }

          if (data?.theme_colors) {
            const colors = data.theme_colors as ThemeColors;
            set({ colors });
            applyThemeToDOM(colors);
          }
        }
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        // Apply theme immediately when store is rehydrated from localStorage
        if (state) {
          applyThemeToDOM(state.colors);
        }
      },
    }
  )
);

// Listen for theme changes from other tabs
if (themeChannel) {
  themeChannel.onmessage = (event) => {
    const newColors = event.data;
    useThemeStore.setState({ colors: newColors });
    applyThemeToDOM(newColors);
  };
} 