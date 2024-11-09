import { useFileContext } from '@/context/FileContext';
import { useEffect, useState } from 'react';

export default function SvgEdit({ svgData, onSvgEdit }: { svgData: string | null, onSvgEdit: (svg: string) => void }) {
  const { processedFiles, setSelectedProcessedFile, selectedProcessedFile } = useFileContext();
  
  const [editedSvg, setEditedSvg] = useState(svgData)

  useEffect(() => {
    if (!svgData) {
      // Simulating server response with a placeholder SVG
      const placeholderSvg = `
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
          <rect width="200" height="200" fill="#f0f0f0" />
          <text x="100" y="100" font-family="Arial" font-size="16" text-anchor="middle">
            Floor Plan SVG
          </text>
        </svg>
      `
      setEditedSvg(placeholderSvg)
    }
  }, [svgData])

  const handleSvgChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditedSvg(event.target.value)
  }

  const handleSave = () => {
    if (editedSvg) {
      onSvgEdit(editedSvg)
      alert('SVG saved successfully!')
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Edit Processed Floor Plans</h2>
      {processedFiles && processedFiles.length > 0 && (
        <div className="flex flex-col space-y-2" >
            <h4 className="text-md">Floors</h4>
          {processedFiles.map((file, index) => (
            <div key={index} onClick={() => setSelectedProcessedFile(index)} className={`flex items-center justify-between p-2 bg-muted rounded-md cursor-pointer ${
                selectedProcessedFile === index ? 'ring-2 ring-blue-500' : 'border-none'
              }`}
            >
              <div className="flex items-center space-x-3 pl-2">
                <span className="text-2xl font-bold text-blue-500 font-medium">{index + 1}</span>
                <span className="text-sm font-medium">{file.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}