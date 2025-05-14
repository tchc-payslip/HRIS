
import React from 'react';
import { useEmployeeStore } from '@/store/employeeStore';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from '@/hooks/use-toast';

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
  };
  onCancel: () => void;
}

const EditProfile = ({ employee, onCancel }: EditProfileProps) => {
  const { updateEmployee, isLoading } = useEmployeeStore();
  
  const [formData, setFormData] = React.useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    email: employee.email,
    phone: employee.phone,
    address: employee.address,
    bio: employee.bio,
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
  
  return (
    <div>
      <h1 className="page-title">Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center">
              <Avatar className="w-32 h-32">
                <AvatarImage src={employee.profileImage} alt={`${employee.firstName} ${employee.lastName}`} />
                <AvatarFallback className="text-3xl">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
              </Avatar>
              <Button variant="outline" className="mt-4" type="button">
                Change Photo
              </Button>
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
      </form>
    </div>
  );
};

export default EditProfile;
