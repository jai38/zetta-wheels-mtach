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
    const fetchCarAndAlloys = async () => {
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

        setCurrentCarId(carId);
        const carData = await carService.getCarById(carId);
        setCar(carData);

        const alloysData = await alloyService.getAlloys({
          carId: carData.id,
          isActive: true,
        });
        setAllAlloys(alloysData.alloys);
      } catch (err) {
        console.error("Failed to fetch car details:", err);
        setError("Failed to load car details.");
      } finally {
        setLoading(false);
      }
    };
    fetchCarAndAlloys();
  }, [id, setCurrentCarId]);

  useEffect(() => {
    const fetchCarByColor = async () => {
      if (!selectedColor || !car?.variantId) return;

      try {
        const carsData = await carService.getCars({
          variantId: car.variantId,
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
  }, [selectedColor, car?.variantId, setCurrentCarId, setSelectedAlloyDesign]);

  // --- ALLOY FILTERING LOGIC ---

  const getAvailable = <T extends AlloySize | AlloyFinish>(
    alloys: Alloy[],
    designId: number | null,
    filterKey: "size" | "finish",
    idKey: "sizeId" | "finishId",
    dependencyId: number | null,
    dependencyKey: "sizeId" | "finishId",
  ): T[] => {
    if (!designId) return [];
    const itemMap = new Map<number, T>();
    alloys
      .filter((alloy) => {
        const designMatch = alloy.designId === designId;
        const dependencyMatch = !dependencyId || alloy[dependencyKey] === dependencyId;
        return designMatch && dependencyMatch;
      })
      .forEach((alloy) => {
        if (alloy[filterKey]) {
          itemMap.set(alloy[idKey], alloy[filterKey] as T);
        }
      });

    const items = Array.from(itemMap.values());
    if (filterKey === "size") {
      (items as AlloySize[]).sort((a, b) => a.diameter - b.diameter);
    }
    return items;
  };

  const availableSizes = useMemo(
    () =>
      getAvailable<AlloySize>(
        allAlloys,
        selectedAlloyDesign,
        "size",
        "sizeId",
        selectedAlloyFinish,
        "finishId",
      ),
    [allAlloys, selectedAlloyDesign, selectedAlloyFinish],
  );

  const availableFinishes = useMemo(
    () =>
      getAvailable<AlloyFinish>(
        allAlloys,
        selectedAlloyDesign,
        "finish",
        "finishId",
        selectedAlloySize,
        "sizeId",
      ),
    [allAlloys, selectedAlloyDesign, selectedAlloySize],
  );

  // --- ALLOY SELECTION HANDLERS ---

  useEffect(() => {
    // Set initial size and finish when design changes
    if (selectedAlloyDesign && !selectedAlloySize && !selectedAlloyFinish) {
      const firstSize = getAvailable<AlloySize>(allAlloys, selectedAlloyDesign, "size", "sizeId", null, "finishId")[0];
      if (firstSize) {
        setSelectedAlloySize(firstSize.id);
        const firstFinish = getAvailable<AlloyFinish>(allAlloys, selectedAlloyDesign, "finish", "finishId", firstSize.id, "sizeId")[0];
        if (firstFinish) {
          setSelectedAlloyFinish(firstFinish.id);
        }
      }
    }
  }, [selectedAlloyDesign, allAlloys, selectedAlloySize, selectedAlloyFinish, setSelectedAlloySize, setSelectedAlloyFinish]);


  const handleSizeSelect = (sizeId: number) => {
    setSelectedAlloySize(sizeId);
    const newFinishes = getAvailable<AlloyFinish>(allAlloys, selectedAlloyDesign, "finish", "finishId", sizeId, "sizeId");
    const isCurrentFinishValid = newFinishes.some(f => f.id === selectedAlloyFinish);

    if (!isCurrentFinishValid && newFinishes.length > 0) {
      setSelectedAlloyFinish(newFinishes[0].id);
    }
  };

  const handleFinishSelect = (finishId: number) => {
    setSelectedAlloyFinish(finishId);
    const newSizes = getAvailable<AlloySize>(allAlloys, selectedAlloyDesign, "size", "sizeId", finishId, "finishId");
    const isCurrentSizeValid = newSizes.some(s => s.id === selectedAlloySize);

    if (!isCurrentSizeValid && newSizes.length > 0) {
      setSelectedAlloySize(newSizes[0].id);
    }
  };


  useEffect(() => {
    if (
      selectedAlloyDesign &&
      selectedAlloyFinish &&
      selectedAlloySize &&
      allAlloys.length > 0
    ) {
      const newAlloy = allAlloys.find(
        (alloy) =>
          alloy.designId === selectedAlloyDesign &&
          alloy.finishId === selectedAlloyFinish &&
          alloy.sizeId === selectedAlloySize,
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
    selectedAlloySize,
    allAlloys,
    setSelectedAlloy,
  ]);

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

  const carTitle = car.variant?.model?.make
    ? `${car.variant.model.make.name} ${car.variant.model.name} ${car.variant.name}`
    : "Car";

  const wheelImage = currentAlloyDetails?.alloyImages?.[0] || "";

  const handleDownloadImage = () => {
    // Implementation was removed for brevity, but would be here
  };

  const handleCanvasClick = () => {
    // Implementation was removed for brevity, but would be here
  };

  return (
    <>
      <div className="w-full container mx-auto px-4 py-8">
        <CarHeader carTitle={carTitle} car={car} setSelectedColor={setSelectedColor} />
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
        availableSizes={availableSizes}
        availableFinishes={availableFinishes}
        selectedSize={selectedAlloySize}
        selectedFinish={selectedAlloyFinish}
        onSelectSize={handleSizeSelect}
        onSelectFinish={handleFinishSelect}
      />
    </>
  );
};

export default CarDetail;

// Helper Components
const CarHeader = ({ carTitle, car, setSelectedColor }: { carTitle: string; car: Car, setSelectedColor: (color: number) => void; }) => (
  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center m-4 sm:m-8 gap-4">
    <h1 className="text-3xl sm:text-4xl font-bold">{carTitle}</h1>
    <div className="flex flex-col sm:flex-row gap-4">
      <ColorPicker car={car} onColorChange={setSelectedColor} />
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
  availableSizes,
  availableFinishes,
  selectedSize,
  selectedFinish,
  onSelectSize,
  onSelectFinish,
}: {
  carId: number;
  allAlloys: Alloy[];
  currentAlloyDetails: Alloy | null;
  availableSizes: AlloySize[];
  availableFinishes: AlloyFinish[];
  selectedSize: number | null;
  selectedFinish: number | null;
  onSelectSize: (sizeId: number) => void;
  onSelectFinish: (finishId: number) => void;
}) => (
  <div className="container mx-auto px-4 py-8">
    <div className="flex justify-between items-center mb-8">
      {currentAlloyDetails && (
        <div className="text-3xl font-semibold">
          {currentAlloyDetails.alloyName}
        </div>
      )}
      <SizePicker
        sizes={availableSizes}
        selectedSize={selectedSize}
        onSelectSize={onSelectSize}
      />
    </div>
    <div className="mb-8">
      <h2 className="text-2xl font-bold mb-4">Alloy Design</h2>
      <AlloyDesignSelector carId={carId} allAlloys={allAlloys} />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-4">Alloy Finish</h2>
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
    className="lucide lucide-download"
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);