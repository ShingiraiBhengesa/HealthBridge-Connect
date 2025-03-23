/**
 * Returns the appropriate icon type based on file name and MIME type
 */
export const getFileIcon = (fileName: string): 'image' | 'video' | 'document' | 'pdf' | 'spreadsheet' | 'other' => {
  const extension = fileName.split('.').pop()?.toLowerCase() || '';
  
  // Image files
  if (/\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i.test(fileName)) {
    return 'image';
  }
  
  // Video files
  if (/\.(mp4|webm|mov|avi|wmv|flv|mkv)$/i.test(fileName)) {
    return 'video';
  }
  
  // PDF files
  if (extension === 'pdf') {
    return 'pdf';
  }
  
  // Document files
  if (/\.(doc|docx|txt|rtf|odt|pages|md)$/i.test(fileName)) {
    return 'document';
  }
  
  // Spreadsheet files
  if (/\.(xls|xlsx|csv|ods|numbers)$/i.test(fileName)) {
    return 'spreadsheet';
  }
  
  // Default to other
  return 'other';
};

/**
 * Validates files for upload
 */
export const validateFiles = (files: File[], maxSizeInMB = 10): {valid: boolean; message?: string} => {
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  
  // Check file size
  for (const file of files) {
    if (file.size > maxSizeInBytes) {
      return {
        valid: false,
        message: `File "${file.name}" exceeds the maximum file size of ${maxSizeInMB}MB.`
      };
    }
  }
  
  // All checks passed
  return { valid: true };
};

/**
 * Validate a single file for upload
 */
export const validateFile = (file: File, allowedTypes: string[] = ['image', 'application', 'text'], maxSizeMB = 10): string | null => {
  const maxSizeInBytes = maxSizeMB * 1024 * 1024;
  
  // Check file size
  if (file.size > maxSizeInBytes) {
    return `File exceeds the maximum size of ${maxSizeMB}MB.`;
  }
  
  // Check file type
  const fileType = file.type.split('/')[0];
  if (!allowedTypes.includes(fileType) && !allowedTypes.includes(file.type)) {
    return `File type ${fileType} is not allowed.`;
  }
  
  return null;
};

/**
 * Create object URL for preview
 */
export const createFilePreview = (file: File): string | undefined => {
  if (file.type.startsWith('image/')) {
    return URL.createObjectURL(file);
  }
  return undefined;
};

/**
 * Revoke object URL to prevent memory leaks
 */
export const revokeFilePreview = (preview: string) => {
  URL.revokeObjectURL(preview);
};

/**
 * Convert a file to base64 encoding
 */
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

/**
 * Generate a thumbnail for a file
 */
export const generateThumbnail = (file: File, maxWidth = 200, maxHeight = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      resolve(''); // Return empty string for non-image files
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Calculate dimensions while maintaining aspect ratio
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * (maxWidth / width));
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * (maxHeight / height));
            height = maxHeight;
          }
        }
        
        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get data URL
        const thumbnail = canvas.toDataURL(file.type);
        resolve(thumbnail);
      };
      
      img.onerror = () => {
        reject(new Error('Failed to load image'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsDataURL(file);
  });
};
