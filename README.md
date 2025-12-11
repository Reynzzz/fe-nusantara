# Golden Compass Club - Frontend

Frontend aplikasi Golden Compass Club menggunakan React, TypeScript, Redux Toolkit, dan React Router DOM.

## Teknologi yang Digunakan

- **React 18** - UI Library
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **React Router DOM** - Routing
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI Components

## Setup

1. Install dependencies:
```bash
npm install
```

2. Buat file `.env` dari `.env.example`:
```bash
cp .env.example .env
```

3. Edit file `.env` dan sesuaikan URL backend:
```env
VITE_API_URL=http://localhost:3000/api
```

4. Jalankan development server:
```bash
npm run dev
```

## Struktur Folder

```
src/
├── components/        # Komponen UI reusable
│   ├── admin/        # Komponen admin
│   └── ui/           # shadcn/ui components
├── hooks/            # Custom hooks
├── pages/            # Halaman aplikasi
│   ├── admin/        # Halaman admin
│   └── ...           # Halaman user
├── services/         # API services
├── store/            # Redux store
│   ├── slices/       # Redux slices
│   └── index.ts      # Store configuration
└── lib/              # Utility functions
```

## Redux Store

Aplikasi menggunakan Redux Toolkit untuk state management dengan slices:
- `eventsSlice` - Manajemen events
- `newsSlice` - Manajemen news/berita
- `productsSlice` - Manajemen products
- `aboutSlice` - Manajemen konten about

## API Integration

Semua API calls dilakukan melalui:
- `src/services/api.ts` - API service functions
- Redux async thunks untuk data fetching

## Build

```bash
npm run build
```

## Catatan

- Pastikan backend server sudah berjalan di `http://localhost:3000`
- Untuk production, update `VITE_API_URL` di `.env` dengan URL backend production
