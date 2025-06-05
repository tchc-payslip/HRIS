import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { Employee } from '@/services/employeeService';

interface CustomFieldsProps {
  fields?: Record<string, any>;
  onUpdate: (data: Partial<Employee>) => Promise<void>;
}

const CustomFields = ({ fields = {}, onUpdate }: CustomFieldsProps) => {
  const [localFields, setLocalFields] = useState<Record<string, string>>(fields);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  
  const handleAddField = () => {
    if (newFieldName.trim() && newFieldValue.trim()) {
      setLocalFields({
        ...localFields,
        [newFieldName.trim()]: newFieldValue.trim()
      });
      setNewFieldName('');
      setNewFieldValue('');
    }
  };
  
  const handleRemoveField = (key: string) => {
    const { [key]: _, ...rest } = localFields;
    setLocalFields(rest);
  };
  
  const handleUpdateField = (key: string, value: string) => {
    setLocalFields({
      ...localFields,
      [key]: value
    });
  };
  
  const handleSave = async () => {
    await onUpdate({
      customFields: localFields
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Fields</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Existing Fields */}
        <div className="space-y-4">
          {Object.entries(localFields)
            .filter(([key]) => !['skills', 'qualifications', 'certifications'].includes(key))
            .map(([key, value]) => (
              <div key={key} className="flex gap-2 items-start">
                <div className="flex-1 space-y-2">
                  <Label>{key}</Label>
                  <Input
                    value={value as string}
                    onChange={(e) => handleUpdateField(key, e.target.value)}
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveField(key)}
                  className="mt-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
        </div>
        
        {/* Add New Field */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium">Add New Field</h4>
          <div className="flex gap-2">
            <div className="flex-1">
              <Input
                placeholder="Field Name"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
            </div>
            <div className="flex-1">
              <Input
                placeholder="Field Value"
                value={newFieldValue}
                onChange={(e) => setNewFieldValue(e.target.value)}
              />
            </div>
            <Button onClick={handleAddField}>Add</Button>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomFields;
