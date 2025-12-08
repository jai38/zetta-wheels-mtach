# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Setup & Development
```bash
# Install dependencies
npm install

# Start development server (runs on http://localhost:8080)
npm run dev

# Run linter
npm run lint
```

### Building
```bash
# Production build
npm run build

# Development build (preserves development features)
npm run build:dev

# Preview production build locally
npm run preview
```

## Project Overview

This is a **premium car configurator prototype** built as a modern web application. It provides a car shopping experience with real-time wheel/alloy customization and color visualization. The application is currently using mock data but is architected for easy transition to real APIs.

### Tech Stack
- **React 18** with TypeScript
- **Vite** as build tool (SWC for fast refresh)
- **React Router** for navigation (routes: `/`, `/cars/:id`, `*` for 404)
- **Zustand** for lightweight global state management
- **React Query** for data fetching/caching (currently unused with mock data)
- **Tailwind CSS** + **shadcn/ui** for UI components
- **Framer Motion** for animations
- **Headless UI** for accessible components

## Architecture & Key Concepts

### State Management Strategy

The application uses **Zustand** for minimal, fast global state. The entire store is in `src/stores/useCarStore.ts`.

**Key State:**
- Catalog filters: `selectedMake`, `selectedModel`, `searchQuery`
- Catalog UI filters: `selectedColor`, `selectedAlloySize`, `selectedFinish`
- Car detail page: `selectedCarColor`, `selectedAlloy`, `currentCarId`

**Important Pattern:** When `selectedMake` changes, `selectedModel` is automatically reset to `null` (dependent select pattern).

Access state in any component:
```typescript
const { selectedMake, setSelectedMake } = useCarStore();
```

### Mock Data Architecture

All data is currently in `src/lib/mockData.ts` to enable development without a backend. The mock system simulates a real API:

**Available Functions:**
- `getMakes()` - Returns all car makes
- `getModelsByMake(makeId)` - Returns models filtered by make
- `getCars({ makeId, modelId, query, page })` - Returns paginated, filtered cars
- `getCarById(id)` - Returns single car details
- `getAlloysByCar(carId)` - Returns available alloy wheels for a car

**Data Structures:**
- `Make` - Car manufacturer (id, name)
- `Model` - Car model (id, name, makeId)
- `Car` - Full car with colors, alloy IDs, specs, pricing
- `Color` - Color swatch (id, name, hex)
- `Alloy` - Wheel option (id, name, size, finish, price, imagePath)

**To switch to real API:** Replace function calls with React Query hooks and update imports.

### Routing & Pages

**Routes:**
- `/` - `Index.tsx` - Car catalog with filters, search, infinite scroll
- `/cars/:id` - `CarDetail.tsx` - Car configurator with color/alloy selection
- `*` - `NotFound.tsx` - 404 page

**IMPORTANT:** Always add new routes ABOVE the catch-all `*` route in `App.tsx`.

### Component Architecture

**Page Components:** `src/pages/`
- `Index.tsx` - Main catalog page with filters sidebar (desktop) / sheet (mobile)
- `CarDetail.tsx` - Car configuration page with real-time image swapping

**Feature Components:** `src/components/`
- `DependentSelect.tsx` - Make/Model dropdown with dependency logic
- `SearchInput.tsx` - Debounced search (300ms delay)
- `InfiniteGrid.tsx` - Car grid with IntersectionObserver-based infinite scroll
- `Filters.tsx` - Filter panel (sidebar on desktop, sheet on mobile)
- `CarCard.tsx` - Individual car listing card

**UI Components:** `src/components/ui/`
- Shadcn/ui components (do not manually edit these)

### Design System

The app uses a **premium dark theme** with warm bronze/copper accents. All design tokens are defined in `src/index.css` as CSS variables.

**Typography:**
- Headings: `Playfair Display` (serif) - use `font-serif` class
- Body: `Inter` - use `font-sans` class (default)

