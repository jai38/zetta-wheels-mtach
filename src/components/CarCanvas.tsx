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
      wheelSize = 300,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useImperativeHandle(ref, () => ({
      getCanvas: () => canvasRef.current,
    }));

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas || !carImage) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      let isMounted = true;

      const loadImage = (url: string): Promise<HTMLImageElement> => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = (e) => reject(e);
          img.src = url;
        });
      };

      const render = async () => {
        try {
          const carImg = await loadImage(carImage);
          if (!isMounted) return;

          canvas.width = carImg.width;
          canvas.height = carImg.height;

          // Clear and draw car
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.drawImage(carImg, 0, 0);

          if (wheelImage) {
            const wheelImg = await loadImage(wheelImage);
            if (!isMounted) return;

            // Redraw car to ensure clean state
            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(carImg, 0, 0);

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
        } catch (error) {
          console.error("CarCanvas: Error loading images:", error);
        }
      };

      render();

      return () => {
        isMounted = false;
      };
    }, [carImage, wheelImage, x_front, y_front, x_rear, y_rear, wheelSize]);

    return <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />;
  },
);

CarCanvas.displayName = "CarCanvas";
export default CarCanvas;