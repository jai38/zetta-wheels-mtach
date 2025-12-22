# AI Readme - NeoWheels Wheel Match

## Project Overview
This project is a React-based web application for matching wheels (alloys) to cars. It appears to be a customer-facing frontend ("NeoWheels").

## Tech Stack
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS, shadcn-ui (using `class-variance-authority`, `clsx`, `tailwind-merge`)
- **State Management:** Zustand, React Query (@tanstack/react-query)
- **Routing:** React Router DOM (v6)
- **Forms:** React Hook Form + Zod
- **Icons:** Lucide React
- **HTTP Client:** Axios

## Key Directories
- `src/components`: UI components (likely shadcn-ui primitives in `src/components/ui`).
- `src/pages`: Main application pages (`Index`, `CarDetail`, `NotFound`).
- `src/lib`: Utilities and API configurations.
- `src/stores`: Global state management (Zustand).
- `src/hooks`: Custom React hooks.

## Key Files
- `src/App.tsx`: Main application entry point, defines routes.
- `src/main.tsx`: Root render.
- `src/lib/utils.ts`: Utility functions (specifically `cn` for class merging).

## Routing
- `/`: Home page (`Index`)
- `/cars/:id`: Car detail page
- `*`: Not Found

## Development
- `npm run dev`: Start development server.
- `npm run build`: Build for production.
