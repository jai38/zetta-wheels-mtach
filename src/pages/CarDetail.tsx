import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCarStore } from "@/stores/useCarStore";
import { CarCanvasRef } from "@/components/CarCanvas";
import { useToast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";
import { ImageViewerModal } from "@/components/ImageViewerModal";
import carBackground from "@/assets/car_background.png";
import { useCarData } from "@/hooks/useCarData";
import { useAlloySelection } from "@/hooks/useAlloySelection";
import { CarHeader } from "@/components/car-detail/CarHeader";
import { CarDisplay } from "@/components/car-detail/CarDisplay";
import { AlloySelection } from "@/components/car-detail/AlloySelection";
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

  // Custom Hooks
  const { car, allAlloys, loading, error } = useCarData(id);

  const minDiameter = car?.model?.defaultAlloySize || 0;

  const {
    uniqueDiameterSizes,
    availableDesigns,
    availableFinishes,
    currentAlloyDetails,
    selectedDiameter,
    selectedAlloyFinish,
    wheelImage,
  } = useAlloySelection(allAlloys, minDiameter);

  // Derived Values
  const carImageUrl = car?.carImage || "";
  const carTitle = car?.model?.make
    ? `${car.model.make.name} ${car.model.name}`
    : "Car";

  // Calculate adjusted wheel size: +3% for every inch above minimum diameter
  const baseWheelSize = car?.wheelSize || 300;
  const sizeDiff =
    selectedDiameter && minDiameter ? selectedDiameter - minDiameter : 0;
  const adjustedWheelSize = baseWheelSize * (1 + Math.max(0, sizeDiff) * 0.03);
  console.log(
    "Adjusted wheel size:",
    adjustedWheelSize,
    selectedDiameter,
    minDiameter,
    car?.wheelSize,
  );
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

  const handleCanvasClick = useCallback(async () => {
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
        const maxSize = Math.min(tempCanvas.width, tempCanvas.height) * 0.2;

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

        ctx.globalAlpha = 1.0;
        ctx.drawImage(
          logoImg,
          tempCanvas.width - logoWidth - padding,
          padding * 0.1,
          logoWidth,
          logoHeight,
        );
        ctx.globalAlpha = 1.0;

        const dataUrl = tempCanvas.toDataURL("image/jpeg", 0.9);
        setImageViewerUrl(dataUrl);
        setShowImageViewerModal(true);
      } catch (error) {
        console.error("Failed to generate image for viewer:", error);
      }
    }
  }, []);

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
      <div className="relative w-full overflow-hidden bg-muted/30">
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${carBackground})` }}
        />

        <div className="relative z-10 w-full container mx-auto px-4 py-4">
          <CarHeader carTitle={carTitle} />
          <CarDisplay
            car={car}
            carImageUrl={carImageUrl}
            isMobile={isMobile}
            handleCanvasClick={handleCanvasClick}
            carCanvasRef={carCanvasRef}
            wheelImage={wheelImage}
            handleDownloadImage={handleDownloadImage}
            wheelSize={adjustedWheelSize}
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
