import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const [activeTab, setActiveTab] = useState("design");

  const handleDesignSelect = (designId: number) => {
    onSelectDesign(designId);
    // On mobile-like view (or general tab navigation), we might want to auto-switch
    // But since we are unifying, let's keep the behavior if it makes sense or remove the check
    // The user didn't explicitly ask to remove the auto-switch, but effectively "isMobile" check might be redundant if we want consistent behavior.
    // However, for desktop, auto-switching might be annoying if the user wants to see designs.
    // Let's keep the auto-switch logic but maybe base it on something else or just keep it simple.
    // Actually, the original code only switched on mobile.
    // "on the client UI as we have filters on mobile in 2 tabs, in the same way we should have for desktop as well"
    // implies consistent behavior.
    setActiveTab("finish");
  };

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger
            value="design"
            className="data-[state=active]:bg-white data-[state=active]:text-black">
            Alloy Design
          </TabsTrigger>
          <TabsTrigger
            value="finish"
            className="data-[state=active]:bg-white data-[state=active]:text-black">
            Alloy Finish
          </TabsTrigger>
        </TabsList>
        <TabsContent value="design">
          <AlloyDesignSelector
            carId={carId}
            allAlloys={allAlloys}
            designs={availableDesigns}
            onSelectDesign={handleDesignSelect}
          />
        </TabsContent>
        <TabsContent value="finish">
          <AlloyFinishSelector
            finishes={availableFinishes}
            selectedFinish={selectedFinish}
            onSelectFinish={onSelectFinish}
            allAlloys={allAlloys}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
