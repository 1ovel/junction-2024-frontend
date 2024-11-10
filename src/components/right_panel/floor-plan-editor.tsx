'use client'

import cv from "@techstark/opencv-js";
import { useEditorContext } from '@/context/EditorContext';
import { useFileContext } from '@/context/FileContext';
import { Eraser, Pen } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Button } from '../ui/button';

export default function FloorPlanEditor() {
        const { tool, setTool, brushSize } = useEditorContext();
        const divRef = useRef<HTMLDivElement>(null);
        const { selectedProcessedFile, processedFiles, setSelectedProcessedFile } = useFileContext();
        const [image, setImage] = useState<any>(null);
        const [drawing, setDrawing] = useState(false); // Track if the user is currently drawing
        const canvasRef = useRef<any>(null);
        const lastPosition = useRef({ x: 0, y: 0 }); // Store the last position of the pointer
        const images = useRef([null, null, null]);

        // Function to save the current canvas state as a data URL
        function saveCanvasState() {
                const canvas = canvasRef.current;
                const dataUrl = canvas.toDataURL();
                if (selectedProcessedFile !== null) {
                        images.current[selectedProcessedFile] = dataUrl; // Save the data URL to images array
                }
        }

        // Function to set the canvas with an image or a data URL
        function setCanvasFromData(dataUrl) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.src = dataUrl;
                img.onload = () => {
                        const scaleFactor = canvas.width / img.width;
                        const newHeight = divRef.current?.clientHeight;
                        
                        canvas.width = divRef.current?.clientWidth; // Set canvas width
                        canvas.height = divRef.current?.clientHeight; // Set canvas height based on scaling factor

                        // Draw the image on the canvas
                        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
                        ctx.drawImage(img, 0, 0, canvas.width, newHeight);
                };
        }

        useEffect(() => {
                if (selectedProcessedFile === null || !processedFiles || processedFiles.length === 0) return;

                if (images.current[selectedProcessedFile] != null) {
                        // Use saved canvas data URL if it exists
                        setCanvasFromData(images.current[selectedProcessedFile]);
                } else {
                        // Load image from file and save it
                        const img = new Image();
                        img.src = URL.createObjectURL(processedFiles[selectedProcessedFile]);
                        img.onload = () => {
                                // Save the initial canvas state to the array
                                const canvas = canvasRef.current;

                                // Load image into OpenCV Mat and adjust dimensions
                                const src = cv.imread(img);
                                const adjustedWidth = Math.floor(src.cols / 1.5);
                                const adjustedHeight = Math.floor(src.rows / 1.5);

                                // Create a destination Mat with a white background, resized to match adjusted dimensions
                                const dest = new cv.Mat(adjustedHeight, adjustedWidth, cv.CV_8UC3, new cv.Scalar(255, 255, 255));
                                cv.resize(src, dest, new cv.Size(adjustedWidth, adjustedHeight), 0, 0, cv.INTER_LINEAR);
                                src.delete();  // Free up memory for src since it's no longer needed

                                // Binarize the image for edge detection
                                const binaryImage = new cv.Mat();
                                cv.threshold(dest, binaryImage, 105, 255, cv.THRESH_BINARY);

                                // Detect edges using Canny
                                const edges = new cv.Mat();
                                cv.Canny(binaryImage, edges, 50, 150, 3);
                                binaryImage.delete();  // Free binaryImage after use

                                // Use Hough Transform to detect lines
                                const lines = new cv.Mat();
                                cv.HoughLinesP(edges, lines, 1, Math.PI / 180, 100, 90, 10);
                                edges.delete();  // Free edges after line detection

                                // Prepare an empty Mat for drawing lines
                                const lineImage = new cv.Mat(adjustedHeight, adjustedWidth, cv.CV_8UC3, new cv.Scalar(255, 255, 255));

                                // Draw detected lines on the empty Mat
                                for (let i = 0; i < lines.rows; ++i) {
                                        const [x1, y1, x2, y2] = [
                                                lines.data32S[i * 4],
                                                lines.data32S[i * 4 + 1],
                                                lines.data32S[i * 4 + 2],
                                                lines.data32S[i * 4 + 3],
                                        ];
                                        cv.line(lineImage, new cv.Point(x1, y1), new cv.Point(x2, y2), new cv.Scalar(0, 0, 0), 10);
                                }
                                lines.delete();  // Free lines after drawing

                                // Apply morphological closing to the line image
                                const size = 5;
                                const element = cv.getStructuringElement(cv.MORPH_ELLIPSE, new cv.Size(2 * size + 1, 2 * size + 1));
                                const closed = new cv.Mat();
                                cv.morphologyEx(lineImage, closed, cv.MORPH_CLOSE, element);
                                lineImage.delete();  // Free lineImage after closing
                                element.delete();  // Free structuring element

                                // Display the final image on the canvas and save it as a data URL
                                cv.imshow(canvas, closed);
                                images.current[selectedProcessedFile] = canvas.toDataURL();

                                // Free the remaining Mats
                                dest.delete();
                                closed.delete();
                        };
                }
        }, [selectedProcessedFile, processedFiles]);


        // Start drawing (mouse down or touch start)
        const startDrawing = (e: any) => {
                setDrawing(true);
                const canvas = canvasRef.current;
                const ctx = canvas.getContext('2d');

                // Get the mouse or touch position
                const position = getPosition(e);
                lastPosition.current = position;

                // Set the drawing style
                ctx.strokeStyle = tool === "draw" ? 'black' : 'white'; // Line color
                ctx.lineWidth = brushSize; // Line width
                ctx.lineCap = 'round'; // Rounded line ends
                ctx.beginPath();
                ctx.moveTo(position.x, position.y);
        };

        // Stop drawing (mouse up or touch end)
        const stopDrawing = () => {
                saveCanvasState()
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
                const rect = canvas?.getBoundingClientRect();
                if (!rect) return { x: 0, y: 0 };

                // Calculate the scaling factors based on the actual canvas size
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;

                // Adjust position based on the scaling factors
                const x = (e.clientX - rect.left) * scaleX;
                const y = (e.clientY - rect.top) * scaleY;

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
                <>
                        <div className='w-full flex gap-2 pb-5'>
                                <Button size="icon" variant={tool === "draw" ? "default" : "outline"} onClick={() => setTool("draw")}>
                                        <Pen className="w-4 h-4" />
                                </Button>

                                <Button size="icon" variant={tool === "eraise" ? "default" : "outline"} onClick={() => setTool("eraise")}>
                                        <Eraser className="w-4 h-4" />
                                </Button>
                        </div>
                        <div className='w-full flex-grow h-full' ref={divRef}>
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
                                className="w-full"
                        />
                        </div>
                        
                </>
        );
}
