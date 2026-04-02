# Lost & Found Network — Frontend

A centralized web-based platform for reporting, browsing, and claiming lost and found items across George Brown Polytechnic campuses.

Built with React + Vite for COMP 2154 (System Development Project).

## Team — Group 84

## Tech Stack

- **React 19** — UI framework
- **React Router v7** — client-side routing
- **Vite** — build tool and dev server
- **Vitest** — unit testing
- **CSS Modules** — scoped component styles

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/COMP2154-Lost-and-Found-Network/COMP2154-Lost-and-Found-Network-Frontend.git
cd COMP2154-Lost-and-Found-Network-Frontend
npm install
```

### Environment Setup

Copy the example env file:

```bash
cp .env.example .env
```

Environment files:

| File | Used by | API URL |
|---|---|---|
| `.env.development` | `npm run dev` | `http://localhost:3000/api` |
| `.env.production` | `npm run build` | Railway production URL |

Key variables:

| Variable | Description |
|---|---|
| `VITE_USE_MOCK_API` | `true` for mock data, `false` for real backend |
| `VITE_API_BASE_URL` | Backend API base URL |

### Running Locally

```bash
npm run dev
```

App runs at `http://localhost:5173/COMP2154-Lost-and-Found-Network/`

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── app/                  # App entry, routes, layout, providers
├── components/ui/        # Shared UI (Navbar, Footer, PageContainer)
├── context/              # Auth context and provider
├── services/             # HTTP client, auth storage
├── features/
│   ├── auth/             # Login, register pages and API
│   ├── items/            # Report, browse, dashboard, edit, item details
│   ├── claims/           # Submit claim, my claims, claim inbox, claim details
│   ├── admin/            # Admin dashboard, manage data, disputes
│   └── landing/          # Public landing page
└── styles/               # Global styles
```

## Core Workflows

1. **Authentication** — Register, login, logout, JWT-based session with auto-expiry detection
2. **Item Management** — Report lost/found items with images, browse with filters, edit, soft delete
3. **Claims & Verification** — Submit claims with evidence, approve/reject with feedback, withdraw, claim inbox for item owners
4. **Admin & Oversight** — Dashboard with stats, manage categories and locations, manage items
5. **Dispute Resolution** — Escalate contested claims, admin dispute inbox, side-by-side claim comparison, resolve with notes

## Deployment

The frontend is deployed on **Netlify**. Environment variables are set in the Netlify dashboard.

The backend is deployed on **Railway** at:
`https://comp2154-lost-and-found-network-backend-production.up.railway.app`

## Related Repositories

- **Backend**: [COMP2154-Lost-and-Found-Network-Backend](https://github.com/COMP2154-Lost-and-Found-Network/COMP2154-Lost-and-Found-Network-Backend)
