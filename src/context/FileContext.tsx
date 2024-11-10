
'use client'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';

interface FileContextType {
  selectedFile: number | null;
  setSelectedFile: React.Dispatch<React.SetStateAction<number | null>>;
  uploadedFiles: File[] | null;
  setUploadedFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  processedFiles: File[] | null;
  setProcessedFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
  finalSvgs: React.MutableRefObject<(String | null)[]>;
  removeFile: (index: number) => void;
  selectedProcessedFile: number | null;
  serverReturned: boolean;
  setServerReturned: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedProcessedFile: React.Dispatch<React.SetStateAction<number | null>>;
  rasterizedImages: React.MutableRefObject<(String | null)[]>;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

export const FileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[] | null>(null);
  const [processedFiles, setProcessedFiles] = useState<File[] | null>(null);
  const [selectedProcessedFile, setSelectedProcessedFile] = useState<number | null>(0); 
  const [selectedFile, setSelectedFile] = useState<number | null>(null);
  const [serverReturned, setServerReturned] = useState<boolean>(false);
  const rasterizedImages = useRef<(String | null)[]>([]);
  const finalSvgs = useRef<(String | null)[]>([]);
  const [model, setModel] = useState<File | null>(null);

  useEffect(() => {
    if (uploadedFiles && uploadedFiles.length > 0) {
        setSelectedFile(uploadedFiles.length - 1)
    }
  }, [uploadedFiles])

  const removeFile = (index: number) => {
    setUploadedFiles(prevFiles => {
      const updatedFiles = prevFiles?.filter((_, i) => i !== index) || null;
      return updatedFiles;
    });
  }

  return (
    <FileContext.Provider value={{ uploadedFiles, setUploadedFiles, removeFile, selectedFile, setSelectedFile, processedFiles, setProcessedFiles, selectedProcessedFile, setSelectedProcessedFile, finalSvgs, rasterizedImages, serverReturned, setServerReturned}}>
      {children}
    </FileContext.Provider>
  );
};

export const useFileContext = () => {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within a FileProvider');
  }
  return context;
};
