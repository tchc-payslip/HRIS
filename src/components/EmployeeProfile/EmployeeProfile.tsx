import React, { useEffect, useState } from 'react';
import { useEmployeeStore } from '@/store/employeeStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/hooks/use-toast';
import EditProfile from './EditProfile';

const EmployeeProfile = () => {
  const { employee, isLoading, error, fetchEmployee } = useEmployeeStore();
  const { session } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    if (session) {
      fetchEmployee();
    }
  }, [fetchEmployee, session]);
  
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error]);
  
  const handleEditClick = () => {
    setIsEditing(true);
  };
  
  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  if (!session) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Please sign in to view your profile</p>
      </div>
    );
  }
  
  if (isLoading && !employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Loading profile...</p>
      </div>
    );
  }
  
  if (!employee) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-lg text-gray-500">Employee data not available</p>
      </div>
    );
  }
  
  if (isEditing) {
    return <EditProfile employee={employee} onCancel={handleCancelEdit} />;
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-semibold">My Profile</h1>
        <Button onClick={handleEditClick}>Edit Profile</Button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={employee.profile_image} alt={employee.employee_name} />
              <AvatarFallback className="text-3xl">
                {employee.employee_name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-center">{employee.employee_name}</CardTitle>
            <CardDescription>{employee.title}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p>{employee.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Sub Department</p>
                <p>{employee.sub_department || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{employee.phone_number}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Contract Start Date</p>
                <p>{new Date(employee.contract_start_date_cv).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Date of Birth</p>
                <p>{employee.date_of_birth_cv ? new Date(employee.date_of_birth_cv).toLocaleDateString() : '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-600">{employee.permanent_address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">National ID</p>
                      <p className="text-gray-600">{employee.national_id}</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Employment Details</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employee ID</p>
                    <p className="text-gray-600">{employee.employee_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Contract Type</p>
                    <p className="text-gray-600">{employee.contract_type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Duty</p>
                    <p className="text-gray-600">{employee.duty || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Seniority Date</p>
                    <p className="text-gray-600">
                      {employee.seniority_date_cv ? new Date(employee.seniority_date_cv).toLocaleDateString() : '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Gender</p>
                    <p className="text-gray-600">{employee.gender}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Marital Status</p>
                    <p className="text-gray-600">{employee.marital_status}</p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Education</h3>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Highest Education</p>
                    <p className="text-gray-600">{employee.highest_education}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Major</p>
                    <p className="text-gray-600">{employee.major}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Institution</p>
                    <p className="text-gray-600">{employee.education_institution}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nationality</p>
                    <p className="text-gray-600">{employee.nationality}</p>
                  </div>
                </div>
              </div>

              {employee.emergency_contact && (
                <>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-medium">Emergency Contact</h3>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Name</p>
                        <p className="text-gray-600">{employee.emergency_contact.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Relationship</p>
                        <p className="text-gray-600">{employee.emergency_contact.relationship}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Phone</p>
                        <p className="text-gray-600">{employee.emergency_contact.phone}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Address</p>
                        <p className="text-gray-600">{employee.emergency_contact.address}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfile;
