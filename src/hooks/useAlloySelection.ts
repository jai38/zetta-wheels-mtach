import { useMemo, useEffect } from "react";
import {
  type Alloy,
  type AlloySize,
  type AlloyDesign,
  type AlloyFinish,
} from "@/lib/api";
import { useCarStore } from "@/stores/useCarStore";

export const useAlloySelection = (allAlloys: Alloy[], minDiameter: number = 0) => {
  const {
    selectedAlloySize,
    selectedAlloyDesign,
    selectedAlloyFinish,
    setSelectedAlloySize,
    setSelectedAlloyDesign,
    setSelectedAlloyFinish,
    setSelectedAlloy,
  } = useCarStore();

  // Helper function for filtering available options
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
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          return (alloy as any)[key] === value;
        });
      })
      .forEach((alloy) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const item = (alloy as any)[filterKey];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const id = (alloy as any)[idKey];
        if (item && id) {
          itemMap.set(id, item as T);
        }
      });

    const items = Array.from(itemMap.values());
    if (filterKey === "size") {
      (items as AlloySize[]).sort((a, b) => a.diameter - b.diameter);
    } else if (filterKey === "design" || filterKey === "finish") {
      (items as (AlloyDesign | AlloyFinish)[]).sort((a, b) => a.name.localeCompare(b.name));
    }
    return items;
  };

  // --- Computed Available Lists ---

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

    return getAvailable<AlloyDesign>(
      filteredAlloys,
      "design",
      "designId",
      {},
    );
  }, [allAlloys, selectedDiameter]);

  const availableFinishes = useMemo(() => {
    let filteredAlloys = allAlloys;
    if (selectedDiameter) {
      filteredAlloys = filteredAlloys.filter(
        (a) => a.size?.diameter === selectedDiameter,
      );
    }

    return getAvailable<AlloyFinish>(
      filteredAlloys,
      "finish",
      "finishId",
      { designId: selectedAlloyDesign },
    );
  }, [allAlloys, selectedDiameter, selectedAlloyDesign]);

  // --- Auto-Selection Effects ---

  // 1. Initial Size Selection
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedAlloySize) {
      // Find first size that meets minimum diameter requirement
      const validSize = availableSizes.find(s => s.diameter >= minDiameter) || availableSizes[0];
      
      if (validSize) {
        console.log("Setting initial size:", validSize.id, "Min diameter:", minDiameter);
        setSelectedAlloySize(validSize.id);
      }
    }
  }, [availableSizes, selectedAlloySize, setSelectedAlloySize, minDiameter]);

  // 2. Initial Design Selection when size changes
  useEffect(() => {
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

  // 3. Initial Finish Selection when design/size changes
  useEffect(() => {
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

  // --- Derived Values ---

  const currentAlloyDetails = useMemo(() => {
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
      return newAlloy || null;
    }
    return null;
  }, [selectedAlloyDesign, selectedAlloyFinish, selectedDiameter, allAlloys]);

  // Update store with the full alloy object ID
  useEffect(() => {
    setSelectedAlloy(currentAlloyDetails?.id || null);
  }, [currentAlloyDetails, setSelectedAlloy]);

  const wheelImage = useMemo(() => {
    // 1. Try to use the image from the specifically selected alloy (Design + Finish + Size)
    if (currentAlloyDetails?.image_url) {
      return currentAlloyDetails.image_url;
    }

    // 2. Fallback: If the selected specific alloy has no image, try to find ANY alloy
    // with the same Design and Finish that DOES have an image.
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

  return {
    uniqueDiameterSizes,
    availableDesigns,
    availableFinishes,
    currentAlloyDetails,
    selectedDiameter,
    wheelImage,
    // Expose handlers if needed, or component uses store directly.
    // Component uses store handlers, so we don't need to return them, 
    // but the component needs `selectedAlloyFinish` for UI highlighting.
    selectedAlloySize,
    selectedAlloyFinish,
  };
};
