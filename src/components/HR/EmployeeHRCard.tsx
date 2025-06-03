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
import { ExternalLink, FileText, Download, Printer, Pencil, Eye, Trash2, Plus } from "lucide-react";
import { EmployeeImageDialog } from './EmployeeImageDialog';
import { DocumentUploadDialog } from './DocumentUploadDialog';
import { format } from 'date-fns';
// @ts-ignore
import html2pdf from 'html2pdf.js';

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

interface WorkHistory {
  id: number;
  employee_id: number;
  company_name: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description: string;
  tenant_id: number;
}

interface Achievement {
  id: number;
  employee_id: number;
  title: string;
  description: string;
  date: string;
  type: 'award' | 'certification' | 'recognition';
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
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const { toast } = useToast();
  const [uploadDialogState, setUploadDialogState] = useState<{
    isOpen: boolean;
    documentType: 'CV' | 'Academic Certificate' | 'Personal Documents';
  } | null>(null);
  const [workHistory, setWorkHistory] = useState<WorkHistory[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (isOpen && employeeId) {
      fetchEmployeeDetails();
      fetchWorkHistory();
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

  const fetchWorkHistory = async () => {
    try {
      // @ts-ignore - Temporarily ignore type error until Supabase types are updated
      const { data, error } = await supabase
        .from('work_history')
        .select('*')
        .eq('employee_id', employeeId)
        .order('start_date', { ascending: false });

      if (error) throw error;
      
      // Type assertion for the raw data
      const rawData = data as unknown as Array<{
        id: number;
        employee_id: number;
        company_name: string;
        position: string;
        start_date: string;
        end_date: string | null;
        description: string;
        tenant_id: number;
      }>;

      setWorkHistory(rawData || []);
    } catch (error) {
      console.error('Error fetching work history:', error);
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

  const handleDownload = async () => {
    const element = document.querySelector('.print-content');
    if (!element) return;

    const opt = {
      margin: 20,
      filename: `HR_Card_${employee?.employee_name || 'Employee'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { 
        scale: 2,
        useCORS: true,
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      await html2pdf().set(opt).from(element).save();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
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

  const getFileName = (storagePath: string) => {
    return storagePath.split('/').pop() || 'Unknown file';
  };

  const handleImageUpdate = (newUrl: string) => {
    if (employee) {
      setEmployee({ ...employee, photo_url: newUrl });
    }
  };

  const handleDeleteDocument = async (docId: number, storagePath: string) => {
    try {
      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('hr-documents')
        .remove([storagePath.replace(/^hr-documents\//, '')]);

      if (storageError) throw storageError;

      // Delete from database
      const { error: dbError } = await supabase
        .from('employee_documents')
        .delete()
        .eq('id', docId);

      if (dbError) throw dbError;

      // Refresh documents list
      if (employee) {
        await fetchEmployeeDocuments(employee.employee_id);
      }

      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting document:', error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    }
  };

  const renderDocumentSection = (type: 'CV' | 'Academic Certificate' | 'Personal Documents') => {
    const typeDocuments = documents
      .filter(doc => doc.document_type === type)
      .sort((a, b) => {
        // Sort by status (Active first) then by date (newest first)
        if (a.status === 'Active' && b.status !== 'Active') return -1;
        if (a.status !== 'Active' && b.status === 'Active') return 1;
        return new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime();
      });

    const activeDocument = typeDocuments.find(doc => doc.status === 'Active');
    const inactiveDocuments = typeDocuments.filter(doc => doc.status !== 'Active');

    return (
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-sm">{type}</h3>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setUploadDialogState({ isOpen: true, documentType: type })}
          >
            <Plus className="h-4 w-4 mr-1" />
            {activeDocument ? 'Update Document' : 'Upload Document'}
          </Button>
        </div>
        {typeDocuments.length === 0 ? (
          <p className="text-sm text-gray-500">No documents available</p>
        ) : (
          <div className="space-y-4">
            {/* Active Document */}
            {activeDocument && (
              <div className="border-l-4 border-green-500 pl-3">
                <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="text-sm font-medium">Current Version</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="default" className="text-xs bg-green-500 hover:bg-green-600">
                        Active
                      </Badge>
                      <span className="text-xs text-gray-500">
                        Uploaded: {formatDate(activeDocument.uploaded_at)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDocumentPreview(activeDocument.supabase_storage_path)}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteDocument(activeDocument.id, activeDocument.supabase_storage_path)}
                      className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Previous Versions */}
            {inactiveDocuments.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-medium text-gray-500">Previous Versions</h4>
                {inactiveDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-2 border rounded-lg bg-gray-50/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Version from {formatDate(doc.uploaded_at)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDocumentPreview(doc.supabase_storage_path)}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDeleteDocument(doc.id, doc.supabase_storage_path)}
                        className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
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
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto print:max-w-none print:max-h-none print:overflow-visible">
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
              @page { 
                size: A4;
                margin: 15mm 15mm 10mm 15mm;
              }
              html, body { 
                margin: 0 !important;
                padding: 0 !important;
                height: auto !important;
              }
              * {
                box-sizing: border-box;
              }
              [role="dialog"] {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                height: auto !important;
                transform: none !important;
                margin: 0 !important;
                padding: 0 !important;
                overflow: visible !important;
              }
              body * { 
                visibility: hidden;
              }
              .print-content, .print-content * { 
                visibility: visible;
                overflow: visible !important;
              }
              .print-content { 
                position: fixed !important;
                left: 0 !important;
                top: 0 !important;
                width: 100% !important;
                margin: 0 !important;
                transform: none !important;
              }
              .no-print { 
                display: none !important;
              }
              .card {
                break-inside: avoid;
                page-break-inside: avoid;
                border: 1px solid #e5e7eb !important;
                box-shadow: none !important;
                margin-bottom: 12px !important;
              }
              .card-header {
                padding: 12px !important;
              }
              .card-content {
                padding: 12px !important;
              }
            }
          `
        }} />

        <div className="space-y-6">
          {/* Printable Content */}
          <div className="print-content space-y-4 print:space-y-3">
            {/* Header with Employee Info */}
            <div className="flex items-start gap-6 pb-4 border-b print:pb-3 print:border-gray-300">
              <div className="print:w-24 cursor-pointer" onClick={() => setIsImageDialogOpen(true)}>
                <Avatar className="w-28 h-28 print:w-24 print:h-24 hover:opacity-80 transition-opacity">
                  <AvatarImage 
                    src={employee.photo_url || undefined} 
                    alt={employee.employee_name}
                    className="object-cover"
                  />
                  <AvatarFallback className="text-xl print:text-base">
                    {getInitials(employee.employee_name || 'Unknown')}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-1 print:text-lg print:mb-0.5">{employee.employee_name}</h2>
                <p className="text-base text-gray-600 mb-1 print:text-sm print:mb-0.5">{employee.title}</p>
                <p className="text-sm text-gray-500 mb-1 print:text-xs print:mb-0.5">{employee.department}</p>
                <div className="flex gap-6 text-sm text-gray-600 mt-2 print:text-xs print:mt-1 print:gap-4">
                  <div>
                    <span className="text-gray-500">ID:</span> {employee.employee_id}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span> {employee.phone_number}
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span> {employee.email}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-2 gap-4 print:gap-3">
              {/* Left Column */}
              <div className="space-y-4 print:space-y-3">
                {/* Personal Information */}
                <Card className="print:shadow-none print:border-gray-300">
                  <CardHeader className="py-3 print:py-2">
                    <CardTitle className="text-base print:text-sm">Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm print:text-xs print:gap-y-1">
                    <div>
                      <span className="text-gray-500">Gender:</span>
                      <p>{employee.gender || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Date of Birth:</span>
                      <p>{formatDate(employee.date_of_birth_cv)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">National ID:</span>
                      <p>{employee.national_id || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">ID Issue Date:</span>
                      <p>{formatDate(employee.id_issue_date_cv)}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Nationality:</span>
                      <p>{employee.nationality || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Ethnic Group:</span>
                      <p>{employee.ethnic_group || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Birth Place:</span>
                      <p>{employee.birth_place || 'N/A'}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Permanent Address:</span>
                      <p>{employee.permanent_address || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Education */}
                <Card className="print:shadow-none print:border-gray-300">
                  <CardHeader className="py-3 print:py-2">
                    <CardTitle className="text-base print:text-sm">Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm print:text-xs print:space-y-1">
                    <div>
                      <span className="text-gray-500">Highest Education:</span>
                      <p>{employee.highest_education || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Institution:</span>
                      <p>{employee.education_institution || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Major:</span>
                      <p>{employee.major || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Graduation Year:</span>
                      <p>{employee.graduation_year || 'N/A'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right Column */}
              <div className="space-y-4 print:space-y-3">
                {/* Work History */}
                <Card className="print:shadow-none print:border-gray-300">
                  <CardHeader className="py-3 print:py-2">
                    <CardTitle className="text-base print:text-sm">Work History</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[250px] overflow-y-auto print:max-h-none print:overflow-visible print:space-y-2">
                    {workHistory.length === 0 ? (
                      <p className="text-sm text-gray-500">No work history available</p>
                    ) : (
                      workHistory.map((work) => (
                        <div key={work.id} className="border-l-2 border-gray-200 pl-3 pb-3">
                          <h4 className="text-sm font-medium">{work.position}</h4>
                          <p className="text-sm text-gray-600">{work.company_name}</p>
                          <p className="text-xs text-gray-500">
                            {format(new Date(work.start_date), 'MMM yyyy')} - {' '}
                            {work.end_date 
                              ? format(new Date(work.end_date), 'MMM yyyy')
                              : 'Present'}
                          </p>
                          <p className="text-sm mt-1">{work.description}</p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>

                {/* Achievements & Awards */}
                <Card className="print:shadow-none print:border-gray-300">
                  <CardHeader className="py-3 print:py-2">
                    <CardTitle className="text-base print:text-sm">Achievements & Awards</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 print:space-y-2 print:text-xs">
                    {achievements.length === 0 ? (
                      <p className="text-sm text-gray-500">No achievements recorded</p>
                    ) : (
                      achievements.map((achievement) => (
                        <div key={achievement.id} className="border-l-2 border-gray-200 pl-3 pb-3">
                          <h4 className="text-sm font-medium">{achievement.title}</h4>
                          <p className="text-xs text-gray-500">
                            {format(new Date(achievement.date), 'MMM yyyy')}
                          </p>
                          <p className="text-sm mt-1">{achievement.description}</p>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Documents Section - Not Printable */}
          <div className="no-print">
            <Card>
              <CardHeader>
                <CardTitle>Documents</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {renderDocumentSection('CV')}
                  {renderDocumentSection('Academic Certificate')}
                  {renderDocumentSection('Personal Documents')}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>

      {/* Image Dialog */}
      {employee && (
        <EmployeeImageDialog
          isOpen={isImageDialogOpen}
          onClose={() => setIsImageDialogOpen(false)}
          employeeId={employee.employee_id.toString()}
          currentImageUrl={employee.photo_url || null}
          onImageUpdate={handleImageUpdate}
        />
      )}

      {/* Document Upload Dialog */}
      {uploadDialogState && employee && (
        <DocumentUploadDialog
          isOpen={uploadDialogState.isOpen}
          onClose={() => setUploadDialogState(null)}
          employeeId={employee.employee_id}
          documentType={uploadDialogState.documentType}
          tenantId={1} // Replace with actual tenant ID from your system
          onUploadSuccess={() => {
            fetchEmployeeDocuments(employee.employee_id);
            setUploadDialogState(null);
          }}
        />
      )}
    </Dialog>
  );
};

export default EmployeeHRCard;
