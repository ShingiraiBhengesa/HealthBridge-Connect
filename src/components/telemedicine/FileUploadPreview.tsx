
import React from 'react';
import { X, FileText, Image, Film, FileSpreadsheet, FileCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { getFileIcon } from '@/utils/fileUploadUtils';

interface FilePreview {
  id: string;
  name: string;
  type: string;
  size: number;
  preview?: string;
}

interface FileUploadPreviewProps {
  files: FilePreview[];
  onRemove: (id: string) => void;
  className?: string;
}

export const FileUploadPreview = ({ files, onRemove, className }: FileUploadPreviewProps) => {
  const getFileIconComponent = (fileType: string, fileName: string) => {
    const iconType = getFileIcon(fileName);
    
    switch (iconType) {
      case 'image':
        return <Image className="h-4 w-4" />;
      case 'video':
        return <Film className="h-4 w-4" />;
      case 'pdf':
      case 'document':
        return <FileText className="h-4 w-4" />;
      case 'spreadsheet':
        return <FileSpreadsheet className="h-4 w-4" />;
      default:
        return <FileCode className="h-4 w-4" />;
    }
  };
  
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };
  
  if (files.length === 0) return null;
  
  return (
    <div className={cn("space-y-2", className)}>
      {files.map((file) => (
        <div 
          key={file.id} 
          className="bg-muted/50 border rounded-md p-2 flex items-center gap-2"
        >
          {file.preview && file.type.startsWith('image/') ? (
            <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
              <img src={file.preview} alt={file.name} className="h-full w-full object-cover" />
            </div>
          ) : (
            <div className="h-10 w-10 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
              {getFileIconComponent(file.type, file.name)}
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-7 rounded-full"
            onClick={() => onRemove(file.id)}
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      ))}
    </div>
  );
};
