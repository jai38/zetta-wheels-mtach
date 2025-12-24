import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  type Car,
  type Alloy,
  type AlloySize,
  type AlloyDesign,
  type AlloyFinish,
} from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { ColorPicker } from "@/components/ColorPicker";
import AlloyDesignSelector from "@/components/AlloyDesignSelector";
import AlloyFinishSelector from "@/components/AlloyFinishSelector";
import CarCanvas, { CarCanvasRef } from "@/components/CarCanvas";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import { cn } from "@/lib/utils";
import SizePicker from "@/components/SizePicker";
import carBackground from "@/assets/car_background.png";
import { useCarData } from "@/hooks/useCarData";
import { useAlloySelection } from "@/hooks/useAlloySelection";
import logo from "@/assets/logo-black-text.png";

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const carCanvasRef = useRef<CarCanvasRef>(null);

  // Store actions
  const {
    setSelectedAlloySize,
    setSelectedAlloyDesign,
    setSelectedAlloyFinish,
  } = useCarStore();

  // Local UI State
  const [showImageViewerModal, setShowImageViewerModal] = useState(false);
  const [imageViewerUrl, setImageViewerUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);

  // Custom Hooks
  const { car, allAlloys, loading, error, fetchCarByColor } = useCarData(id);

  const minDiameter = car?.model?.defaultAlloySize || 0;

  const {
    uniqueDiameterSizes,
    availableDesigns,
    availableFinishes,
    currentAlloyDetails,
    selectedDiameter,
    selectedAlloyFinish,
    selectedAlloySize,
    wheelImage,
  } = useAlloySelection(allAlloys, minDiameter);

  // Effect to handle color changes
  useEffect(() => {
    if (selectedColor) {
      fetchCarByColor(selectedColor);
    }
  }, [selectedColor, fetchCarByColor]);

  // Derived Values
  const carImageUrl = car?.carImage || "";
  const carTitle = car?.model?.make
    ? `${car.model.make.name} ${car.model.name}`
    : "Car";

  // Handlers
  const handleSizeSelect = (sizeId: number) => {
    console.log("Size selected:", sizeId);
    setSelectedAlloySize(sizeId);
  };

  const handleDesignSelect = (designId: number) => {
    setSelectedAlloyDesign(designId);
  };

  const handleFinishSelect = (finishId: number) => {
    setSelectedAlloyFinish(finishId);
  };

  const handleDownloadImage = useCallback(async () => {
    const originalCanvas = carCanvasRef.current?.getCanvas();
    if (originalCanvas) {
      try {
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = originalCanvas.width;
        tempCanvas.height = originalCanvas.height;
        const ctx = tempCanvas.getContext("2d");

        if (!ctx) return;

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
        ctx.drawImage(originalCanvas, 0, 0);

        // Load and draw logo image
        const logoImg = new Image();
        logoImg.src = logo;
        await new Promise((resolve) => {
          logoImg.onload = resolve;
        });

        const padding = 40;
        const maxSize = Math.min(tempCanvas.width, tempCanvas.height) * 0.2; // Increased max size for visibility

        // Calculate aspect ratio
        const logoAspectRatio = logoImg.width / logoImg.height;
        let logoWidth = maxSize;
        let logoHeight = maxSize;

        if (logoAspectRatio > 1) {
          // Wider than tall
          logoHeight = maxSize / logoAspectRatio;
        } else {
          // Taller than wide
          logoWidth = maxSize * logoAspectRatio;
        }

        ctx.globalAlpha = 1.0; // Ensure full opacity
        ctx.drawImage(
          logoImg,
          tempCanvas.width - logoWidth - padding,
          padding * 0.1, // Reduced padding by 20% to move logo up
          logoWidth,
          logoHeight,
        );
        ctx.globalAlpha = 1.0;

        const image = tempCanvas.toDataURL("image/jpeg", 0.9);
        const link = document.createElement("a");
        link.href = image;
        link.download = `${carTitle
          .replace(/\s+/g, "-")
          .toLowerCase()}-custom.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({
          title: "Success",
          description: "Image downloaded successfully as JPG",
        });
      } catch (error) {
        console.error("Failed to download image:", error);
        toast({
          title: "Error",
          description: "Failed to download image. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [carTitle, toast]);

  const handleCanvasClick = () => {
    // Placeholder for future interactivity
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">
            {error || "Car not found"}
          </p>
          <Button onClick={() => navigate("/")}>Back to Catalog</Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full container mx-auto px-4 py-4">
        <CarHeader
          carTitle={carTitle}
          car={car}
          setSelectedColor={setSelectedColor}
        />
      </div>

      <div className="relative w-full overflow-hidden bg-muted/30">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${carBackground})` }}
        />

        <div className="relative z-10 w-full container mx-auto px-4 py-4">
          <CarDisplay
            car={car}
            carImageUrl={carImageUrl}
            isMobile={isMobile}
            handleCanvasClick={handleCanvasClick}
            carCanvasRef={carCanvasRef}
            wheelImage={wheelImage}
            handleDownloadImage={handleDownloadImage}
          />
        </div>
      </div>

      <AlloySelection
        carId={car.id}
        allAlloys={allAlloys}
        currentAlloyDetails={currentAlloyDetails}
        availableSizes={uniqueDiameterSizes}
        availableDesigns={availableDesigns}
        availableFinishes={availableFinishes}
        selectedSize={selectedDiameter}
        selectedFinish={selectedAlloyFinish}
        onSelectSize={handleSizeSelect}
        onSelectDesign={handleDesignSelect}
        onSelectFinish={handleFinishSelect}
        minDiameter={minDiameter}
      />

      <ImageViewerModal
        imageUrl={imageViewerUrl}
        open={showImageViewerModal}
        onClose={() => setShowImageViewerModal(false)}
      />
    </>
  );
};

