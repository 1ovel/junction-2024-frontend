'use client'

import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useFileContext } from "@/context/FileContext"
import { useWizardContext } from "@/context/WizardContext"
import { useState } from 'react'
import ImageUpload from "./left_panel/image-upload"
import ModelView from "./left_panel/model-view"
import SvgEdit from "./left_panel/svg-edit"
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { useModelContext } from "@/context/ModelContext"

const steps = ['Upload Floor Plan', 'Edit SVG', 'View 3D Model']

export default function FloorPlanWizard() {
  const { currentPage, setCurrentPage } = useWizardContext();
  const { uploadedFiles, setProcessedFiles } = useFileContext();
  const { finalSvgs, rasterizedImages, setServerReturned } = useFileContext();
  const [svgData, setSvgData] = useState<string | null>(null)
  const { object3d } = useModelContext();

  const submitRasterized = () => {
    const formData = new FormData();
    finalSvgs.current = new Array(rasterizedImages.current?.length).fill(null);
    let returned = 0;
    rasterizedImages.current.forEach((img, i) => {
      formData.append("image", new Blob([img], { type: "image/png" })); // Assuming you have a file input element

      fetch("http://localhost:5000/vectorize", {
        method: "POST",
        body: formData
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text(); // Assuming the response is an SVG file
        })
        .then(text => {
          // Create a link element to download the SVG file
          finalSvgs.current[i] = text
          console.log('current finalsvgs' + + finalSvgs.current);
          returned += 1
          if (returned == rasterizedImages.current.length) {
            console.log('setting srvret true');
            setServerReturned(true)
          }
        })
        .catch(error => {
          console.error('There was a problem with the fetch operation:', error);
        });
    });
  }

  const handleNext = () => {
    switch (currentPage) {
      case 0:
        // !!!! process the files and pass processed files instead !!!!
        setProcessedFiles(uploadedFiles)
        break;
      case 1:
        // pass the files for 3d processing
        submitRasterized()
        break;
      case 2:
        break;

    }

    setCurrentPage((prev) => Math.min(prev + 1, steps.length - 1))
  }

  const handleBack = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 0))
  }

  const saveTextToFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    URL.revokeObjectURL(link.href); // Clean up after download
  };

  // Usage
  const handleExport = () => {
    const obje = new OBJExporter();
    const parsedString: String = obje.parse(object3d!);
    saveTextToFile(parsedString, 'bimify.obj');
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
    <div className="w-full max-w-4xl mx-auto sticky top-0">
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
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${index <= currentPage ? 'text-white bg-blue-500' : 'border-2 border-blue-500 '
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
        <Button onClick={currentPage === steps.length - 1 ? handleExport : handleNext} disabled={(currentPage === 0 && !uploadedFiles) || (currentPage === 0 && !!uploadedFiles && uploadedFiles.length === 0)}>
          {currentPage === steps.length - 1 ? 'Export as OBJ' : 'Next'}
        </Button>
      </CardFooter>
    </div>
  )
}
