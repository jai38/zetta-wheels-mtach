import React from "react";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import CarCanvas, { CarCanvasRef } from "@/components/CarCanvas";
import { DownloadIcon } from "@/components/icons/DownloadIcon";
import { cn } from "@/lib/utils";
import type { Car } from "@/lib/api";

interface CarDisplayProps {
  car: Car;
  carImageUrl: string;
  isMobile: boolean;
  handleCanvasClick: () => void;
  carCanvasRef: React.RefObject<CarCanvasRef>;
  wheelImage: string;
  handleDownloadImage: () => void;
}

export const CarDisplay: React.FC<CarDisplayProps> = ({
  car,
  carImageUrl,
  isMobile,
  handleCanvasClick,
  carCanvasRef,
  wheelImage,
  handleDownloadImage,
}) => {
  // console.log("Rendering CarDisplay:", { carImageUrl, wheelImage }); // Removed log for cleanliness

  if (!carImageUrl) {
    return (
      <div className="w-full relative flex items-center justify-center min-h-[400px] bg-muted rounded-lg">
        <p className="text-muted-foreground">No car image available</p>
      </div>
    );
  }

  return (
    <div className="w-full relative">
      <div
        className={cn("relative", isMobile && "cursor-pointer")}
        onClick={isMobile ? handleCanvasClick : undefined}
      >
        <CarCanvas
          ref={carCanvasRef}
          carImage={carImageUrl}
          wheelImage={wheelImage}
          x_front={car.x_front ?? 0}
          y_front={car.y_front ?? 0}
          x_rear={car.x_rear ?? 0}
          y_rear={car.y_rear ?? 0}
          wheelSize={car.wheelSize}
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleCanvasClick();
          }}
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-12 h-8 w-8 sm:h-10 sm:w-10 sm:bottom-4 sm:right-16 bg-transparent hover:bg-transparent hover:text-primary"
          aria-label="Zoom Image"
        >
          <Maximize2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadImage();
          }}
          disabled={!car}
          variant="ghost"
          size="icon"
          className="absolute bottom-1 right-2 h-8 w-8 sm:h-10 sm:w-10 sm:bottom-4 sm:right-4 bg-transparent hover:bg-transparent hover:text-primary"
          aria-label="Download Car Image"
        >
          <DownloadIcon />
        </Button>
      </div>
    </div>
  );
};
