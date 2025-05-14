
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { X, Plus, Edit2 } from "lucide-react";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";

interface CustomFieldsProps {
  fields: Record<string, string>;
  onUpdate: (data: { customFields: Record<string, string> }) => Promise<void>;
  isEditing: boolean;
  isLoading?: boolean;
}

const CustomFields = ({ 
  fields, 
  onUpdate, 
  isEditing, 
  isLoading = false 
}: CustomFieldsProps) => {
  const [localFields, setLocalFields] = useState<Record<string, string>>(fields);
  const [newFieldKey, setNewFieldKey] = useState('');
  const [newFieldValue, setNewFieldValue] = useState('');
  const [editingKey, setEditingKey] = useState<string | null>(null);
  
  const handleAddField = () => {
    if (newFieldKey.trim() && newFieldValue.trim()) {
      setLocalFields({
        ...localFields,
        [newFieldKey.trim()]: newFieldValue.trim(),
      });
      setNewFieldKey('');
      setNewFieldValue('');
    }
  };
  
  const handleRemoveField = (key: string) => {
    const { [key]: removed, ...rest } = localFields;
    setLocalFields(rest);
  };
  
  const handleStartEdit = (key: string) => {
    setEditingKey(key);
    setNewFieldValue(localFields[key]);
  };
  
  const handleUpdateField = () => {
    if (editingKey && newFieldValue.trim()) {
      setLocalFields({
        ...localFields,
        [editingKey]: newFieldValue.trim(),
      });
      setEditingKey(null);
      setNewFieldValue('');
    }
  };
  
  const handleSave = async () => {
    await onUpdate({ customFields: localFields });
  };
  
  if (!isEditing) {
    if (Object.keys(fields).length === 0) {
      return null;
    }
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-medium mb-4">Additional Information</h3>
        <Table>
          <TableBody>
            {Object.entries(fields).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Custom Fields</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Field</TableHead>
              <TableHead>Value</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Object.entries(localFields).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell className="font-medium">{key}</TableCell>
                <TableCell>
                  {editingKey === key ? (
                    <Input 
                      value={newFieldValue}
                      onChange={(e) => setNewFieldValue(e.target.value)}
                    />
                  ) : (
                    value
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    {editingKey === key ? (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleUpdateField}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleStartEdit(key)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleRemoveField(key)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        <div className="mt-4 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Field name"
              value={newFieldKey}
              onChange={(e) => setNewFieldKey(e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Field value"
              value={newFieldValue}
              onChange={(e) => setNewFieldValue(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleAddField} size="sm" type="button">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Custom Fields"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CustomFields;
