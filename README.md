# HRMS Lite - Frontend

Frontend for the HRMS Lite application built with React and Vite. It provides a clean dashboard interface for managing employees and tracking daily attendance.

## Tech Stack

- **React 19** with React Router v7 for client-side routing
- **Vite 7** for fast dev server and optimized builds
- **Tailwind CSS v4** for utility-first styling
- **Axios** for API communication
- **Lucide React** for icons
- **React Hot Toast** for toast notifications

## Getting Started

### Prerequisites

- Node.js >= 18
- Backend API running (see [backend README](../backend/README.md))

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:8000
```

If not set, it defaults to the production API URL.

### Running the Dev Server

```bash
npm run dev
```

App will be available at `http://localhost:5173`.

## Project Structure

```
src/
├── api/          # Axios config
├── components/   # Reusable UI components (forms, lists, layout)
│   └── ui/       # Small shared components (spinner, empty state, error)
├── pages/        # Route-level page components
├── App.jsx       # Route definitions
├── main.jsx      # Entry point
└── index.css     # Global styles
```

## Available Scripts

- `npm run dev` - Start dev server
- `npm run build` - Production build
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Key Features

- **Dashboard** - Shows today's attendance summary (present, absent, not marked)
- **Employee Management** - Add, view, and manage employee records
- **Attendance Tracking** - Mark daily attendance with date and status filters
- **Future Date Restriction** - Users cannot mark attendance for future dates (validated on both frontend and backend)
