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
  wheelSize?: number;
}

export const CarDisplay: React.FC<CarDisplayProps> = ({
  car,
  carImageUrl,
  isMobile,
  handleCanvasClick,
  carCanvasRef,
  wheelImage,
  handleDownloadImage,
  wheelSize,
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
          wheelSize={wheelSize || car.wheelSize}
        />
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDownloadImage();
          }}
          disabled={!car}
          variant="default"
          size="icon"
          className="absolute bottom-2 right-2 h-12 w-12 sm:h-14 sm:w-14 sm:bottom-4 sm:right-4 bg-[#1d1d1f] text-white hover:bg-[#333336] shadow-lg rounded-full z-10"
          aria-label="Download Car Image"
        >
          <DownloadIcon className="w-6 h-6 sm:w-7 sm:h-7" />
        </Button>
      </div>
    </div>
  );
};
