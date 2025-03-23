
import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUploadPreview } from './FileUploadPreview';
import { toast } from '@/hooks/use-toast';
import { UploadCloud, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { fileToBase64, validateFile, generateThumbnail } from '@/utils/fileUploadUtils';

interface FileData {
  id: string;
  file: File;
  preview?: string;
  base64?: string;
}

interface FileUploadDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: { id: string; name: string; type: string; base64: string }[]) => void;
  maxFiles?: number;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

export const FileUploadDialog = ({ 
  isOpen, 
  onClose, 
  onUpload,
  maxFiles = 5,
  allowedTypes = ['image', 'application', 'text'],
  maxSizeMB = 5
}: FileUploadDialogProps) => {
  const [files, setFiles] = useState<FileData[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    
    // Check if adding new files would exceed the limit
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "File limit exceeded",
        description: `You can only upload a maximum of ${maxFiles} files at once.`,
        variant: "destructive"
      });
      return;
    }
    
    const newFiles: FileData[] = [];
    
    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i];
      
      // Validate file size and type
      const validationError = validateFile(file, allowedTypes, maxSizeMB);
      if (validationError) {
        toast({
          title: "Invalid file",
          description: `${file.name}: ${validationError}`,
          variant: "destructive"
        });
        continue;
      }
      
      let preview = '';
      if (file.type.startsWith('image/')) {
        preview = await generateThumbnail(file);
      }
      
      newFiles.push({
        id: `file-${Date.now()}-${i}`,
        file,
        preview
      });
    }
    
    setFiles([...files, ...newFiles]);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = e.dataTransfer.files;
    handleFileChange(droppedFiles);
  };
  
  const removeFile = (id: string) => {
    setFiles(files.filter(file => file.id !== id));
  };
  
  const clearFiles = () => {
    setFiles([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const handleUpload = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Process all files to base64
      const processedFiles = await Promise.all(
        files.map(async (fileData) => {
          const base64 = await fileToBase64(fileData.file);
          return {
            id: fileData.id,
            name: fileData.file.name,
            type: fileData.file.type,
            base64
          };
        })
      );
      
      onUpload(processedFiles);
      
      // Reset the state
      clearFiles();
      onClose();
      
      toast({
        title: "Files uploaded successfully",
        description: `${files.length} ${files.length === 1 ? 'file' : 'files'} uploaded.`
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div 
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
              isDragging ? "border-health-primary bg-health-primary/5" : "border-muted-foreground/20 hover:border-muted-foreground/30",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud className="h-10 w-10 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium mb-1">
              Drag and drop files here, or click to browse
            </p>
            <p className="text-xs text-muted-foreground mb-2">
              Max {maxFiles} files, up to {maxSizeMB}MB each
            </p>
            <Input 
              ref={fileInputRef}
              type="file" 
              className="hidden"
              multiple
              onChange={(e) => handleFileChange(e.target.files)}
              accept={allowedTypes.map(type => `.${type}`).join(',')}
            />
          </div>
          
          {files.length > 0 && (
            <>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">
                  {files.length} {files.length === 1 ? 'file' : 'files'} selected
                </p>
                <Button variant="ghost" size="sm" onClick={clearFiles}>
                  <X className="h-3 w-3 mr-1" />
                  Clear all
                </Button>
              </div>
              
              <FileUploadPreview 
                files={files.map(f => ({
                  id: f.id,
                  name: f.file.name,
                  type: f.file.type,
                  size: f.file.size,
                  preview: f.preview
                }))}
                onRemove={removeFile}
              />
            </>
          )}
        </div>
        
        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleUpload} disabled={files.length === 0 || isUploading}>
            {isUploading && (
              <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-r-transparent"></span>
            )}
            Upload {files.length > 0 && `(${files.length})`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
