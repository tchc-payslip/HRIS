import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { format } from 'date-fns';

interface DocumentUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: number;
  documentType: 'CV' | 'Academic Certificate' | 'Personal Documents';
  onUploadSuccess: () => void;
  tenantId: number;
}

export function DocumentUploadDialog({
  isOpen,
  onClose,
  employeeId,
  documentType,
  onUploadSuccess,
  tenantId,
}: DocumentUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      toast({
        title: "Invalid file type",
        description: "Please upload PDF files only",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 2MB",
        variant: "destructive",
      });
      return;
    }

    // Basic filename sanitization
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special characters with underscore
      .replace(/_{2,}/g, '_')          // Replace multiple underscores with single
      .toLowerCase();                   // Convert to lowercase

    setFileName(sanitizedName);
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !fileName) return;

    setIsUploading(true);
    try {
      console.log('Starting document upload process...');

      // If there's an active document, set it to inactive
      const { data: existingDocs, error: queryError } = await supabase
        .from('employee_documents')
        .select('*')
        .eq('employee_id', employeeId)
        .eq('document_type', documentType)
        .eq('status', 'Active');

      if (queryError) {
        console.error('Error querying existing documents:', queryError);
        throw queryError;
      }

      if (existingDocs && existingDocs.length > 0) {
        const { error: updateError } = await supabase
          .from('employee_documents')
          .update({ status: 'Inactive' })
          .eq('id', existingDocs[0].id);

        if (updateError) {
          console.error('Error updating existing document status:', updateError);
          throw updateError;
        }
      }

      // Generate unique storage path
      const timestamp = new Date().getTime();
      const storagePath = `tenant_${employeeId}/${timestamp}_${fileName}`;

      // Upload new file
      const { error: uploadError, data: uploadData } = await supabase.storage
        .from('hr-documents')
        .upload(storagePath, selectedFile, {
          cacheControl: '3600',
          upsert: false // No need for upsert since we're using unique paths
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw uploadError;
      }

      // Create document record
      const documentRecord = {
        employee_id: employeeId,
        document_type: documentType,
        supabase_storage_path: storagePath,
        status: 'Active' as const,
        uploaded_at: new Date().toISOString(),
        tenant_id: tenantId
      };

      const { error: dbError } = await supabase
        .from('employee_documents')
        .insert(documentRecord);

      if (dbError) {
        console.error('Database insert error:', dbError);
        // If DB insert fails, try to clean up the uploaded file
        await supabase.storage
          .from('hr-documents')
          .remove([storagePath]);
        throw dbError;
      }

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      onUploadSuccess();
      onClose();
    } catch (error: any) {
      console.error('Detailed upload error:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      toast({
        title: "Error",
        description: error.message || "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload {documentType}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf"
              onChange={handleFileChange}
            />
            {selectedFile ? (
              <div className="flex-1 text-sm">
                <p className="font-medium">Selected file:</p>
                <p className="text-gray-500">{selectedFile.name}</p>
                <p className="text-gray-500">Will be saved as:</p>
                <p className="font-mono text-xs">{fileName}</p>
              </div>
            ) : (
              <div className="flex-1 text-sm text-gray-500">
                Select a PDF file (max 2MB)
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          {selectedFile ? (
            <Button
              onClick={handleUpload}
              disabled={isUploading}
              className="bg-theme-primary hover:bg-theme-primary/90"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Document
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleFileSelect}
              className="bg-theme-primary hover:bg-theme-primary/90"
            >
              <Upload className="w-4 h-4 mr-2" />
              Select File
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 