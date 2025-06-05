import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";
import { Employee } from '@/services/employeeService';

interface ProfessionalInfoProps {
  employee: Employee;
  onUpdate: (data: Partial<Employee>) => Promise<void>;
}

const ProfessionalInfo = ({ 
  employee,
  onUpdate,
}: ProfessionalInfoProps) => {
  // Use customFields for storing professional info
  const [localSkills, setLocalSkills] = useState<string[]>(
    employee.customFields?.skills?.split(',').filter(Boolean) || []
  );
  const [localQualifications, setLocalQualifications] = useState<string[]>(
    employee.customFields?.qualifications?.split(',').filter(Boolean) || []
  );
  const [localCertifications, setLocalCertifications] = useState<string[]>(
    employee.customFields?.certifications?.split(',').filter(Boolean) || []
  );
  
  const [newSkill, setNewSkill] = useState('');
  const [newQualification, setNewQualification] = useState('');
  const [newCertification, setNewCertification] = useState('');
  
  const handleAddSkill = () => {
    if (newSkill.trim()) {
      setLocalSkills([...localSkills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  const handleRemoveSkill = (index: number) => {
    setLocalSkills(localSkills.filter((_, i) => i !== index));
  };
  
  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setLocalQualifications([...localQualifications, newQualification.trim()]);
      setNewQualification('');
    }
  };
  
  const handleRemoveQualification = (index: number) => {
    setLocalQualifications(localQualifications.filter((_, i) => i !== index));
  };
  
  const handleAddCertification = () => {
    if (newCertification.trim()) {
      setLocalCertifications([...localCertifications, newCertification.trim()]);
      setNewCertification('');
    }
  };
  
  const handleRemoveCertification = (index: number) => {
    setLocalCertifications(localCertifications.filter((_, i) => i !== index));
  };
  
  const handleSave = async () => {
    await onUpdate({
      customFields: {
        ...employee.customFields,
        skills: localSkills.join(','),
        qualifications: localQualifications.join(','),
        certifications: localCertifications.join(','),
      }
    });
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Skills */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Skills</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {localSkills.map((skill, index) => (
              <Badge key={index} variant="secondary" className="py-1">
                {skill}
                <button 
                  onClick={() => handleRemoveSkill(index)}
                  className="ml-1 hover:text-red-500"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Add new skill" 
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddSkill} 
              size="sm" 
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Qualifications */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Qualifications</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {localQualifications.map((qualification, index) => (
              <Badge key={index} variant="outline" className="py-1">
                {qualification}
                <button 
                  onClick={() => handleRemoveQualification(index)}
                  className="ml-1 hover:text-red-500"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Add new qualification" 
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddQualification} 
              size="sm" 
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Certifications */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">Certifications</h4>
          <div className="flex flex-wrap gap-2 mb-2">
            {localCertifications.map((certification, index) => (
              <Badge key={index} className="py-1">
                {certification}
                <button 
                  onClick={() => handleRemoveCertification(index)}
                  className="ml-1 hover:text-red-500"
                  type="button"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input 
              placeholder="Add new certification" 
              value={newCertification}
              onChange={(e) => setNewCertification(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleAddCertification} 
              size="sm" 
              type="button"
            >
              <Plus className="h-4 w-4" />
            </Button>
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

export default ProfessionalInfo;
