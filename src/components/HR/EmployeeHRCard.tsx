
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";

interface EmployeeDocument {
  id: number;
  document_type: string;
  supabase_storage_path: string;
  status: string;
  uploaded_at: string;
}

interface EmployeeDetails {
  id: string;
  employee_name: string;
  title: string;
  department: string;
  gender: string;
  date_of_birth_cv: string;
  national_id: string;
  id_issue_date_cv: string;
  id_issue_place: string;
  nationality: string;
  ethnic_group: string;
  marital_status: string;
  birth_place: string;
  permanent_address: string;
  highest_education: string;
  education_institution: string;
  major: string;
  graduation_year: number;
  phone_number: string;
  email: string;
  photo_url: string;
}

interface EmployeeHRCardProps {
  employeeId: string;
  isOpen: boolean;
  onClose: () => void;
}

const EmployeeHRCard: React.FC<EmployeeHRCardProps> = ({
  employeeId,
  isOpen,
  onClose,
}) => {
  const [employee, setEmployee] = useState<EmployeeDetails | null>(null);
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployeeDetails();
      fetchEmployeeDocuments();
    }
  }, [isOpen, employeeId]);

  const fetchEmployeeDetails = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('employee_information')
        .select('*')
        .eq('id', employeeId)
        .single();

      if (error) throw error;
      setEmployee(data);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      toast({
        title: "Error",
        description: "Failed to load employee details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeDocuments = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId);

      if (error) throw error;
      setDocuments(data || []);
    } catch (error) {
      console.error('Error fetching employee documents:', error);
    }
  };

  const handleDocumentPreview = async (storagePath: string) => {
    try {
      const { data } = supabase.storage
        .from('documents')
        .getPublicUrl(storagePath);
      
      if (data?.publicUrl) {
        window.open(data.publicUrl, '_blank');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to open document",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Loading employee details...</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!employee) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <div className="flex justify-center items-center h-40">
            <p className="text-gray-500">Employee not found</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Employee Details</DialogTitle>
        </DialogHeader>

        {/* Header Section */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={employee.photo_url} alt={employee.employee_name} />
                <AvatarFallback className="text-xl">
                  {getInitials(employee.employee_name || 'Unknown')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{employee.employee_name}</h2>
                <p className="text-lg text-gray-600">{employee.title}</p>
                <p className="text-md text-gray-500">{employee.department}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Gender:</span>
                  <p>{employee.gender || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Date of Birth:</span>
                  <p>{formatDate(employee.date_of_birth_cv)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">National ID:</span>
                  <p>{employee.national_id || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">ID Issue Date:</span>
                  <p>{formatDate(employee.id_issue_date_cv)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">ID Issue Place:</span>
                  <p>{employee.id_issue_place || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Nationality:</span>
                  <p>{employee.nationality || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Ethnic Group:</span>
                  <p>{employee.ethnic_group || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Marital Status:</span>
                  <p>{employee.marital_status || 'N/A'}</p>
                </div>
              </div>
              <Separator />
              <div>
                <span className="font-medium text-gray-500">Birth Place:</span>
                <p className="mt-1">{employee.birth_place || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Permanent Address:</span>
                <p className="mt-1">{employee.permanent_address || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Expertise and Education */}
          <Card>
            <CardHeader>
              <CardTitle>Expertise and Education</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium text-gray-500">Highest Education:</span>
                <p>{employee.highest_education || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Education Institution:</span>
                <p>{employee.education_institution || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Major:</span>
                <p>{employee.major || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Graduation Year:</span>
                <p>{employee.graduation_year || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="font-medium text-gray-500">Phone Number:</span>
                <p>{employee.phone_number || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-500">Email:</span>
                <p>{employee.email || 'N/A'}</p>
              </div>
            </CardContent>
          </Card>

          {/* Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <p className="text-gray-500 text-sm">No documents available</p>
              ) : (
                <div className="space-y-3">
                  {documents.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium text-sm">{doc.document_type}</p>
                          <p className="text-xs text-gray-500">
                            Uploaded: {formatDate(doc.uploaded_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={doc.status === 'Active' ? 'default' : 'outline'}>
                          {doc.status}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDocumentPreview(doc.supabase_storage_path)}
                        >
                          <ExternalLink className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeHRCard;
