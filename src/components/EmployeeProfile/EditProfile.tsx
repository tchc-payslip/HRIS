
import React from 'react';
import { useEmployeeStore } from '@/store/employeeStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileImageUpload from './ProfileImageUpload';
import ProfessionalInfo from './ProfessionalInfo';
import CustomFields from './CustomFields';

interface EditProfileProps {
  employee: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    position: string;
    department: string;
    hireDate: string;
    phone: string;
    address: string;
    bio: string;
    profileImage: string;
    dob?: string;
    employmentType?: string;
    emergencyContact?: string;
    skills?: string[];
    qualifications?: string[];
    certifications?: string[];
    customFields?: Record<string, string>;
  };
  onCancel: () => void;
}

const EditProfile = ({ employee, onCancel }: EditProfileProps) => {
  const { updateEmployee, isLoading, uploadProfileImage } = useEmployeeStore();
  
  const [formData, setFormData] = React.useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    bio: employee.bio,
    dob: employee.dob || '',
    emergencyContact: employee.emergencyContact || '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateEmployee(formData);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
      onCancel();
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleImageUpload = async (file: File) => {
    await uploadProfileImage(file);
  };
  
  const handleProfessionalInfoUpdate = async (data: {
    skills?: string[];
    qualifications?: string[];
    certifications?: string[];
  }) => {
    try {
      await updateEmployee(data);
      toast({
        title: "Professional information updated",
        description: "Your professional information has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update professional information. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleCustomFieldsUpdate = async (data: {
    customFields: Record<string, string>;
  }) => {
    try {
      await updateEmployee(data);
      toast({
        title: "Custom fields updated",
        description: "Your custom fields have been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Update failed",
        description: "Failed to update custom fields. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div>
      <h1 className="page-title">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="professional">Professional Information</TabsTrigger>
            <TabsTrigger value="custom">Custom Fields</TabsTrigger>
          </TabsList>
          
          <TabsContent value="personal" className="space-y-4">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="md:col-span-1">
                <CardHeader className="flex flex-col items-center">
                  <ProfileImageUpload 
                    image={employee.profileImage}
                    initials={`${employee.firstName[0]}${employee.lastName[0]}`}
                    onUpload={handleImageUpload}
                    isLoading={isLoading}
                  />
                </CardHeader>
              </Card>
              
              <Card className="md:col-span-2">
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dob">Date of Birth</Label>
                        <Input
                          id="dob"
                          name="dob"
                          type="date"
                          value={formData.dob}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="emergencyContact">Emergency Contact</Label>
                      <Input
                        id="emergencyContact"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        placeholder="Name, Relationship, Phone Number"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="professional">
            <ProfessionalInfo
              skills={employee.skills || []}
              qualifications={employee.qualifications || []}
              certifications={employee.certifications || []}
              onUpdate={handleProfessionalInfoUpdate}
              isEditing={true}
              isLoading={isLoading}
            />
          </TabsContent>
          
          <TabsContent value="custom">
            <CustomFields
              fields={employee.customFields || {}}
              onUpdate={handleCustomFieldsUpdate}
              isEditing={true}
              isLoading={isLoading}
            />
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
};

export default EditProfile;
