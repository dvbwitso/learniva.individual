"use client";

import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { UploadCloud, FileText, X, CheckCircle, FileType2Icon, FileJson2 } from 'lucide-react'; // Added FileType2Icon for general files, FileJson2 as an example for specific types
import { useDropzone } from 'react-dropzone';

interface UploadedFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'uploaded' | 'error';
  icon: React.ReactNode; // To store the icon component
}

interface UploadAssignmentModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onUploadComplete?: (files: File[]) => void; // Callback for when files are "submitted"
}

export function UploadAssignmentModal({ isOpen, onOpenChange, onUploadComplete }: UploadAssignmentModalProps) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => {
      let icon: React.ReactNode = <FileType2Icon className="w-6 h-6 text-muted-foreground" />; // Default icon
      if (file.type === 'application/pdf') {
        icon = <FileText className="w-6 h-6 text-red-500" />; // Example: PDF icon (using FileText, ideally a PDF specific one)
      } else if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        icon = <FileText className="w-6 h-6 text-blue-500" />; // Example: DOCX icon (using FileText, ideally a Word specific one)
      }
      // Add more else if blocks for other file types

      return {
        id: Math.random().toString(36).substring(7),
        file,
        progress: 0,
        status: 'uploading' as 'uploading' | 'uploaded' | 'error',
        icon,
      };
    });
    setUploadedFiles(prevFiles => [...prevFiles, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(newFile => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        if (progress <= 100) {
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === newFile.id ? { ...f, progress } : f
            )
          );
        } else {
          clearInterval(interval);
          setUploadedFiles(prev =>
            prev.map(f =>
              f.id === newFile.id ? { ...f, status: 'uploaded' } : f
            )
          );
        }
      }, 200);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/pdf': ['.pdf'],
    }
  });

  const removeFile = (fileId: string) => {
    setUploadedFiles(prevFiles => prevFiles.filter(f => f.id !== fileId));
  };

  const handleSubmit = () => {
    const filesToSubmit = uploadedFiles.filter(f => f.status === 'uploaded').map(f => f.file);
    if (onUploadComplete) {
      onUploadComplete(filesToSubmit);
    }
    setUploadedFiles([]); // Clear files after submit
    onOpenChange(false); // Close modal
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-card">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Upload Assignment</DialogTitle>
        </DialogHeader>
        <div className="py-4 px-1">
          <p className="text-sm text-muted-foreground mb-6">
            To submit your assignment, attach it down below and hit submit.
          </p>

          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/70'}
            transition-colors duration-200 ease-in-out`}
          >
            <input {...getInputProps()} />
            <UploadCloud className="w-12 h-12 text-muted-foreground mb-3" />
            <p className="text-base font-medium text-foreground">
              Drag & Drop or <span className="text-primary">Choose Files</span> to upload
            </p>
            <p className="text-xs text-muted-foreground mt-1">DOCX or PDF</p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="mt-6 space-y-3">
              {uploadedFiles.map(uploadedFile => (
                <div key={uploadedFile.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border relative overflow-hidden"> {/* Added relative and overflow-hidden for progress bar */}
                  <div className="flex items-center gap-3 min-w-0"> {/* Added min-w-0 for truncation */}
                    {uploadedFile.icon} {/* Use the dynamic icon */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate" title={uploadedFile.file.name}>
                        {uploadedFile.file.name}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{(uploadedFile.file.size / 1024).toFixed(1)}kb</span>
                        {uploadedFile.status === 'uploading' && uploadedFile.progress < 100 && (
                          <span>• {100 - uploadedFile.progress > 2 ? `${Math.round((100 - uploadedFile.progress) / 10) * 2} seconds left` : `few seconds left`}</span>
                        )}
                        {uploadedFile.status === 'uploaded' && <span>• Uploaded</span>}
                        {uploadedFile.status === 'error' && <span className="text-destructive">• Error</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {uploadedFile.status === 'uploading' && (
                       <div className="text-xs text-muted-foreground">{uploadedFile.progress}%</div>
                    )}
                    {uploadedFile.status === 'uploaded' && (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                    <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => removeFile(uploadedFile.id)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {uploadedFile.status === 'uploading' && uploadedFile.progress < 100 && (
                    <Progress value={uploadedFile.progress} className="absolute bottom-0 left-0 right-0 h-[3px] rounded-b-none" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button type="button" onClick={handleSubmit} disabled={uploadedFiles.every(f => f.status !== 'uploaded')}>
            Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// You might need to install react-dropzone: npm install react-dropzone or yarn add react-dropzone
// Also, ensure you have a Progress component, or install one like @radix-ui/react-progress and adapt it.
// Example for Progress component if you don't have one (simplified):
// src/components/ui/progress.tsx
/*
"use client"
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className="h-full w-full flex-1 bg-primary transition-all"
      style={{ transform: \`translateX(-\${100 - (value || 0)}%)\` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = ProgressPrimitive.Root.displayName
export { Progress }
*/

// Ensure Dialog components are correctly imported from @radix-ui/react-dialog or your shadcn/ui setup.
// e.g. import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
