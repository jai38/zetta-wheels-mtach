// Mock data structure for the car configurator

export interface Make {
  id: string;
  name: string;
}

export interface Model {
  id: string;
  name: string;
  makeId: string;
}

export interface Color {
  id: string;
  name: string;
  hex: string;
}

export interface Alloy {
  id: string;
  name: string;
  size: string;
  finish: string;
  imagePath: string;
  price: number;
}

export interface Car {
  id: string;
  title: string;
  makeId: string;
  modelId: string;
  price: number;
  baseImagePath: string;
  thumbnailPath: string;
  colors: Color[];
  alloyIds: string[];
  specs: {
    engine: string;
    power: string;
    transmission: string;
  };
}

// Mock Makes
export const makes: Make[] = [
  { id: 'porsche', name: 'Porsche' },
  { id: 'bmw', name: 'BMW' },
  { id: 'audi', name: 'Audi' },
  { id: 'mercedes', name: 'Mercedes-Benz' },
];

// Mock Models
export const models: Model[] = [
  { id: '911', name: '911 Carrera', makeId: 'porsche' },
  { id: 'taycan', name: 'Taycan', makeId: 'porsche' },
  { id: 'cayenne', name: 'Cayenne', makeId: 'porsche' },
  { id: 'm3', name: 'M3', makeId: 'bmw' },
  { id: 'm5', name: 'M5', makeId: 'bmw' },
  { id: 'x5', name: 'X5', makeId: 'bmw' },
  { id: 'rs6', name: 'RS6 Avant', makeId: 'audi' },
  { id: 'r8', name: 'R8', makeId: 'audi' },
  { id: 'e-tron', name: 'e-tron GT', makeId: 'audi' },
  { id: 'amg-gt', name: 'AMG GT', makeId: 'mercedes' },
  { id: 's-class', name: 'S-Class', makeId: 'mercedes' },
];

// Mock Colors
export const colors: Color[] = [
  { id: 'black', name: 'Jet Black', hex: '#0a0a0a' },
  { id: 'white', name: 'Alpine White', hex: '#f5f5f5' },
  { id: 'silver', name: 'Meteor Silver', hex: '#9ca3af' },
  { id: 'blue', name: 'Ocean Blue', hex: '#1e40af' },
  { id: 'red', name: 'Racing Red', hex: '#dc2626' },
  { id: 'gray', name: 'Graphite Gray', hex: '#374151' },
];

// Mock Alloys
export const alloys: Alloy[] = [
  {
    id: 'alloy-1',
    name: 'Sport Classic 19"',
    size: '19"',
    finish: 'Gloss Black',
    imagePath: '/api/placeholder/400/400',
    price: 2500,
  },
  {
    id: 'alloy-2',
    name: 'Performance 20"',
    size: '20"',
    finish: 'Silver',
    imagePath: '/api/placeholder/400/400',
    price: 3200,
  },
  {
    id: 'alloy-3',
    name: 'Forged Racing 21"',
    size: '21"',
    finish: 'Matte Bronze',
    imagePath: '/api/placeholder/400/400',
    price: 4500,
  },
  {
    id: 'alloy-4',
    name: 'Luxury 20"',
    size: '20"',
    finish: 'Polished',
    imagePath: '/api/placeholder/400/400',
    price: 3800,
  },
  {
    id: 'alloy-5',
    name: 'Track 19"',
    size: '19"',
    finish: 'Titanium',
    imagePath: '/api/placeholder/400/400',
    price: 2900,
  },
  {
    id: 'alloy-6',
    name: 'Aerodynamic 21"',
    size: '21"',
    finish: 'Carbon Fiber',
    imagePath: '/api/placeholder/400/400',
    price: 5200,
  },
];

