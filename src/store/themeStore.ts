import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '@/integrations/supabase/client';

export interface ThemeColors {
  primary: string;    // For header, active sections, tabs, primary buttons
  secondary: string;  // For secondary buttons
  tableHeader: string; // For table headers
  globalBg: string;   // Global background color
  globalBg2: string;  // Secondary global background color
  sidebar: {
    background: string;
    itemText: string;
    itemTextHover: string;
    activeItemText: string;
    activeItemBg: string;
    divider: string;
  };
  mainContent: {
    background: string;
    backgroundDarker: string;
    componentBg: string;
  };
  isDarkMode: boolean;
}

interface ThemeState {
  colors: ThemeColors;
  baseTheme: {
    primary: string;
    secondary: string;
  };
  setTheme: (colors: Partial<ThemeColors>) => Promise<void>;
  syncThemeFromDb: () => Promise<void>;
  applyThemeToDOM: (colors: ThemeColors) => void;
  toggleDarkMode: () => Promise<void>;
}

// Theme color presets
const themePresets = {
  light: {
    primary: '#F79009',    // Yellow
    secondary: '#a6a8ac',  // Gray
    tableHeader: '#f6f6f6', // Light gray
    globalBg: '#ffffff',   // Light theme global background
    globalBg2: '#f6f6f6',  // Light theme secondary global background
    mainContent: {
      background: '#f6f6f6',
      backgroundDarker: '#f6f6f6',
      componentBg: '#f6f6f6'
    }
  },
  dark: {
    primary: '#F79009',    // Yellow
    secondary: '#2d2d3d',  // Dark gray
    tableHeader: '#1e1e2d', // Dark blue-gray
    globalBg: '#252525',   // Dark theme global background
    globalBg2: '#3e3e3e',  // Dark theme secondary global background
    mainContent: {
      background: '#3e3e3e',
      backgroundDarker: '#3e3e3e',
      componentBg: '#3e3e3e'
    }
  }
};

// Function to generate theme colors based on primary color and mode
const generateThemeColors = (primary: string, isDark: boolean): ThemeColors => {
  const baseTheme = isDark ? themePresets.dark : themePresets.light;
  
  return {
    primary: primary || baseTheme.primary,
    secondary: baseTheme.secondary,
    tableHeader: baseTheme.tableHeader,
    globalBg: baseTheme.globalBg,
    globalBg2: baseTheme.globalBg2,
    sidebar: {
      background: primary || baseTheme.primary,
      itemText: isDark ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.8)',
      itemTextHover: '#ffffff',
      activeItemText: '#ffffff',
      activeItemBg: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      divider: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'
    },
    mainContent: {
      background: baseTheme.globalBg2,
      backgroundDarker: baseTheme.globalBg2,
      componentBg: baseTheme.globalBg2
    },
    isDarkMode: isDark
  };
};

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Function to apply theme colors to CSS variables
const applyThemeToDOM = (colors: ThemeColors) => {
  if (!isBrowser) return;

  try {
    document.documentElement.style.setProperty('--theme-primary', colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
    document.documentElement.style.setProperty('--theme-table-header', colors.tableHeader);
    document.documentElement.style.setProperty('--theme-global-bg', colors.globalBg);
    document.documentElement.style.setProperty('--theme-global-bg-2', colors.globalBg2);
    document.documentElement.style.setProperty('--theme-sidebar-bg', colors.sidebar.background);
    document.documentElement.style.setProperty('--theme-sidebar-item-text', colors.sidebar.itemText);
    document.documentElement.style.setProperty('--theme-sidebar-item-hover', colors.sidebar.itemTextHover);
    document.documentElement.style.setProperty('--theme-sidebar-active-text', colors.sidebar.activeItemText);
    document.documentElement.style.setProperty('--theme-sidebar-active-bg', colors.sidebar.activeItemBg);
    document.documentElement.style.setProperty('--theme-sidebar-divider', colors.sidebar.divider);
    document.documentElement.style.setProperty('--theme-main-content-bg', colors.mainContent.background);
    document.documentElement.style.setProperty('--theme-main-content-bg-darker', colors.mainContent.backgroundDarker);
    document.documentElement.style.setProperty('--theme-component-bg', colors.mainContent.componentBg);
    
    // Apply dark mode class to body
    document.documentElement.classList.toggle('dark', colors.isDarkMode);
  } catch (error) {
    console.error('Failed to apply theme to DOM:', error);
  }
};

// Create a broadcast channel for cross-tab communication
const themeChannel = isBrowser ? new BroadcastChannel('theme-sync') : null;

// Get initial theme based on system preference
const getInitialTheme = (): ThemeColors => {
  if (!isBrowser) return generateThemeColors('#000000', false);
  
  try {
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return generateThemeColors(systemPrefersDark ? '#ffffff' : '#000000', systemPrefersDark);
  } catch {
    return generateThemeColors('#000000', false);
  }
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      colors: getInitialTheme(),
      baseTheme: { primary: '#000000', secondary: '#a6a8ac' },
      applyThemeToDOM,
      setTheme: async (newColors: Partial<ThemeColors>) => {
        const currentColors = get().colors;
        const updatedColors = generateThemeColors(
          newColors.primary || currentColors.primary,
          newColors.isDarkMode !== undefined ? newColors.isDarkMode : currentColors.isDarkMode
        );

        // Force clear local storage theme
        if (isBrowser) {
          localStorage.removeItem('theme-storage');
        }

        set({ colors: updatedColors, baseTheme: { primary: updatedColors.primary, secondary: updatedColors.secondary } });
        applyThemeToDOM(updatedColors);

        if (!isBrowser) return;

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { error } = await supabase
              .from('user_themes')
              .upsert({
                auth_id: session.user.id,
                theme_colors: updatedColors,
                base_theme: { primary: updatedColors.primary, secondary: updatedColors.secondary },
                updated_at: new Date().toISOString()
              });

            if (error) {
              console.error('Failed to update theme in database:', error);
            }
          }

          themeChannel?.postMessage(updatedColors);
        } catch (error) {
          console.error('Failed to save theme:', error);
        }
      },
      toggleDarkMode: async () => {
        const { colors, baseTheme } = get();
        const newColors = generateThemeColors(baseTheme.primary, !colors.isDarkMode);
        await get().setTheme(newColors);
      },
      syncThemeFromDb: async () => {
        if (!isBrowser) return;

        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data, error } = await supabase
              .from('user_themes')
              .select('theme_colors, base_theme')
              .eq('auth_id', session.user.id)
              .single();

            if (error) {
              console.error('Failed to fetch theme from database:', error);
              return;
            }

            if (data?.theme_colors && data?.base_theme) {
              set({ 
                colors: data.theme_colors as ThemeColors,
                baseTheme: data.base_theme
              });
              applyThemeToDOM(data.theme_colors);
            }
          }
        } catch (error) {
          console.error('Failed to sync theme from database:', error);
        }
      }
    }),
    {
      name: 'theme-storage',
      onRehydrateStorage: () => (state) => {
        if (state && isBrowser) {
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
    if (newColors) {
      useThemeStore.setState({ colors: newColors });
      applyThemeToDOM(newColors);
    }
  };
} 