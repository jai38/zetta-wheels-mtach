# API Integration Documentation

## Overview
This document describes how the frontend (neowheels-wheel-match) is connected to the backend (wheel-match-admin-backend).

## Backend Configuration

### Backend Server
- **Location**: `C:\Users\malan\Documents\Sankalp\wheel-match-admin-backend`
- **Port**: 4001
- **Base URL**: `http://localhost:4001`

### Starting the Backend
```bash
cd C:\Users\malan\Documents\Sankalp\wheel-match-admin-backend
npm run dev
```

The backend should be running before starting the frontend.

## Frontend Configuration

### Environment Variables
The frontend uses a `.env` file located at the root:
```
VITE_API_BASE_URL=http://localhost:4001
```

### Starting the Frontend
```bash
cd C:\Users\malan\Documents\Sankalp\neowheels-wheel-match
npm run dev
```

## API Structure

### API Services
All API services are located in `src/lib/api/`:

1. **authService.ts** - Authentication APIs
   - `login(credentials)` - User login
   - `register(userData)` - User registration
   - `logout()` - User logout
   - `getProfile()` - Get current user profile
   - `isAuthenticated()` - Check if user is authenticated
   - `getStoredUser()` - Get stored user data

2. **carService.ts** - Car-related APIs
   - `getMakes(params)` - Get list of car makes
   - `getModels(params)` - Get list of car models
   - `getColors(params)` - Get list of colors
    - `getCars(params)` - Get list of cars with pagination and filters
   - `getCarById(id)` - Get single car details
   - `createCar(data)` - Create new car (admin)
   - `updateCar(id, data)` - Update car (admin)
   - `deleteCar(id)` - Delete car (admin)

3. **alloyService.ts** - Alloy-related APIs
   - `getAlloyDesigns(params)` - Get alloy designs
   - `getAlloyPCDs(params)` - Get alloy PCDs
   - `getAlloyFinishes(params)` - Get alloy finishes
   - `getAlloySizes(params)` - Get alloy sizes
   - `getAlloys(params)` - Get list of alloys with filters
   - `getAlloyById(id)` - Get single alloy details
   - `createAlloy(data)` - Create new alloy (admin)
   - `updateAlloy(id, data)` - Update alloy (admin)

### API Configuration
The API configuration is in `src/lib/api/config.ts`:
- Axios instance with interceptors
- Automatic token injection for authenticated requests
- Error handling for 401 responses
- API endpoint constants

### Types
All TypeScript types are defined in `src/lib/api/types.ts`:
- API response wrappers
- Entity types (Car, Alloy, Make, Model, Color, etc.)
- Query parameter types
- Pagination types

## Authentication

### Token Management
- Tokens are stored in `localStorage` under the key `auth_token`
- User data is stored in `localStorage` under the key `user`
- Tokens are automatically added to request headers via axios interceptors

