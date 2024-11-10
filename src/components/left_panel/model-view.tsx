
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
          <div className="flex items-center justify-between">
            <label htmlFor="slider" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              Floor height
            </label>
            <span className="w-12 rounded-md border border-transparent px-2 py-0.5 text-right text-md font-bold text-muted-foreground hover:border-border">
              {floorHeight}
            </span>
          </div>
          {floorGroups.map((group, index) => (
            <div key={index} className="flex space-between space-x-3">
              <span className="text-2xl font-bold text-blue-500 font-medium">Floor {index + 1}</span>
              <button className="font-bold font-medium text-xl border" onClick={() => { floorGroups[index].visible = !floorGroups[index].visible; setFloorGroups(floorGroups) }}>
                {floorGroups[index].visible ? '✓' : ' '}
              </button>
            </div>
          ))}
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
