import { create } from 'zustand';

interface CarState {
  selectedMake: number | null;
  selectedModel: number | null;
  searchQuery: string;
  selectedColor: number | null;
  selectedAlloySize: number | null;
  selectedFinish: number | null;
  currentCarId: number | null;
  selectedAlloy: number | null;
  selectedAlloyDesign: number | null;
  selectedAlloyFinish: number | null;
  
  setSelectedMake: (make: number | null) => void;
  setSelectedModel: (model: number | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedColor: (color: number | null) => void;
  setSelectedAlloySize: (size: number | null) => void;
  setSelectedFinish: (finish: number | null) => void;
  setCurrentCarId: (id: number | null) => void;
  setSelectedAlloy: (alloyId: number | null) => void;
  setSelectedAlloyDesign: (designId: number | null) => void;
  setSelectedAlloyFinish: (finishId: number | null) => void;
  resetSelectedAlloyFinish: () => void;
  resetFilters: () => void;
}

export const useCarStore = create<CarState>((set) => ({
  selectedMake: null,
  selectedModel: null,
  searchQuery: '',
  selectedColor: null,
  selectedAlloySize: null,
  selectedFinish: null,
  currentCarId: null,
  selectedAlloy: null,
  selectedAlloyDesign: null,
  selectedAlloyFinish: null,
  
  setSelectedMake: (make) => set({ selectedMake: make, selectedModel: null }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setSelectedAlloySize: (size) => set({ selectedAlloySize: size }),
  setSelectedFinish: (finish) => set({ selectedFinish: finish }),
  setCurrentCarId: (id) => set({ currentCarId: id }),
  setSelectedAlloy: (alloyId) => set({ selectedAlloy: alloyId }),
  setSelectedAlloyDesign: (designId) => set({ selectedAlloyDesign: designId, selectedAlloyFinish: null, selectedAlloySize: null }),
  setSelectedAlloyFinish: (finishId) => set({ selectedAlloyFinish: finishId }),
  resetSelectedAlloyFinish: () => set({ selectedAlloyFinish: null }),
  resetFilters: () => set({
    selectedColor: null,
    selectedAlloySize: null,
    selectedFinish: null,
  }),
}));