export default CarDetail;

// Helper Components
const CarHeader = ({
  carTitle,
  car,
  setSelectedColor,
}: {
  carTitle: string;
  car: Car;
  setSelectedColor: (color: number) => void;
}) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center m-2 sm:m-4 gap-4">
    <h1 className="text-2xl sm:text-3xl font-bold">{carTitle}</h1>
    <div className="flex flex-col sm:flex-row gap-4">
      <ColorPicker car={car} onColorChange={setSelectedColor} />
    </div>
  </div>
);

const CarDisplay = ({
  car,
  carImageUrl,
  isMobile,
  handleCanvasClick,
  carCanvasRef,
  wheelImage,
  handleDownloadImage,
}: {
  car: Car;
  carImageUrl: string;
  isMobile: boolean;
  handleCanvasClick: () => void;
  carCanvasRef: React.RefObject<CarCanvasRef>;
  wheelImage: string;
  handleDownloadImage: () => void;
}) => {
  console.log("Rendering CarDisplay:", { carImageUrl, wheelImage });

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
        onClick={handleCanvasClick}>
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
          onClick={handleDownloadImage}
          disabled={!car}
          variant="outline"
          size="icon"
          className="absolute bottom-4 right-4"
          aria-label="Download Car Image">
          <DownloadIcon />
        </Button>
      </div>
    </div>
  );
};

const AlloySelection = ({
  carId,
  allAlloys,
  currentAlloyDetails,
  availableSizes,
  availableDesigns,
  availableFinishes,
  selectedSize,
  selectedFinish,
  onSelectSize,
  onSelectDesign,
  onSelectFinish,
  minDiameter,
}: {
  carId: number;
  allAlloys: Alloy[];
  currentAlloyDetails: Alloy | null;
  availableSizes: AlloySize[];
  availableDesigns: AlloyDesign[];
  availableFinishes: AlloyFinish[];
  selectedSize: number | null;
  selectedFinish: number | null;
  onSelectSize: (sizeId: number) => void;
  onSelectDesign: (designId: number) => void;
  onSelectFinish: (finishId: number) => void;
  minDiameter: number;
}) => (
  <div className="container mx-auto px-4 py-8">
    {currentAlloyDetails && (
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-8 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
          <div className="text-3xl font-semibold">
            {currentAlloyDetails.alloyName}
          </div>
          {currentAlloyDetails.buy_url && (
            <Button
              onClick={() => window.open(currentAlloyDetails.buy_url, "_blank")}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-6 py-2 h-10 shadow-sm">
              Buy Now
            </Button>
          )}
        </div>

        <div className="w-full lg:w-auto flex justify-end">
          <SizePicker
            sizes={availableSizes}
            selectedDiameter={selectedSize}
            onSelectSize={onSelectSize}
            minDiameter={minDiameter}
          />
        </div>
      </div>
    )}
    {!currentAlloyDetails && (
      <div className="flex justify-end w-full mb-8">
        <SizePicker
          sizes={availableSizes}
          selectedDiameter={selectedSize}
          onSelectSize={onSelectSize}
          minDiameter={minDiameter}
        />
      </div>
    )}
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-3">Alloy Design</h2>
      <AlloyDesignSelector
        carId={carId}
        allAlloys={allAlloys}
        designs={availableDesigns}
        onSelectDesign={onSelectDesign}
      />
    </div>
    <div>
      <h2 className="text-xl font-bold mb-3">Alloy Finish</h2>
      <AlloyFinishSelector
        finishes={availableFinishes}
        selectedFinish={selectedFinish}
        onSelectFinish={onSelectFinish}
        allAlloys={allAlloys}
      />
    </div>
  </div>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
