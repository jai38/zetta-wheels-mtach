# Premium Car Configurator - Developer Guide

A modern, high-quality car shopping prototype with real-time wheel/alloy customization and color visualization.

## Tech Stack

- **React 18** + TypeScript
- **Tailwind CSS** with custom design tokens
- **React Query** for data fetching & caching
- **Zustand** for lightweight UI state management
- **Framer Motion** for smooth animations
- **Headless UI** for accessible components
- **React Router** for navigation

## Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The app will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── CarCard.tsx     # Individual car listing card
│   ├── DependentSelect.tsx  # Make/Model dropdown
│   ├── Filters.tsx     # Filter sidebar/sheet
│   ├── InfiniteGrid.tsx    # Infinite scroll grid
│   └── SearchInput.tsx # Debounced search
├── stores/
│   └── useCarStore.ts  # Zustand state management
├── lib/
│   ├── mockData.ts     # Mock API & data structures
│   └── utils.ts        # Utility functions
├── pages/
│   ├── Index.tsx       # Catalog/landing page
│   ├── CarDetail.tsx   # Car configurator page
│   └── NotFound.tsx    # 404 page
└── index.css           # Design system tokens

```

## Design System

The app uses a premium dark theme with warm metallic accents defined in `src/index.css`:

### Color Tokens
- **Primary**: Warm bronze/copper (`hsl(25 75% 55%)`)
- **Background**: Deep charcoal (`hsl(222 20% 8%)`)
- **Card**: Elevated surfaces (`hsl(222 18% 12%)`)
- **Accent**: Same as primary for CTAs

### Typography
- **Headings**: Playfair Display (serif) - elegant, premium feel
- **Body**: Inter - clean, modern readability

### Shadows & Effects
- `shadow-soft`: Subtle elevation
- `shadow-elevated`: Medium elevation for cards
- `shadow-premium`: Maximum depth for important elements

All design tokens are defined as CSS variables and mapped to Tailwind utilities in `tailwind.config.ts`.

## Key Features

### Catalog Page (`/`)
- **Dependent Selects**: Make → Model (changing Make reloads Models)
- **Debounced Search**: 300ms delay on input
- **Infinite Scroll**: Auto-loads more results using IntersectionObserver
- **Collapsible Filters**: Sidebar on desktop, bottom sheet on mobile
  - Color filter
  - Alloy size filter (19", 20", 21")
  - Finish filter (Gloss, Matte, Polished, Carbon)

### Car Detail Page (`/cars/:id`)
- **Real-time Visualization**: Instant image swaps when selecting:
  - Car colors (circular color swatches)
  - Alloy wheels (horizontal scrollable rail)
- **Progressive Image Loading**: Crossfade transitions with loading states
- **Configuration Summary**: Shows current selections + pricing
- **Mobile Optimized**: Touch-friendly controls, responsive layout

## Mock Data & API Simulation

All data is currently mocked in `src/lib/mockData.ts`:

### Available Functions
```typescript
getMakes()              // Returns all makes
getModelsByMake(makeId) // Returns models for a make
getCars(filters)        // Returns paginated, filtered cars
getCarById(id)          // Returns single car details
getAlloysByCar(carId)   // Returns available alloys for a car
```

### Mock Data Structure
```typescript
interface Car {
  id: string;
  title: string;
  makeId: string;
  modelId: string;
  price: number;
  baseImagePath: string;
  thumbnailPath: string;
  colors: Color[];
  alloyIds: string[];
  specs: { engine, power, transmission };
}
```

## State Management

Using Zustand for minimal, fast state:

```typescript
// Access in any component
const { selectedMake, setSelectedMake } = useCarStore();
```

**Key State:**
- Make/Model/Search selections
- Filter states (color, alloy size, finish)
- Current car color & alloy selections

## Image Strategy

### Current Implementation (Mock)
- Using placeholder images via `/api/placeholder`
- All images swap instantly on selection

### Production Strategy (Documented)

**Option 1: Layered Compositing** (Recommended for flexibility)
```
S3 Structure:
base/{carId}.png          // Car body without color
color/{carId}_{colorId}.png  // Color overlay
alloy/{alloyId}.svg       // Wheel overlay
```

Client-side composite: Layer base + color + alloy in canvas/CSS

**Option 2: Pre-rendered Composites** (Recommended for performance)
```
S3 CDN template:
https://cdn.example.com/cars/{carId}/{colorId}/{alloyId}.webp
```

Fallback logic if layers aren't available.

**Image Optimization:**
- Use WebP/AVIF with fallbacks
- Implement responsive `srcset` & `sizes`
- Prefetch next likely alloys (currently selected ± 2)
- Blur-up placeholders with CSS

## Mobile-First Considerations

- **Touch Gestures**: Horizontal swipe through alloy cards
- **Responsive Breakpoints**: Single column → 2-col → 3-col grid
- **Bottom Sheet Filters**: Accessible thumb-reach zones on mobile
- **Large Tap Targets**: 48px minimum for touch elements
- **Device Rotation Hint**: (Not yet implemented - see TODOs)

## Performance

- **Intersection Observer** for infinite scroll
- **Debounced Search** prevents excessive filtering
- **Skeleton Loading** during data fetch
- **Cancel Stale Requests** when filters change
- **Optimized Re-renders** with Zustand selective subscriptions

## Accessibility

- **Keyboard Navigation**: All dropdowns, filters navigable via keyboard
- **ARIA Labels**: Proper roles and labels on interactive elements
- **Focus Management**: Visible focus indicators
- **Color Contrast**: WCAG AA compliant (light text on dark BG)

## TODOs for Production

### High Priority
1. **Real API Integration**: Replace mock data with actual endpoints
2. **Image CDN Setup**: Configure S3 + CloudFront
3. **Layered Image Compositing**: Implement canvas/SVG layering
4. **Image Prefetching**: Preload next alloys for instant swaps
5. **Error Boundaries**: Graceful error handling

### Medium Priority
6. **Touch Gestures**: Pinch-to-zoom, two-finger pan on car image
7. **Device Rotation Hint**: Show once per session on narrow screens
8. **SEO Optimization**: Add structured data (JSON-LD), meta tags
9. **Analytics**: Track user interactions, popular configurations
10. **Loading States**: More sophisticated skeleton screens

### Nice to Have
11. **360° View**: Rotating car preview
12. **Compare Feature**: Side-by-side car comparison
13. **Save Configuration**: Persist user's build in localStorage/backend
14. **Share Configuration**: Generate shareable URLs
15. **Unit Tests**: Add test coverage for key components

## Extending the App

### Adding New Filters
1. Update `useCarStore` with new filter state
2. Add UI in `Filters.tsx`
3. Update `getCars` logic in `mockData.ts`

### Adding New Makes/Models
Simply extend the arrays in `src/lib/mockData.ts`:
```typescript
export const makes = [
  { id: 'ferrari', name: 'Ferrari' },
  // ...
];
```

### Switching to Real API
Replace the imports in pages with React Query hooks:
```typescript
const { data: makes } = useQuery(['makes'], fetchMakes);
```

## Design Decisions

### Why Zustand over Redux?
- Minimal boilerplate
- No provider wrapper needed
- Perfect for simple UI state
- Fast and lightweight

### Why Headless UI over Radix?
- Official Tailwind team recommendation
- Minimal styling, maximum flexibility
- Smaller bundle size

### Why Mock Data in Code?
- Enables immediate local development
- Easy to demo without backend
- Clear data structure documentation
- Simple to swap for real API later

## Troubleshooting

**Issue**: Infinite scroll not working
- Check browser console for IntersectionObserver errors
- Ensure `hasMore` prop is correctly set

**Issue**: Images not loading
- Verify placeholder API is accessible
- Check network tab for CORS issues

**Issue**: Filters not applying
- Confirm Zustand store updates correctly
- Check `getCars` filter logic in mockData.ts

## License & Credits

Built with modern web technologies. Uses Google Fonts (Playfair Display, Inter).

---

**Ready to extend this prototype?** Start by connecting real APIs and S3 assets. The architecture is designed to scale from prototype to production.
