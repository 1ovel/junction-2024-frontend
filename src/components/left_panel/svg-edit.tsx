'use client'
import { useEditorContext } from '@/context/EditorContext';
import { useFileContext } from '@/context/FileContext';
import { Slider } from '../ui/slider';

export default function SvgEdit({ svgData, onSvgEdit }: { svgData: string | null, onSvgEdit: (svg: string) => void }) {
  const { processedFiles, setSelectedProcessedFile, selectedProcessedFile } = useFileContext();
  const { brushSize, setBrushSize } = useEditorContext();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Edit Processed Floor Plans</h2>

      <div className="w-full space-y-4">
          <div className="flex items-center justify-between">
            <label htmlFor="slider" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Brush size
            </label>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-md font-bold text-muted-foreground hover:border-border">
              {brushSize}
            </span>
          </div>
          <Slider
            id="slider"
            max={100}
            min={1}
            step={1}
            className="w-full"
            value={[brushSize]}
            onValueChange={value => setBrushSize(value[0])}
            aria-label="Slider"
          />
        </div>
      
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
