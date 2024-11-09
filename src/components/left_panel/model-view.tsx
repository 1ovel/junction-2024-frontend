import { Input } from "@/components/ui/input"
import { useModelContext } from "@/context/ModelContext"


export default function ModelView() {
  const { numberOfFloors, setNumberOfFloors, floorHeight, setFloorHeight } = useModelContext()

    return (
      <div className="space-y-4 w-full">
        <h2 className="text-lg font-semibold">3D Model View</h2>
        <div className="grid w-full items-center gap-1.5 flex flex-col">
          <div className="w-full">
          <label >Number of floors</label>
          <Input onChange={e => setFloorHeight(parseInt(e.target.value))} value={floorHeight} className="w-full flex-grow" min={0} type="number" id="number-of-floors" placeholder="Number of floors" />
          </div>
          <div className="w-full">
          <label >Floor height</label>
          <Input onChange={e => setNumberOfFloors(parseInt(e.target.value))} value={numberOfFloors} type="number" id="floor-height" placeholder="Floor height" />
          </div>
    </div>
      </div>
    )
  }