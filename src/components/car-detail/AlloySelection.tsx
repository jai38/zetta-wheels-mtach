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

  const handleSizeSelect = (sizeId: number) => {
    onSelectSize(sizeId);
    setActiveTab("design");
  };

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
    <div className="container mx-auto px-4 pt-0 pb-8">
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
                className="bg-[#1d1d1f] hover:bg-[#333336] text-white font-medium px-8 py-2 h-11 rounded-full shadow-[0_8px_20px_rgb(0,0,0,0.2)] transition-all duration-300">
                Buy Now
              </Button>
            )}
          </div>

          <div className="w-full lg:w-auto flex justify-end">
            <SizePicker
              sizes={availableSizes}
              selectedDiameter={selectedSize}
              onSelectSize={handleSizeSelect}
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
            onSelectSize={handleSizeSelect}
            minDiameter={minDiameter}
          />
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 mb-8 bg-[#f5f5f7] p-1 rounded-full h-12">
          <TabsTrigger
            value="design"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-[#1d1d1f] data-[state=active]:shadow-sm text-[#86868b] font-medium transition-all">
            Alloy Design
          </TabsTrigger>
          <TabsTrigger
            value="finish"
            className="rounded-full data-[state=active]:bg-white data-[state=active]:text-[#1d1d1f] data-[state=active]:shadow-sm text-[#86868b] font-medium transition-all">
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
