'use client'

import { Slider } from "@/components/ui/slider"
import { useModelContext } from "@/context/ModelContext"


export default function ModelView() {
  const { floorHeight, setFloorHeight, floorGroups, setFloorGroups } = useModelContext()

  return (
    <div className="space-y-4 w-full">
      <h2 className="text-lg font-semibold">3D Model View</h2>
      <div className="grid w-full items-center gap-1.5 flex flex-col">

        <div className="w-full space-y-4">
          <div className="flex flex-col space-y-2" >
            <h4 className="text-md">Floors</h4>
            {floorGroups.map((group, index) => (
              <div key={index} onClick={() => { floorGroups[index].visible = !floorGroups[index].visible; setFloorGroups(floorGroups) }} className={`flex items-center justify-between p-2 bg-muted rounded-md cursor-pointer ${floorGroups[index].visible ? 'ring-2 ring-blue-500' : 'border-none'}`}
              >
                {floorGroups[index].visible ? 'Hide' : 'Show'}1
                <div className="flex items-center space-x-3 pl-2">
                  <span className="text-2xl font-bold text-blue-500 font-medium">{index + 1}</span>
                </div>
              </div>
            ))}
          </div>
          <Slider
            id="slider"
            max={100}
            min={1}
            step={1}
            className="w-full"
            value={[floorHeight]}
            onValueChange={value => setFloorHeight(value[0])}
            aria-label="Slider"
          />
        </div>
      </div>
    </div>
  )
}
