'use client'

import { useEditorContext } from '@/context/EditorContext';
import { useFileContext } from '@/context/FileContext';
import { Eraser, Pen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

export default function FloorPlanEditor() {
  const { tool, setTool } = useEditorContext(); 
  const { selectedProcessedFile, processedFiles, setSelectedProcessedFile } = useFileContext(); 
  const [image, setImage] = useState<any>(null);
  const [drawing, setDrawing] = useState(false); // Track if the user is currently drawing
  const canvasRef = useRef<any>(null);
  const lastPosition = useRef({ x: 0, y: 0 }); // Store the last position of the pointer

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth; // Set canvas width to parent's width
        canvas.height = parent.clientHeight; // Set canvas height to parent's height
      }
    }
  }, []); // Run once on mount


  useEffect(() => {
    if (selectedProcessedFile === null || !processedFiles || processedFiles.length == 0) return
    const img = new Image();
        img.src = URL.createObjectURL(processedFiles[selectedProcessedFile])
        img.onload = () => {
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          const scaleFactor = canvas.width / img.width;
        const newHeight = img.height * scaleFactor;

        // Set canvas height to the new height
        canvas.height = newHeight;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0, canvas.width, newHeight);
        setImage(img);
  }}, [selectedProcessedFile, processedFiles])


  // Start drawing (mouse down or touch start)
  const startDrawing = (e: any) => {
    setDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    // Get the mouse or touch position
    const position = getPosition(e);
    lastPosition.current = position;

    // Set the drawing style
    ctx.strokeStyle = tool === "draw" ? 'black': 'white'; // Line color
    ctx.lineWidth = 5; // Line width
    ctx.lineCap = 'round'; // Rounded line ends
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
  };

  // Stop drawing (mouse up or touch end)
  const stopDrawing = () => {
    setDrawing(false);
  };

  // Handle drawing while moving (mouse move or touch move)
  const handleDrawing = (e: any) => {
    if (!drawing) return; // Only draw if the user is holding down the mouse button or touching

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const position = getPosition(e);
    ctx.lineTo(position.x, position.y);
    ctx.stroke();
    lastPosition.current = position;
  };

  // Helper function to get mouse/touch position
  const getPosition = (e: any) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    return { x, y };
  };

  // Download the edited image
  // const downloadImage = () => {
  //   const canvas = canvasRef.current;
  //   const dataURL = canvas.toDataURL('image/png');
  //   const a = document.createElement('a');
  //   a.href = dataURL;
  //   a.download = 'edited-image.png';
  //   a.click();
  // };

  return (
    <div className='w-full h-full'>
      <div className='w-full flex gap-2 pb-5'>
      <Button size="icon" variant={tool === "draw" ? "default" : "outline"} onClick={() => setTool("draw")}>
                <Pen className="w-4 h-4" />
              </Button>

              <Button size="icon" variant={tool === "eraise" ? "default" : "outline"}  onClick={() => setTool("eraise")}>
                <Eraser className="w-4 h-4" />
              </Button>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={handleDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing} // Stop drawing when the mouse leaves the canvas
        onTouchStart={startDrawing}
        onTouchMove={handleDrawing}
        onTouchEnd={stopDrawing}
        style={{ border: '1px solid #000' }}
      />
    </div>
  );
}
