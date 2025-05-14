
import React, { useEffect } from 'react';
import { useEmployeeStore } from '@/store/employeeStore';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from '@/hooks/use-toast';
import EditProfile from './EditProfile';
import { useState } from 'react';

const EmployeeProfile = () => {
  const { employee, isLoading, error, fetchEmployee } = useEmployeeStore();
  const [isEditing, setIsEditing] = useState(false);
  
  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);
  
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
  
  if (isLoading) {
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
      <h1 className="page-title">Employee Profile</h1>
      
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardHeader className="flex flex-col items-center">
            <Avatar className="w-32 h-32">
              <AvatarImage src={employee.profileImage} alt={`${employee.firstName} ${employee.lastName}`} />
              <AvatarFallback className="text-3xl">{employee.firstName[0]}{employee.lastName[0]}</AvatarFallback>
            </Avatar>
            <CardTitle className="mt-4 text-center">{employee.firstName} {employee.lastName}</CardTitle>
            <CardDescription>{employee.position}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Department</p>
                <p>{employee.department}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Email</p>
                <p>{employee.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Phone</p>
                <p>{employee.phone}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Hire Date</p>
                <p>{new Date(employee.hireDate).toLocaleDateString()}</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleEditClick}>Edit Profile</Button>
          </CardFooter>
        </Card>
        
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium">About Me</h3>
                <p className="text-gray-600 mt-2">{employee.bio}</p>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-lg font-medium">Contact Information</h3>
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Address</p>
                      <p className="text-gray-600">{employee.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Personal Email</p>
                      <p className="text-gray-600">{employee.email}</p>
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
                    <p className="text-gray-600">EMP-{employee.id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Department</p>
                    <p className="text-gray-600">{employee.department}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Position</p>
                    <p className="text-gray-600">{employee.position}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Hire Date</p>
                    <p className="text-gray-600">{new Date(employee.hireDate).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Employment Type</p>
                    <p className="text-gray-600">Full Time</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeProfile;
