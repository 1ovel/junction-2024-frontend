'use client'

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useFileContext } from "@/context/FileContext"
import { useWizardContext } from "@/context/WizardContext"
import { useState } from 'react'
import ImageUpload from "./image-upload"
import ModelView from "./model-view"
import SvgEdit from "./svg-edit"

const steps = ['Upload Floor Plan', 'Edit SVG', 'View 3D Model']

export default function FloorPlanWizard() {
  const { currentPage, setCurrentPage } = useWizardContext();
  const { uploadedFiles, setProcessedFiles } = useFileContext();
  const [svgData, setSvgData] = useState<string | null>(null)

  const handleNext = () => {
    switch (currentPage) {
        case 0:
            // !!!! process the files and pass processed files instead !!!!
            setProcessedFiles(uploadedFiles)
            break;
        case 1:
            // pass the files for 3d processing
            break;
        case 2:
            break;

    }
    
    setCurrentPage((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  const renderStep = () => {
    switch (currentPage) {
      case 0:
        return <ImageUpload />
      case 1:
        return <SvgEdit svgData={svgData} onSvgEdit={setSvgData} />
      case 2:
        return <ModelView />
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto h-full">
      <CardHeader>
        <CardTitle>Floor Plan to 3D Model</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col justify-between">
        <div className="flex justify-between mb-8">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`flex items-center text-primary`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                index <=  currentPage ? 'text-white bg-blue-500' : 'border-2 border-blue-500 '
              }`}
              >
                {index < currentPage ? '✓' : index + 1}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>
        <div className="flex-1">
          {renderStep()}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between flex-grow">
        <Button onClick={handleBack} disabled={currentPage === 0}>
          Back
        </Button>
        <Button onClick={handleNext} disabled={currentPage === steps.length - 1 || (currentPage === 0 &&  !uploadedFiles) || (currentPage === 0 && !!uploadedFiles && uploadedFiles.length === 0) }>
          {currentPage === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </CardFooter>
    </div>
  )
}