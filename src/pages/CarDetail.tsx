import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { carService, alloyService, type Car, type Alloy } from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";
import { ColorPicker } from "@/components/ColorPicker";
import AlloyDesignSelector from "@/components/AlloyDesignSelector";
import AlloyFinishSelector from "@/components/AlloyFinishSelector";

import CarCanvas, { CarCanvasRef } from "@/components/CarCanvas";
import { useToast } from "@/hooks/use-toast"; // Import useToast
import { useIsMobile } from "@/hooks/use-mobile"; // NEW
import { ImageViewerModal } from "@/components/ImageViewerModal"; // NEW
import { cn } from "@/lib/utils"; // NEW, needed for conditional classes

const CarDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    setSelectedAlloy,
    selectedAlloyDesign,
    selectedAlloyFinish,
    selectedCarColor,
    setCurrentCarId,
    currentCarId,
  } = useCarStore();
  const { toast } = useToast(); // Call useToast
  const isMobile = useIsMobile(); // NEW: Call useIsMobile

  const carCanvasRef = useRef<CarCanvasRef>(null);

  const [showImageViewerModal, setShowImageViewerModal] = useState(false); // NEW: State for modal
  const [imageViewerUrl, setImageViewerUrl] = useState<string | null>(null); // NEW: State for modal image

  const [car, setCar] = useState<Car | null>(null);
  const [allAlloys, setAllAlloys] = useState<Alloy[]>([]);
  const [currentAlloyDetails, setCurrentAlloyDetails] = useState<Alloy | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch car data on mount or when currentCarId changes
  useEffect(() => {
    const fetchCarAndAlloys = async () => {
      const carIdToFetch = currentCarId ?? parseInt(id!); // Use currentCarId if available, else id from URL

      if (!carIdToFetch) {
        // If no carId to fetch, return
        setLoading(false);
        return;
      }
      setLoading(true);
      setError(null);
      try {
        const carData = await carService.getCarById(carIdToFetch); // Use carIdToFetch
        setCar(carData);

        const alloysData = await alloyService.getAlloys({
          carId: carData.id,
          isActive: true,
        });
        setAllAlloys(alloysData.alloys);
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError("Failed to load car details");
      } finally {
        setLoading(false);
      }
    };
    fetchCarAndAlloys();
  }, [id, currentCarId]);

  // Fetch new car when color changes
  useEffect(() => {
    const fetchCarByColor = async () => {
      if (!selectedCarColor || !car?.variantId) return;

      try {
        const carsData = await carService.getCars({
          variantId: car.variantId,
          colorId: selectedCarColor,
          limit: 1,
          isActive: true,
        });

        if (carsData.cars.length > 0) {
          const newCar = carsData.cars[0];
          setCar(newCar);
          setCurrentCarId(newCar.id);
        }
      } catch (err) {
        console.error("Failed to fetch car by color:", err);
      }
    };

    fetchCarByColor();
  }, [selectedCarColor, car?.variantId, setCurrentCarId]);

  // set current alloy details based on selections
  useEffect(() => {
    if (selectedAlloyDesign && selectedAlloyFinish && allAlloys.length > 0) {
      const newAlloy = allAlloys.find(
        (alloy) =>
          alloy.designId === selectedAlloyDesign &&
          alloy.finishId === selectedAlloyFinish,
      );
      if (newAlloy) {
        setCurrentAlloyDetails(newAlloy);
        setSelectedAlloy(newAlloy.id);
      } else {
        setCurrentAlloyDetails(null);
        setSelectedAlloy(null);
      }
    } else {
      setCurrentAlloyDetails(null);
      setSelectedAlloy(null);
    }
  }, [
    selectedAlloyDesign,
    selectedAlloyFinish,
    allAlloys,
    setSelectedAlloy,
  ]);

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

  const carTitle = car.variant?.model?.make
    ? `${car.variant.model.make.name} ${car.variant.model.name} ${car.variant.name}`
    : "Car";

  const wheelImage = currentAlloyDetails?.alloyImages?.[0] || "";

  const handleDownloadImage = () => {
    const canvas = carCanvasRef.current?.getCanvas();
    if (canvas) {
      try {
        const image = canvas
          .toDataURL("image/png")
          .replace("image/png", "image/octet-stream");
        const link = document.createElement("a");
        link.download = `${car?.variant?.model?.make?.name || "car"}-${
          car?.variant?.model?.name || "model"
        }-${car?.variant?.name || "variant"}.png`;
        link.href = image;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
          title: "Download Completed",
          description: "Your car image has been downloaded successfully.",
        });
      } catch (error) {
        console.error("Failed to download image:", error);
        toast({
          title: "Download Failed",
          description:
            "Could not download the car image. Please ensure images are loaded correctly and try again.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Download Failed",
        description: "Car canvas not available for download.",
        variant: "destructive",
      });
    }
  };

  const handleCanvasClick = () => {
    if (!isMobile) return; // Only enable click on mobile

    const canvas = carCanvasRef.current?.getCanvas();
    if (canvas) {
      try {
        const imageData = canvas.toDataURL("image/png");
        setImageViewerUrl(imageData);
        setShowImageViewerModal(true);
      } catch (error) {
        console.error("Failed to get canvas image data for viewer:", error);
        toast({
          title: "Error",
          description:
            "Could not prepare image for viewer. It might be tainted.",
          variant: "destructive",
        });
      }
    } else {
      toast({
        title: "Error",
        description: "Car canvas not available.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="w-full container mx-auto px-4 py-8">
        <CarHeader carTitle={carTitle} carId={car.id} />
        <CarDisplay
          car={car}
          isMobile={isMobile}
          handleCanvasClick={handleCanvasClick}
          carCanvasRef={carCanvasRef}
          wheelImage={wheelImage}
          handleDownloadImage={handleDownloadImage}
        />
        <ImageViewerModal
          imageUrl={imageViewerUrl}
          open={showImageViewerModal}
          onClose={() => setShowImageViewerModal(false)}
        />
      </div>
      <AlloySelection
        carId={car.id}
        allAlloys={allAlloys}
        currentAlloyDetails={currentAlloyDetails}
      />
    </>
  );
};

export default CarDetail;

// Helper Components
const CarHeader = ({ carTitle, carId }: { carTitle: string; carId: number }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center m-4 sm:m-8 gap-4">
    <h1 className="text-3xl sm:text-4xl font-bold">{carTitle}</h1>
    <div className="flex flex-col sm:flex-row gap-4">
      <ColorPicker carId={carId} />
    </div>
  </div>
);

const CarDisplay = ({
  car,
  isMobile,
  handleCanvasClick,
  carCanvasRef,
  wheelImage,
  handleDownloadImage,
}: {
  car: Car;
  isMobile: boolean;
  handleCanvasClick: () => void;
  carCanvasRef: React.RefObject<CarCanvasRef>;
  wheelImage: string;
  handleDownloadImage: () => void;
}) => (
  <div className="w-full relative">
    {car.carImage && (
      <div
        className={cn("relative", isMobile && "cursor-pointer")}
        onClick={handleCanvasClick}>
        <CarCanvas
          ref={carCanvasRef}
          carImage={car.carImage}
          wheelImage={wheelImage}
          x_front={car.x_front}
          y_front={car.y_front}
          x_rear={car.x_rear}
          y_rear={car.y_rear}
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
    )}
  </div>
);

const AlloySelection = ({
  carId,
  allAlloys,
  currentAlloyDetails,
}: {
  carId: number;
  allAlloys: Alloy[];
  currentAlloyDetails: Alloy | null;
}) => (
  <div className="container mx-auto px-4 py-8">
    {currentAlloyDetails && (
      <div className="mb-8 text-3xl font-semibold">
        {currentAlloyDetails.alloyName}
      </div>
    )}
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Alloy Design</h2>
      <AlloyDesignSelector carId={carId} allAlloys={allAlloys} />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-4">Alloy Finish</h2>
      <AlloyFinishSelector carId={carId} allAlloys={allAlloys} />
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
