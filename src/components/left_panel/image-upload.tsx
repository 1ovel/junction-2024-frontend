'use client'

import { Card } from "@/components/ui/card"
import { useFileContext } from "@/context/FileContext"
import { Trash, Upload } from 'lucide-react'
import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from "../ui/button"

export default function ImageUpload() {
  const { setUploadedFiles, uploadedFiles, removeFile, selectedFile, setSelectedFile } = useFileContext();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setUploadedFiles(prevFiles => [...(prevFiles || []), ...acceptedFiles]);
    }
  }, [setUploadedFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
    },
    multiple: true,
  })

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Upload Floor Plan Images</h2>
      <Card
        {...getRootProps()}
        className={`p-8 border-dashed cursor-pointer ${
          isDragActive ? 'border-primary' : 'border-muted'
        }`}
      >
        <input {...getInputProps()} id="file-upload" />
        <div className="flex flex-col items-center justify-center text-center">
          <Upload className="w-12 h-12 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">Drag & drop your PNG files here</p>
          <p className="text-sm text-muted-foreground">or click to select files</p>
        </div>
      </Card>
      {uploadedFiles && uploadedFiles.length > 0 && (
        <div className="flex flex-col space-y-2" >
            <h3 className="text-lg font-semibold">Floors</h3>
          {uploadedFiles.map((file, index) => (
            <div key={index} onClick={() => setSelectedFile(index)} className={`flex items-center justify-between p-2 bg-muted rounded-md cursor-pointer ${
                selectedFile === index ? 'ring-2 ring-blue-500' : 'border-none'
              }`}
            >
              <div className="flex items-center space-x-3 pl-2">
                <span className="text-2xl font-bold text-blue-500 font-medium">{index + 1}</span>
                <span className="text-sm font-medium">{file.name}</span>
              </div>
              <Button size="icon" variant="destructive" onClick={() => removeFile(index)}>
                <Trash className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}