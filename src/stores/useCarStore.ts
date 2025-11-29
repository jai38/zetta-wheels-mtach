import { create } from 'zustand';

interface CarState {
  selectedMake: string | null;
  selectedModel: string | null;
  searchQuery: string;
  selectedColor: string | null;
  selectedAlloySize: string | null;
  selectedFinish: string | null;
  currentCarId: string | null;
  selectedAlloy: string | null;
  selectedCarColor: string | null;
  
  setSelectedMake: (make: string | null) => void;
  setSelectedModel: (model: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedColor: (color: string | null) => void;
  setSelectedAlloySize: (size: string | null) => void;
  setSelectedFinish: (finish: string | null) => void;
  setCurrentCarId: (id: string | null) => void;
  setSelectedAlloy: (alloyId: string | null) => void;
  setSelectedCarColor: (color: string | null) => void;
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
  selectedCarColor: null,
  
  setSelectedMake: (make) => set({ selectedMake: make, selectedModel: null }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setSelectedColor: (color) => set({ selectedColor: color }),
  setSelectedAlloySize: (size) => set({ selectedAlloySize: size }),
  setSelectedFinish: (finish) => set({ selectedFinish: finish }),
  setCurrentCarId: (id) => set({ currentCarId: id }),
  setSelectedAlloy: (alloyId) => set({ selectedAlloy: alloyId }),
  setSelectedCarColor: (color) => set({ selectedCarColor: color }),
  resetFilters: () => set({
    selectedColor: null,
    selectedAlloySize: null,
    selectedFinish: null,
  }),
}));