**Color Tokens (HSL):**
- Primary/Accent: `hsl(25 75% 55%)` - warm bronze/copper for CTAs
- Background: `hsl(222 20% 8%)` - deep charcoal
- Card: `hsl(222 18% 12%)` - elevated surfaces
- All colors MUST be HSL format

**Custom Utilities (defined in index.css):**
- `shadow-soft` - Subtle elevation
- `shadow-elevated` - Medium elevation for cards
- `shadow-premium` - Maximum depth for hero elements
- `transition-smooth` - Standard transitions
- `transition-spring` - Bouncy spring transitions

**Path Alias:** Use `@/` to import from `src/` (configured in vite.config.ts and tsconfig.json)

```typescript
import { Button } from '@/components/ui/button';
import { useCarStore } from '@/stores/useCarStore';
```

## Key Development Patterns

### Catalog Page Flow
1. User selects Make → triggers model reset and car reload
2. User selects Model → filters cars by make + model
3. Search input debounces 300ms → filters cars by query
4. Filters (color, alloy size, finish) → stored in Zustand but currently not implemented in getCars()
5. Infinite scroll → automatically loads next page when sentinel is visible

### Car Detail Page Flow
1. Load car by ID from URL params
2. Load available alloys for that car
3. Set default color (first color) and alloy (first alloy) if not already selected
4. Color selection → triggers image swap with loading state
5. Alloy selection → triggers image swap with loading state
6. Image uses AnimatePresence for crossfade transitions

### Image Strategy (Current Implementation)
All images currently use placeholder API (`/api/placeholder`). Images swap instantly on color/alloy selection with a fade transition.

**For production**, the architecture supports:
- **Layered compositing:** Separate base/color/alloy layers composited client-side
- **Pre-rendered composites:** CDN template URLs like `{carId}/{colorId}/{alloyId}.webp`

Prefetching strategy should target adjacent alloys (selected ± 2) for instant swaps.

## TypeScript Configuration

The project uses lenient TypeScript settings for rapid prototyping:
- `noImplicitAny: false`
- `noUnusedParameters: false`
- `noUnusedLocals: false`
- `strictNullChecks: false`

ESLint disables `@typescript-eslint/no-unused-vars` warnings.

When moving to production, consider enabling stricter checks incrementally.

## Mobile Considerations

- Responsive breakpoints: single column → 2-col → 3-col grid
- Filters: sidebar on desktop (`lg:block`), bottom sheet on mobile
- Touch targets: minimum 48px for all interactive elements
- Alloy selector: horizontal scrollable rail on mobile
- All tap targets use `transition-smooth` for visual feedback

## Performance Notes

- **Infinite scroll** uses IntersectionObserver (efficient, native)
- **Debounced search** prevents excessive re-filtering (300ms)
- **Zustand** has selective subscriptions for optimized re-renders
- **Framer Motion** AnimatePresence for smooth image transitions
- **Skeleton loading** during car fetch (currently instant with mock data)

## Common Tasks

### Adding a New Car Make/Model
Edit `src/lib/mockData.ts`:
```typescript
export const makes = [
  { id: 'tesla', name: 'Tesla' },
  // ...existing makes
];

export const models = [
  { id: 'model-s', name: 'Model S', makeId: 'tesla' },
  // ...existing models
];
```

### Adding a New Filter
1. Add state to `src/stores/useCarStore.ts`
2. Add UI controls in `src/components/Filters.tsx`
3. Update `getCars()` filter logic in `src/lib/mockData.ts`

### Adding a New Route
In `src/App.tsx`, add ABOVE the `*` catch-all route:
```typescript
<Route path="/new-page" element={<NewPage />} />
```

### Extending Shadcn Components
DO NOT manually edit files in `src/components/ui/`. Use the shadcn CLI to add new components:
```bash
npx shadcn@latest add [component-name]
```
