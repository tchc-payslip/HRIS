interface CloudinaryResponse {
  secure_url: string;
  public_id: string;
  error?: {
    message: string;
  };
}

interface CloudinaryError {
  error: {
    message: string;
  };
}

export async function uploadImageToCloudinary(
  file: File,
  employeeId: string
): Promise<string> {
  console.log('Starting Cloudinary upload for employee:', employeeId);
  
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  formData.append('public_id', `employees/empPhoto_${employeeId}`); // Using empPhoto_ prefix for minimum length requirement

  try {
    console.log('Uploading to Cloudinary with preset:', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    const data: CloudinaryResponse | CloudinaryError = await response.json();
    console.log('Cloudinary response:', data);

    if (!response.ok || 'error' in data) {
      console.error('Cloudinary upload error:', data);
      throw new Error(
        'error' in data 
          ? data.error.message 
          : 'Failed to upload image to Cloudinary'
      );
    }

    if (!('secure_url' in data)) {
      throw new Error('Invalid response from Cloudinary');
    }

    console.log('Cloudinary upload successful:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    if (error instanceof Error) {
      throw new Error(`Cloudinary upload failed: ${error.message}`);
    }
    throw new Error('Unknown error occurred during upload');
  }
} 