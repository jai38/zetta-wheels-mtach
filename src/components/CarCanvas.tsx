import React, { useRef, useEffect, useImperativeHandle } from "react";

interface CarCanvasProps {
  carImage: string;
  wheelImage: string;
  x_front: number;
  y_front: number;
  x_rear: number;
  y_rear: number;
  wheelSize?: number;
}

export interface CarCanvasRef {
  getCanvas: () => HTMLCanvasElement | null;
}

const CarCanvas = React.forwardRef<CarCanvasRef, CarCanvasProps>(
  (
    {
      carImage,
      wheelImage,
      x_front,
      y_front,
      x_rear,
      y_rear,
      wheelSize = 300, // Default wheel size
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !carImage) {
        console.warn("CarCanvas: Missing canvas or carImage", { canvas: !!canvas, carImage });
        return;
      }

      const context = canvas.getContext("2d");
      if (!context) return;

      console.log("CarCanvas: Loading car image from:", carImage);

      const carImg = new Image();
      carImg.crossOrigin = "anonymous";
      
      carImg.onerror = (error) => {
        console.error("CarCanvas: Failed to load car image:", carImage, error);
      };
      
      carImg.onload = () => {
        console.log("CarCanvas: Car image loaded successfully", {
          width: carImg.width,
          height: carImg.height,
        });
        canvas.width = carImg.width;
        canvas.height = carImg.height;
        
        // Function to draw everything
        const drawCanvas = (wheelImg?: HTMLImageElement) => {
          // Clear canvas
          context.clearRect(0, 0, canvas.width, canvas.height);
          // Draw car image
          context.drawImage(carImg, 0, 0);
          
          // Draw wheels if wheel image is loaded
          if (wheelImg) {
            const frontX = x_front ?? carImg.width * 0.25;
            const frontY = y_front ?? carImg.height * 0.7;
            const rearX = x_rear ?? carImg.width * 0.75;
            const rearY = y_rear ?? carImg.height * 0.7;

            // Draw front wheel
            context.drawImage(
              wheelImg,
              frontX - wheelSize / 2,
              frontY - wheelSize / 2,
              wheelSize,
              wheelSize,
            );

            // Draw rear wheel
            context.drawImage(
              wheelImg,
              rearX - wheelSize / 2,
              rearY - wheelSize / 2,
              wheelSize,
              wheelSize,
            );
          }
        };
        
        // Draw car image first
        drawCanvas();

        // Load and draw wheel image if provided
        if (wheelImage) {
          const wheelImg = new Image();
          wheelImg.crossOrigin = "anonymous";
          
          wheelImg.onerror = (error) => {
            console.error("CarCanvas: Failed to load wheel image:", wheelImage, error);
          };
          
          wheelImg.onload = () => {
            console.log("CarCanvas: Wheel image loaded successfully");
            drawCanvas(wheelImg);
          };
          
          wheelImg.src = wheelImage;
        }
      };
      
      carImg.src = carImage;
    }, [carImage, wheelImage, x_front, y_front, x_rear, y_rear, wheelSize]);
    return <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />;
  },
);

CarCanvas.displayName = "CarCanvas"; // Good practice for forwardRef
export default CarCanvas;
