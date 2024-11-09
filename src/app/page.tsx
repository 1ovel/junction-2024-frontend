'use client'

import FloorPlanWizard from '@/components/floor-plan-wizard';
import FloorPlanEditor from '@/components/right_panel/floor-plan-editor';
import ModelViewer from '@/components/right_panel/model-viewer';
import { useFileContext } from '@/context/FileContext'; // Import the context
import { useWizardContext } from '@/context/WizardContext';

export default function Home() {
  const { selectedFile, uploadedFiles, processedFiles } = useFileContext();
  const { currentPage } = useWizardContext();


  return (
    <main className="flex min-h-screen bg-background text-foreground dark h-full max-h-screen">
      <div className="w-full md:w-1/2 p-4 md:p-8 overflow-y-auto border-r border-border flex flex-col">
        <FloorPlanWizard />
      </div>
      <div className="w-1/2 p-4 flex flex-col items-center justify-center h-full min-h-screen max-h-screen">
        {currentPage === 0 && selectedFile !== null && uploadedFiles && uploadedFiles[selectedFile] ? (
          <img 
            src={URL.createObjectURL(uploadedFiles[selectedFile])}
            alt="Selected File"
            className="max-w-full h-auto rounded-md"
          />
        ) : currentPage === 1 ? (
          <>
            <FloorPlanEditor />
          </>
        ) : currentPage === 2 ? (
          <>
            <ModelViewer />
          </>
        ): (
          <></>
        )}
      </div>
    </main>
  )
}