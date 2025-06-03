import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useThemeStore, ThemeColors } from '@/store/themeStore';
import { cn } from '@/lib/utils';

const predefinedThemes: { name: string; colors: ThemeColors }[] = [
  {
    name: 'Default',
    colors: {
      primary: '#000000',
      secondary: '#a6a8ac',
      tableHeader: '#f6f6f6'
    }
  },
  {
    name: 'Gray',
    colors: {
      primary: '#414650',
      secondary: '#a6a8ac',
      tableHeader: '#d7d7d9'
    }
  },
  {
    name: 'Purple',
    colors: {
      primary: '#683fc8',
      secondary: '#d5bafc',
      tableHeader: '#f8f5fd'
    }
  },
  {
    name: 'Red',
    colors: {
      primary: '#d92c20',
      secondary: '#f77067',
      tableHeader: '#fef2f2'
    }
  },
  {
    name: 'Orange',
    colors: {
      primary: '#fdb022',
      secondary: '#ffe08b',
      tableHeader: '#fff0c3'
    }
  },
  {
    name: 'Green',
    colors: {
      primary: '#305d32',
      secondary: '#69a56c',
      tableHeader: '#dcf2e2'
    }
  }
];

const ColorSwatch = ({ color, label }: { color: string; label: string }) => (
  <div className="flex flex-col w-20 h-24 rounded-md overflow-hidden border border-gray-200">
    <div className="flex-1 flex items-center justify-center" style={{ backgroundColor: color }}>
    </div>
    <div className="p-2 text-xs text-center bg-white">
      {color.toUpperCase()}
    </div>
  </div>
);

const Settings = () => {
  const { colors: currentColors, setTheme } = useThemeStore();

  const handleThemeSelect = (colors: ThemeColors) => {
    setTheme(colors);
    document.documentElement.style.setProperty('--theme-primary', colors.primary);
    document.documentElement.style.setProperty('--theme-secondary', colors.secondary);
    document.documentElement.style.setProperty('--theme-table-header', colors.tableHeader);
  };

  return (
    <div className="space-y-6 text-sm">
      <div>
        <h2 className="text-xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Theme</CardTitle>
          <CardDescription>
            Choose a theme color for the application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label className="text-sm mb-3">Color Themes</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
                {predefinedThemes.map((theme) => (
                  <button
                    key={theme.name}
                    onClick={() => handleThemeSelect(theme.colors)}
                    className={cn(
                      "relative p-4 rounded-lg border-2 transition-all",
                      JSON.stringify(currentColors) === JSON.stringify(theme.colors)
                        ? "border-primary shadow-sm"
                        : "border-transparent hover:border-muted"
                    )}
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-sm font-medium mb-2">{theme.name}</span>
                      <div className="flex gap-2 justify-center">
                        <ColorSwatch color={theme.colors.primary} label="Primary" />
                        <ColorSwatch color={theme.colors.secondary} label="Secondary" />
                        <ColorSwatch color={theme.colors.tableHeader} label="Table" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Label className="text-sm mb-3">Color Usage</Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Primary Color</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Header bar</li>
                    <li>Active sections</li>
                    <li>Active tabs</li>
                    <li>Primary buttons</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Secondary Color</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Secondary buttons</li>
                    <li>Accent elements</li>
                  </ul>
                </div>
                <div className="p-3 bg-gray-50 rounded-md">
                  <h3 className="font-medium mb-2">Table Header Color</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    <li>Table header backgrounds</li>
                    <li>Section backgrounds</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
