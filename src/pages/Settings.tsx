
import React, { useState, useEffect } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define theme color options
const themeColors = [
  { name: "Green", value: "green-700" },
  { name: "Blue", value: "blue-700" },
  { name: "Purple", value: "purple-700" },
  { name: "Indigo", value: "indigo-700" },
  { name: "Red", value: "red-700" }
];

// Define languages
const languages = [
  { name: "English", value: "en" },
  { name: "Tiếng Việt", value: "vi" }
];

const Settings = () => {
  const navigate = useNavigate();
  
  // Load saved settings from localStorage or use defaults
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem('theme-color') || 'green-700';
  });
  
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });
  
  // Keep track of initial settings to check if changes were made
  const [initialColor] = useState(selectedColor);
  const [initialLanguage] = useState(selectedLanguage);

  const hasChanges = selectedColor !== initialColor || selectedLanguage !== initialLanguage;
  
  // Apply color change immediately for preview
  useEffect(() => {
    // Update document style for preview
    document.documentElement.style.setProperty('--theme-color', selectedColor);
  }, [selectedColor]);
  
  const handleSave = () => {
    // Save settings to localStorage
    localStorage.setItem('theme-color', selectedColor);
    localStorage.setItem('language', selectedLanguage);
    
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated."
    });
  };
  
  const handleCancel = () => {
    // Reset to initial values
    setSelectedColor(initialColor);
    setSelectedLanguage(initialLanguage);
    
    // Apply initial color back
    document.documentElement.style.setProperty('--theme-color', initialColor);
    
    toast({
      title: "Changes canceled",
      description: "Your changes have been discarded."
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate(-1)}
          className="mr-2"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-bold">Settings</h2>
      </div>
      
      <div className="space-y-8">
        {/* Theme Color Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-base font-semibold mb-4">Appearance</h3>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="theme-color">Theme Color</Label>
              <Select
                value={selectedColor}
                onValueChange={setSelectedColor}
              >
                <SelectTrigger id="theme-color" className="w-full">
                  <SelectValue placeholder="Select a theme color" />
                </SelectTrigger>
                <SelectContent>
                  {themeColors.map((color) => (
                    <SelectItem key={color.value} value={color.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full bg-${color.value} mr-2`}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="mt-4 flex space-x-2">
                <div className="text-sm text-gray-500">Preview:</div>
                <div className={`px-3 py-1 rounded-md bg-${selectedColor} text-white text-sm`}>
                  Button
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Language Section */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-base font-semibold mb-4">Language</h3>
          
          <div className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="language">Display Language</Label>
              <Select
                value={selectedLanguage}
                onValueChange={setSelectedLanguage}
              >
                <SelectTrigger id="language" className="w-full">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-3">
          <Button 
            onClick={handleCancel} 
            variant="outline"
            disabled={!hasChanges}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={!hasChanges}
            className={`bg-${selectedColor} hover:bg-${selectedColor}`}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
