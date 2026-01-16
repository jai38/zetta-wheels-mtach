import React from "react";
import { Button } from "@/components/ui/button";
import AlloyDesignSelector from "@/components/AlloyDesignSelector";
import AlloyFinishSelector from "@/components/AlloyFinishSelector";
import SizePicker from "@/components/SizePicker";
import {
  type Alloy,
  type AlloySize,
  type AlloyDesign,
  type AlloyFinish,
} from "@/lib/api";

interface AlloySelectionProps {
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
}

export const AlloySelection: React.FC<AlloySelectionProps> = ({
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
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      {currentAlloyDetails && (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center w-full mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full lg:w-auto">
            <div className="text-3xl font-semibold">
              {`${currentAlloyDetails.size?.specs} ${currentAlloyDetails.design?.name} ${currentAlloyDetails.pcd?.name} ${currentAlloyDetails.finish?.description || currentAlloyDetails.finish?.name}`}
            </div>
            {currentAlloyDetails.buy_url && (
              <Button
                onClick={() =>
                  window.open(currentAlloyDetails.buy_url, "_blank")
                }
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
};
