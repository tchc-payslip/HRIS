import React, { useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { uploadImageToCloudinary } from '@/services/cloudinaryService';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Upload, Loader2 } from 'lucide-react';

interface EmployeeImageDialogProps {
  isOpen: boolean;
  onClose: () => void;
  employeeId: string;
  currentImageUrl: string | null;
  onImageUpdate: (newUrl: string) => void;
}

export function EmployeeImageDialog({
  isOpen,
  onClose,
  employeeId,
  currentImageUrl,
  onImageUpdate,
}: EmployeeImageDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [renamedFileName, setRenamedFileName] = useState<string>('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getFileExtension = (filename: string) => {
    return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, PNG, or WEBP images",
        variant: "destructive",
      });
      return;
    }

    // Create renamed file name with empPhoto_ prefix
    const extension = getFileExtension(file.name).toLowerCase();
    const newFileName = `empPhoto_${employeeId}.${extension}`;
    setRenamedFileName(newFileName);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSelectedFile(file);

    // Clean up old preview URL
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleConfirmUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      // Upload to Cloudinary
      const imageUrl = await uploadImageToCloudinary(selectedFile, employeeId);
      console.log('Cloudinary upload successful:', imageUrl);

      // Update Supabase
      const { error } = await supabase
        .from('employee_information')
        .update({ photo_url: imageUrl })
        .eq('employee_id', parseInt(employeeId, 10));

      if (error) {
        console.error('Supabase update error:', error);
        throw error;
      }

      // Update UI
      onImageUpdate(imageUrl);
      toast({
        title: "Success",
        description: "Profile photo updated successfully",
      });
      
      // Reset states
      setSelectedFile(null);
      setPreviewUrl(null);
      setRenamedFileName('');
      onClose();
    } catch (error) {
      console.error('Error in upload process:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile photo",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Employee Photo</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col items-center gap-4">
          <div className="flex justify-center p-4">
            {(previewUrl || currentImageUrl) ? (
              <img
                src={previewUrl || currentImageUrl}
                alt="Employee"
                className="max-h-[60vh] w-auto object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="flex h-48 w-48 items-center justify-center bg-gray-100 rounded-full">
                <span className="text-gray-400">No photo available</span>
              </div>
            )}
          </div>

          {renamedFileName && (
            <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
              File will be uploaded as: <span className="font-mono">{renamedFileName}</span>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              Cancel
            </Button>
            {selectedFile ? (
              <Button 
                onClick={handleConfirmUpload}
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
                    Confirm Upload
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleUploadClick}
                disabled={isUploading}
                className="bg-theme-primary hover:bg-theme-primary/90"
              >
                <Upload className="w-4 h-4 mr-2" />
                Select Image
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 