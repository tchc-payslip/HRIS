
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus } from "lucide-react";

interface ProfessionalInfoProps {
  skills: string[];
  qualifications: string[];
  certifications: string[];
  onUpdate: (data: { 
    skills?: string[], 
    qualifications?: string[],
    certifications?: string[]
  }) => Promise<void>;
  isEditing: boolean;
  isLoading?: boolean;
}

const ProfessionalInfo = ({ 
  skills, 
  qualifications, 
  certifications, 
  onUpdate,
  isEditing,
  isLoading = false
}: ProfessionalInfoProps) => {
  const [localSkills, setLocalSkills] = useState<string[]>(skills);
  const [localQualifications, setLocalQualifications] = useState<string[]>(qualifications);
  const [localCertifications, setLocalCertifications] = useState<string[]>(certifications);
  
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
      skills: localSkills,
      qualifications: localQualifications,
      certifications: localCertifications
    });
  };
  
  if (!isEditing) {
    return (
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium mb-4">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Qualifications</h3>
          <div className="flex flex-wrap gap-2">
            {qualifications.map((qual, index) => (
              <Badge key={index} variant="outline">{qual}</Badge>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-4">Certifications</h3>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert, index) => (
              <Badge key={index}>{cert}</Badge>
            ))}
          </div>
        </div>
      </div>
    );
  }
  
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
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? "Saving..." : "Save Professional Information"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProfessionalInfo;
