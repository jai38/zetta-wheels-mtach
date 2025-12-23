import { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  carService,
  alloyService,
  type Car,
  type Alloy,
  type AlloySize,
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

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    setSelectedAlloy,
    selectedAlloyDesign,
    selectedAlloyFinish,
    setCurrentCarId,
    selectedAlloySize,
    setSelectedAlloyDesign,
    setSelectedAlloySize,
    setSelectedAlloyFinish,
    resetSelections,
  } = useCarStore();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const carCanvasRef = useRef<CarCanvasRef>(null);

  const [showImageViewerModal, setShowImageViewerModal] = useState(false);
  const [imageViewerUrl, setImageViewerUrl] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState<number | null>(null);
  const [car, setCar] = useState<Car | null>(null);
  const [allAlloys, setAllAlloys] = useState<Alloy[]>([]);
  const [currentAlloyDetails, setCurrentAlloyDetails] = useState<Alloy | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- DATA FETCHING ---

  useEffect(() => {
    resetSelections();

    const fetchCarAndAlloys = async () => {
      // Explicitly reset local state to ensure clean slate
      setCar(null);
      setAllAlloys([]);
      
      if (!id) {
        setLoading(false);
        setError("No car ID provided.");
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const carId = parseInt(id, 10);
        if (isNaN(carId)) {
          setError("Invalid car ID format.");
          setLoading(false);
          return;
        }

        console.log("Fetching details for car ID:", carId);
        let carData = await carService.getCarById(carId);
        console.log("Fetched car data:", carData);

        // If the current car is not default, try to find the default one for this model
        if (!carData.isDefault) {
          const defaultCarsResult = await carService.getCars({
            modelId: carData.modelId,
            isDefault: true,
            limit: 1,
            isActive: true,
          });

          if (
            defaultCarsResult.cars.length > 0 &&
            defaultCarsResult.cars[0].id !== carData.id
          ) {
            const defaultCar = defaultCarsResult.cars[0];
            // We should ideally navigate to the default car's ID to keep URL in sync
            // but the requirement says "always render the default car color".
            // If we just set state, URL stays on non-default but we show default.
            // Navigating is cleaner.
            navigate(`/cars/${defaultCar.id}`, { replace: true });
            return; // Effect will re-run with new ID
          }
        }

        setCurrentCarId(carData.id);
        setCar(carData);

        const alloysData = await alloyService.getAlloys({
          carId: carData.id,
          isActive: true,
        });
        console.log("Fetched alloys count:", alloysData.alloys.length);
        setAllAlloys(alloysData.alloys);
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarAndAlloys();
  }, [id, setCurrentCarId, navigate, resetSelections]);

  useEffect(() => {
    const fetchCarByColor = async () => {
      if (!selectedColor || !car?.modelId) return;

      try {
        const carsData = await carService.getCars({
          modelId: car.modelId,
          colorId: selectedColor,
          limit: 1,
          isActive: true,
        });

        if (carsData.cars.length > 0) {
          const newCar = carsData.cars[0];
          setCar(newCar);
          setCurrentCarId(newCar.id);
          setSelectedAlloyDesign(null);
        }
      } catch (err) {
        console.error("Failed to fetch car by color:", err);
      }
    };

    fetchCarByColor();
  }, [selectedColor, car?.modelId, setCurrentCarId, setSelectedAlloyDesign]);

  // --- ALLOY FILTERING LOGIC ---

  const getAvailable = <T extends AlloySize | AlloyDesign | AlloyFinish>(
    alloys: Alloy[],
    filterKey: "size" | "design" | "finish",
    idKey: "sizeId" | "designId" | "finishId",
    dependencies: Record<string, number | null> = {},
  ): T[] => {
    const itemMap = new Map<number, T>();

    alloys
      .filter((alloy) => {
        // Check all dependencies
        return Object.entries(dependencies).every(([key, value]) => {
          if (!value) return true; // Optional dependency
          return (alloy as any)[key] === value;
        });
      })
      .forEach((alloy) => {
        const item = (alloy as any)[filterKey];
        const id = (alloy as any)[idKey];
        if (item && id) {
          itemMap.set(id, item as T);
        }
      });

    const items = Array.from(itemMap.values());
    if (filterKey === "size") {
      (items as AlloySize[]).sort((a, b) => a.diameter - b.diameter);
    }
    return items;
  };

  const availableSizes = useMemo(
    () => getAvailable<AlloySize>(allAlloys, "size", "sizeId"),
    [allAlloys],
  );

  const uniqueDiameterSizes = useMemo(() => {
    const unique = new Map<number, AlloySize>();
    availableSizes.forEach((size) => {
      if (!unique.has(size.diameter)) {
        unique.set(size.diameter, size);
      }
    });
    return Array.from(unique.values()).sort((a, b) => a.diameter - b.diameter);
  }, [availableSizes]);

  const selectedDiameter = useMemo(() => {
    if (!selectedAlloySize) return null;
    const alloy = allAlloys.find((a) => a.sizeId === selectedAlloySize);
    return alloy?.size?.diameter ?? null;
  }, [selectedAlloySize, allAlloys]);

  const availableDesigns = useMemo(() => {
    const filteredAlloys = selectedDiameter
      ? allAlloys.filter((a) => a.size?.diameter === selectedDiameter)
      : allAlloys;

    return getAvailable<AlloyDesign>(filteredAlloys, "design", "designId", {});
  }, [allAlloys, selectedDiameter]);

  const availableFinishes = useMemo(() => {
    let filteredAlloys = allAlloys;
    if (selectedDiameter) {
      filteredAlloys = filteredAlloys.filter(
        (a) => a.size?.diameter === selectedDiameter,
      );
    }

    return getAvailable<AlloyFinish>(filteredAlloys, "finish", "finishId", {
      designId: selectedAlloyDesign,
    });
  }, [allAlloys, selectedDiameter, selectedAlloyDesign]);

  const wheelImage = useMemo(() => {
    // 1. Try to use the image from the specifically selected alloy (Design + Finish + Size)
    if (currentAlloyDetails?.image_url) {
      return currentAlloyDetails.image_url;
    }

    // 2. Fallback: If the selected specific alloy has no image, try to find ANY alloy
    // with the same Design and Finish that DOES have an image.
    // This handles cases where a new size variant was created but no image uploaded yet.
    if (selectedAlloyDesign && selectedAlloyFinish) {
      const fallbackAlloy = allAlloys.find(
        (alloy) =>
          alloy.designId === selectedAlloyDesign &&
          alloy.finishId === selectedAlloyFinish &&
          alloy.image_url,
      );
      if (fallbackAlloy?.image_url) {
        console.log(
          "Using fallback alloy image from size:",
          fallbackAlloy.size?.diameter,
        );
        return fallbackAlloy.image_url;
      }
    }

    return "";
  }, [
    currentAlloyDetails,
    selectedAlloyDesign,
    selectedAlloyFinish,
    allAlloys,
  ]);

  // Debug logging for filtering
  useEffect(() => {
    console.log("Filtering Debug:", {
      totalAlloys: allAlloys.length,
      selectedAlloySize,
      selectedAlloyDesign,
      selectedAlloyFinish,
      availableSizes: availableSizes.map((s) => s.diameter),
      availableDesigns: availableDesigns.map((d) => d.name),
      availableFinishes: availableFinishes.map((f) => f.name),
    });
  }, [
    allAlloys,
    selectedAlloySize,
    selectedAlloyDesign,
    selectedAlloyFinish,
    availableSizes,
    availableDesigns,
    availableFinishes,
  ]);

  // --- ALLOY SELECTION HANDLERS ---

  useEffect(() => {
    // 1. Initial Size Selection
    if (availableSizes.length > 0 && !selectedAlloySize) {
      console.log("Setting initial size:", availableSizes[0].id);
      setSelectedAlloySize(availableSizes[0].id);
    }
  }, [availableSizes, selectedAlloySize, setSelectedAlloySize]);

  useEffect(() => {
    // 2. Initial Design Selection when size changes
    if (selectedAlloySize && availableDesigns.length > 0) {
      const isCurrentDesignValid = availableDesigns.some(
        (d) => d.id === selectedAlloyDesign,
      );
      if (!isCurrentDesignValid) {
        console.log(
          "Setting initial design for size:",
          selectedAlloySize,
          availableDesigns[0].id,
        );
        setSelectedAlloyDesign(availableDesigns[0].id);
      }
    }
  }, [
    selectedAlloySize,
    availableDesigns,
    selectedAlloyDesign,
    setSelectedAlloyDesign,
  ]);

  useEffect(() => {
    // 3. Initial Finish Selection when design/size changes
    if (
      selectedAlloySize &&
      selectedAlloyDesign &&
      availableFinishes.length > 0
    ) {
      const isCurrentFinishValid = availableFinishes.some(
        (f) => f.id === selectedAlloyFinish,
      );
      if (!isCurrentFinishValid) {
        console.log(
          "Setting initial finish for design:",
          selectedAlloyDesign,
          availableFinishes[0].id,
        );
        setSelectedAlloyFinish(availableFinishes[0].id);
      }
    }
  }, [
    selectedAlloySize,
    selectedAlloyDesign,
    availableFinishes,
    selectedAlloyFinish,
    setSelectedAlloyFinish,
  ]);

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

  useEffect(() => {
    if (
      selectedAlloyDesign &&
      selectedAlloyFinish &&
      selectedDiameter &&
      allAlloys.length > 0
    ) {
      const newAlloy = allAlloys.find(
        (alloy) =>
          alloy.designId === selectedAlloyDesign &&
          alloy.finishId === selectedAlloyFinish &&
          alloy.size?.diameter === selectedDiameter,
      );
      setCurrentAlloyDetails(newAlloy || null);
      setSelectedAlloy(newAlloy?.id || null);
    } else {
      setCurrentAlloyDetails(null);
      setSelectedAlloy(null);
    }
  }, [
    selectedAlloyDesign,
    selectedAlloyFinish,
    selectedDiameter,
    allAlloys,
    setSelectedAlloy,
  ]);

  // --- COMPUTED VALUES ---

  // Use carImage directly
  const carImageUrl = car?.carImage || "";

  // Debug logging (must be before early returns)
  useEffect(() => {
    if (car) {
      console.log("Car data:", car);
      console.log("Car image URL:", carImageUrl);
    }
  }, [car, carImageUrl]);

  // --- RENDER LOGIC ---

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

  const carTitle = car.model?.make
    ? `${car.model.make.name} ${car.model.name}`
    : "Car";

  const handleDownloadImage = async () => {
    const originalCanvas = carCanvasRef.current?.getCanvas();
    if (originalCanvas) {
      try {
        // Create a temporary canvas to add the watermark and handle JPEG background
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = originalCanvas.width;
        tempCanvas.height = originalCanvas.height;
        const ctx = tempCanvas.getContext("2d");

        if (!ctx) return;

        // Fill background with white (JPEG doesn't support transparency)
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // Draw the original car configuration
        ctx.drawImage(originalCanvas, 0, 0);

        // Add the favicon at top right as a watermark
        const favicon = new Image();
        favicon.crossOrigin = "anonymous";
        favicon.src = "/favicon.png";

        await new Promise((resolve) => {
          favicon.onload = resolve;
          favicon.onerror = resolve; // Continue even if favicon fails
        });

        if (favicon.complete && favicon.naturalWidth !== 0) {
          const padding = 40; // Increased padding for higher res canvas
          const size = Math.min(tempCanvas.width, tempCanvas.height) * 0.08; // 8% of smaller dimension

          // Draw watermark
          ctx.globalAlpha = 0.8; // Slight transparency for watermark
          ctx.drawImage(
            favicon,
            tempCanvas.width - size - padding,
            padding,
            size,
            size,
          );
          ctx.globalAlpha = 1.0;
        }

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
  };

  const handleCanvasClick = () => {
    // Implementation was removed for brevity, but would be here
  };

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
        {/* Full-width background image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${carBackground})` }}
        />

        {/* Content over background, kept in container for layout consistency */}
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
  console.log("Rendering CarDisplay with carImageUrl:", wheelImage);
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