### Protected Routes
All admin routes in the backend require authentication:
- `/api/v1/admin/car/*`
- `/api/v1/admin/cars/*`
- `/api/v1/admin/alloy/*`
- `/api/v1/admin/alloys/*`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/register` - Register
- `POST /api/auth/logout` - Logout (requires auth)
- `GET /api/auth/profile` - Get profile (requires auth)

### Car Master Data
- `GET /api/v1/admin/car/makes` - Get makes
- `POST /api/v1/admin/car/makes` - Create make (requires auth)
- `GET /api/v1/admin/car/models` - Get models
- `POST /api/v1/admin/car/models` - Create model (requires auth)
- `GET /api/v1/admin/car/colors` - Get colors
- `POST /api/v1/admin/car/colors` - Create color (requires auth)

### Cars
- `GET /api/v1/admin/cars` - List cars (supports filtering and pagination)
- `POST /api/v1/admin/cars` - Create car (requires auth)
- `GET /api/v1/admin/cars/:id` - Get car by ID
- `PUT /api/v1/admin/cars/:id` - Update car (requires auth)
- `DELETE /api/v1/admin/cars/:id` - Delete car (requires auth)

### Alloy Master Data
- `GET /api/v1/admin/alloy/designs` - Get alloy designs
- `POST /api/v1/admin/alloy/designs` - Create design (requires auth)
- `GET /api/v1/admin/alloy/pcds` - Get alloy PCDs
- `POST /api/v1/admin/alloy/pcds` - Create PCD (requires auth)
- `GET /api/v1/admin/alloy/finishes` - Get alloy finishes
- `POST /api/v1/admin/alloy/finishes` - Create finish (requires auth)
- `GET /api/v1/admin/alloy/sizes` - Get alloy sizes
- `POST /api/v1/admin/alloy/sizes` - Create size (requires auth)

### Alloys
- `GET /api/v1/admin/alloys` - List alloys (supports filtering by diameter, size, finish, etc.)
- `POST /api/v1/admin/alloys` - Create alloy (requires auth)
- `GET /api/v1/admin/alloys/:id` - Get alloy by ID
- `PUT /api/v1/admin/alloys/:id` - Update alloy (requires auth)

## Query Parameters

### Cars List
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `search` - Search term for model/make names
- `makeId` - Filter by make ID
- `modelId` - Filter by model ID
- `colorId` - Filter by color ID
- `isActive` - Filter by active status

### Alloys List
- `page` - Page number
- `limit` - Items per page
- `search` - Search term
- `designId` - Filter by design ID
- `pcdId` - Filter by PCD ID
- `finishId` - Filter by finish ID
- `sizeId` - Filter by size ID
- `diameter` - Filter by diameter (e.g., 19, 20, 21)
- `isActive` - Filter by active status

## Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  message: string;
  data?: any;
}
```

### List Responses
List endpoints include pagination data:

```typescript
{
  success: true,
  message: "Cars retrieved successfully",
  data: {
    cars: [...],
    pagination: {
      total: 100,
      page: 1,
      limit: 10,
      totalPages: 10
    }
  }
}
```

## Updated Components

### Pages
1. **Index.tsx** - Main page with car listing
   - Fetches makes, models, and cars from API
   - Implements pagination and filtering
   - Error handling for API failures

2. **CarDetail.tsx** - Car details page
   - Fetches car details by ID
   - Fetches compatible alloys based on car's wheel size
   - Displays car information from backend data

### Components
1. **CarCard.tsx** - Car card component
   - Updated to display car data from API (make, model, color)
   - Shows car image with fallback

### Store
1. **useCarStore.ts** - Zustand store
   - Updated to use number IDs instead of string IDs
   - Compatible with backend API integer IDs

## Data Flow

1. **On page load (Index.tsx)**:
   - Fetch makes list
   - Display cars grid (with filters applied)

2. **When user selects make**:
   - Fetch models for selected make
   - Clear model selection
   - Refresh cars list

3. **When user selects model**:
   - Refresh cars list with make and model filters

4. **When user enters search**:
   - Refresh cars list with search term

5. **On car card click**:
   - Navigate to car detail page

6. **On car detail page**:
   - Fetch car details by ID
   - Fetch compatible alloys based on car's default wheel size
   - Display car and alloy information

## Error Handling

- Network errors are caught and displayed to users
- 401 errors automatically clear auth tokens
- Error messages are shown in the UI
- Console logs for debugging

## CORS Configuration

The backend CORS is configured in `wheel-match-admin-backend/src/config/constants.ts` to allow requests from the frontend.

## Next Steps

To use the application:

1. **Start the backend**:
   ```bash
   cd C:\Users\malan\Documents\Sankalp\wheel-match-admin-backend
   npm run dev
   ```

2. **Ensure database is running** (MySQL on localhost:3306)

3. **Run migrations and seed data** (if not done):
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

4. **Start the frontend**:
   ```bash
   cd C:\Users\malan\Documents\Sankalp\neowheels-wheel-match
   npm run dev
   ```

5. **Access the application** at `http://localhost:5173` (or the port shown by Vite)

## Notes

- Authentication is required for all admin operations (create, update, delete)
- The frontend currently doesn't implement authentication UI, but the services are ready
- Make sure both backend and frontend are running simultaneously
- The backend runs on port 4001, frontend typically on 5173
- All IDs are integers in the backend, so the frontend uses number types
