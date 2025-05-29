
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
import { ExternalLink, FileText, Download, Printer } from "lucide-react";

interface EmployeeDocument {
  id: number;
  document_type: string;
  supabase_storage_path: string;
  status: string;
  uploaded_at: string;
}

interface EmployeeDetails {
  id: string;
  employee_id: number;
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
      
      // Fetch documents using employee_id
      if (data?.employee_id) {
        await fetchEmployeeDocuments(data.employee_id);
      }
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

  const fetchEmployeeDocuments = async (employeeId: number) => {
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
      // Fix URL structure: remove duplicate hr-documents/ prefix
      const correctedPath = storagePath.replace(/^hr-documents\//, '').replace('tenant-', 'tenant_');
      
      const { data } = supabase.storage
        .from('hr-documents')
        .getPublicUrl(correctedPath);
      
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

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Create HTML content for PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>HR Card - ${employee?.employee_name}</title>
          <style>
            @page { size: A4; margin: 20mm; }
            body { font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; margin: 0; padding: 0; }
            .header { text-align: center; margin-bottom: 20px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; font-size: 14px; margin-bottom: 8px; border-bottom: 1px solid #ccc; padding-bottom: 4px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .field { margin-bottom: 5px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee HR Card</h1>
            <h2>${employee?.employee_name || 'N/A'}</h2>
            <p>${employee?.title || 'N/A'} - ${employee?.department || 'N/A'}</p>
          </div>
          
          <div class="section">
            <div class="section-title">Personal Information</div>
            <div class="grid">
              <div class="field"><span class="label">Gender:</span> ${employee?.gender || 'N/A'}</div>
              <div class="field"><span class="label">Date of Birth:</span> ${employee?.date_of_birth_cv ? new Date(employee.date_of_birth_cv).toLocaleDateString() : 'N/A'}</div>
              <div class="field"><span class="label">National ID:</span> ${employee?.national_id || 'N/A'}</div>
              <div class="field"><span class="label">Nationality:</span> ${employee?.nationality || 'N/A'}</div>
              <div class="field"><span class="label">Marital Status:</span> ${employee?.marital_status || 'N/A'}</div>
              <div class="field"><span class="label">Ethnic Group:</span> ${employee?.ethnic_group || 'N/A'}</div>
            </div>
            <div class="field"><span class="label">Birth Place:</span> ${employee?.birth_place || 'N/A'}</div>
            <div class="field"><span class="label">Permanent Address:</span> ${employee?.permanent_address || 'N/A'}</div>
          </div>
          
          <div class="section">
            <div class="section-title">Education & Expertise</div>
            <div class="grid">
              <div class="field"><span class="label">Highest Education:</span> ${employee?.highest_education || 'N/A'}</div>
              <div class="field"><span class="label">Institution:</span> ${employee?.education_institution || 'N/A'}</div>
              <div class="field"><span class="label">Major:</span> ${employee?.major || 'N/A'}</div>
              <div class="field"><span class="label">Graduation Year:</span> ${employee?.graduation_year || 'N/A'}</div>
            </div>
          </div>
          
          <div class="section">
            <div class="section-title">Contact Information</div>
            <div class="field"><span class="label">Phone:</span> ${employee?.phone_number || 'N/A'}</div>
            <div class="field"><span class="label">Email:</span> ${employee?.email || 'N/A'}</div>
          </div>
        </body>
      </html>
    `;

    // Create a blob and download
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `HR_Card_${employee?.employee_name || 'Employee'}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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

  const getFileName = (storagePath: string) => {
    return storagePath.split('/').pop() || 'Unknown file';
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
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
        <DialogHeader className="print:hidden">
          <div className="flex justify-between items-center">
            <DialogTitle>Employee Details</DialogTitle>
            <div className="flex gap-2">
              <Button onClick={handlePrint} variant="outline" size="sm">
                <Printer className="h-4 w-4 mr-2" />
                Print HR Card
              </Button>
              <Button onClick={handleDownload} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </DialogHeader>

        <style dangerouslySetInnerHTML={{
          __html: `
            @media print {
              @page { size: A4; margin: 20mm; }
              body * { visibility: hidden; }
              .print-content, .print-content * { visibility: visible; }
              .print-content { position: absolute; left: 0; top: 0; width: 100%; }
            }
          `
        }} />

        <div className="print-content">
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
                  <p className="text-sm text-gray-400">ID: {employee.employee_id}</p>
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
                              File: {getFileName(doc.supabase_storage_path)}
                            </p>
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
                            className="print:hidden"
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EmployeeHRCard;
