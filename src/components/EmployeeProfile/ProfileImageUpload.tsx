
import React, { useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from '@/hooks/use-toast';
import { validateImage } from '@/utils/imageUtils';
import { Upload } from "lucide-react";

interface ProfileImageUploadProps {
  image: string;
  initials: string;
  onUpload: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const ProfileImageUpload = ({ image, initials, onUpload, isLoading = false }: ProfileImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [previewSrc, setPreviewSrc] = useState<string | null>(null);
  
  const handleClick = () => {
    inputRef.current?.click();
  };
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const error = validateImage(file);
    if (error) {
      toast({
        title: "Upload error",
        description: error,
        variant: "destructive",
      });
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setPreviewSrc(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
    
    try {
      await onUpload(file);
      toast({
        title: "Upload successful",
        description: "Your profile image has been updated.",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message || "Could not upload image. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <Avatar className="w-32 h-32">
        <AvatarImage 
          src={previewSrc || image} 
          alt="Profile" 
          className="object-cover"
        />
        <AvatarFallback className="text-3xl">{initials}</AvatarFallback>
      </Avatar>
      
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/jpeg,image/png"
      />
      
      <Button
        variant="outline"
        className="mt-4"
        onClick={handleClick}
        disabled={isLoading}
        size="sm"
      >
        <Upload className="mr-2 h-4 w-4" />
        {isLoading ? "Uploading..." : "Change Photo"}
      </Button>
      
      <p className="text-xs text-muted-foreground mt-2">
        Max 1MB, JPEG or PNG
      </p>
    </div>
  );
};

export default ProfileImageUpload;