// Mock Cars
export const cars: Car[] = [
  {
    id: 'car-1',
    title: 'Porsche 911 Carrera S',
    makeId: 'porsche',
    modelId: '911',
    price: 129900,
    baseImagePath: '/api/placeholder/800/600',
    thumbnailPath: '/api/placeholder/400/300',
    colors: colors.slice(0, 4),
    alloyIds: ['alloy-1', 'alloy-2', 'alloy-3'],
    specs: {
      engine: '3.0L Twin-Turbo Flat-Six',
      power: '443 hp',
      transmission: '8-Speed PDK',
    },
  },
  {
    id: 'car-2',
    title: 'Porsche Taycan Turbo S',
    makeId: 'porsche',
    modelId: 'taycan',
    price: 185000,
    baseImagePath: '/api/placeholder/800/600',
    thumbnailPath: '/api/placeholder/400/300',
    colors: colors.slice(1, 5),
    alloyIds: ['alloy-2', 'alloy-4', 'alloy-6'],
    specs: {
      engine: 'Dual Electric Motors',
      power: '750 hp',
      transmission: '2-Speed Automatic',
    },
  },
  {
    id: 'car-3',
    title: 'BMW M3 Competition',
    makeId: 'bmw',
    modelId: 'm3',
    price: 79900,
    baseImagePath: '/api/placeholder/800/600',
    thumbnailPath: '/api/placeholder/400/300',
    colors: colors.slice(0, 3),
    alloyIds: ['alloy-1', 'alloy-2', 'alloy-5'],
    specs: {
      engine: '3.0L Twin-Turbo Inline-Six',
      power: '503 hp',
      transmission: '8-Speed Automatic',
    },
  },
  {
    id: 'car-4',
    title: 'Audi RS6 Avant',
    makeId: 'audi',
    modelId: 'rs6',
    price: 116500,
    baseImagePath: '/api/placeholder/800/600',
    thumbnailPath: '/api/placeholder/400/300',
    colors: colors,
    alloyIds: ['alloy-3', 'alloy-4', 'alloy-5'],
    specs: {
      engine: '4.0L Twin-Turbo V8',
      power: '591 hp',
      transmission: '8-Speed Tiptronic',
    },
  },
  {
    id: 'car-5',
    title: 'Mercedes-AMG GT R',
    makeId: 'mercedes',
    modelId: 'amg-gt',
    price: 162900,
    baseImagePath: '/api/placeholder/800/600',
    thumbnailPath: '/api/placeholder/400/300',
    colors: colors.slice(2, 6),
    alloyIds: ['alloy-2', 'alloy-3', 'alloy-6'],
    specs: {
      engine: '4.0L Twin-Turbo V8',
      power: '577 hp',
      transmission: '7-Speed DCT',
    },
  },
  {
    id: 'car-6',
    title: 'Porsche Cayenne Turbo',
    makeId: 'porsche',
    modelId: 'cayenne',
    price: 134500,
    baseImagePath: '/api/placeholder/800/600',
    thumbnailPath: '/api/placeholder/400/300',
    colors: colors.slice(0, 4),
    alloyIds: ['alloy-4', 'alloy-5', 'alloy-6'],
    specs: {
      engine: '4.0L Twin-Turbo V8',
      power: '541 hp',
      transmission: '8-Speed Tiptronic',
    },
  },
];

// API simulation helpers
export const getMakes = (): Make[] => makes;

export const getModelsByMake = (makeId: string): Model[] => {
  return models.filter((model) => model.makeId === makeId);
};

export const getCars = (params: {
  makeId?: string;
  modelId?: string;
  page?: number;
  query?: string;
  color?: string;
  alloySize?: string;
  finish?: string;
}): { items: Car[]; page: number; totalPages: number } => {
  let filtered = [...cars];

  if (params.makeId) {
    filtered = filtered.filter((car) => car.makeId === params.makeId);
  }
  
  if (params.modelId) {
    filtered = filtered.filter((car) => car.modelId === params.modelId);
  }

  if (params.query) {
    const query = params.query.toLowerCase();
    filtered = filtered.filter((car) =>
      car.title.toLowerCase().includes(query)
    );
  }

  if (params.color) {
    filtered = filtered.filter((car) =>
      car.colors.some((c) => c.id === params.color)
    );
  }

  // For demo purposes, simulate pagination
  const page = params.page || 1;
  const itemsPerPage = 6;
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const start = (page - 1) * itemsPerPage;
  const items = filtered.slice(start, start + itemsPerPage);

  return { items, page, totalPages };
};

export const getCarById = (id: string): Car | undefined => {
  return cars.find((car) => car.id === id);
};

export const getAlloysByCar = (carId: string): Alloy[] => {
  const car = getCarById(carId);
  if (!car) return [];
  return alloys.filter((alloy) => car.alloyIds.includes(alloy.id));
};
