# AGENTS.md — SMC Project Tracker

## Project Overview

Full-stack **MERN** application for Solapur Municipal Corporation (SMC) to track civic projects publicly and manage them via an admin panel. Embeds visually with SMC's existing website.

## Tech Stack

| Layer    | Technology                          |
|----------|--------------------------------------|
| Frontend | React 18 + Vite 5                   |
| Backend  | Node.js + Express 4                 |
| Database | MongoDB + Mongoose 8                |
| Auth     | JWT (jsonwebtoken + bcryptjs)       |
| HTTP     | Axios (interceptors for JWT)        |
| Forms    | react-hook-form                     |
| Charts   | recharts                            |
| Alerts   | react-toastify                      |
| Icons    | Font Awesome 6 (CDN)                |
| Fonts    | Noto Sans Devanagari + Roboto (CDN) |

## Project Structure

```
smc-project-tracker/
├── backend/
│   ├── config/db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js         # login, getMe, register
│   │   └── projectController.js      # CRUD + addUpdate
│   ├── middleware/authMiddleware.js   # JWT verify + role checks
│   ├── models/
│   │   ├── Project.js                # Full schema with auto projectId
│   │   └── User.js                   # bcrypt pre-save hook
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── projectRoutes.js
│   ├── seed.js                       # Superadmin + 5 sample projects
│   ├── server.js                     # Express entry point
│   ├── .env                          # PORT, MONGO_URI, JWT_SECRET
│   └── package.json
├── frontend/
│   ├── public/favicon_smc.png
│   ├── src/
│   │   ├── api/axios.js              # Axios instance + JWT interceptor
│   │   ├── context/AuthContext.jsx    # Auth state provider
│   │   ├── utils/format.js           # formatINR(), formatDate()
│   │   ├── components/
│   │   │   ├── Navbar.jsx/.css       # Two-tier SMC-style navbar
│   │   │   ├── Footer.jsx/.css       # Three-column govt footer
│   │   │   ├── ProjectCard.jsx/.css  # Public project card
│   │   │   ├── ProjectTable.jsx/.css # Admin project table
│   │   │   ├── StatusBadge.jsx/.css  # Color-coded status pill
│   │   │   ├── FilterBar.jsx         # Category/Status/Ward filters
│   │   │   └── ProtectedRoute.jsx    # Auth gate for /admin/*
│   │   ├── pages/
│   │   │   ├── Home.jsx/.css         # Landing: hero, stats, cards
│   │   │   ├── ProjectDetail.jsx/.css # Full project view + map + timeline
│   │   │   ├── Login.jsx/.css        # Employee ID + Password login
│   │   │   └── admin/
│   │   │       ├── Dashboard.jsx/.css      # Stats + quick actions
│   │   │       ├── ManageProjects.jsx/.css # Table + delete/add-update modals
│   │   │       ├── AddProject.jsx          # Form (shared with Edit)
│   │   │       ├── EditProject.jsx         # Re-exports AddProject
│   │   │       └── ProjectForm.css         # Form styling
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # Entry with BrowserRouter + AuthProvider
│   │   └── index.css                # CSS variables + global styles
│   ├── index.html                   # Font Awesome + Google Fonts CDN
│   ├── vite.config.js
│   └── package.json
├── .gitignore                       # node_modules, dist, .env
├── favicon_smc.png                  # SMC logo (also in frontend/public/)
├── AGENTS.md                        # This file
└── README.md
```

## Color Palette (SMC Website Match)

| Token               | Hex       | Usage                        |
|---------------------|-----------|------------------------------|
| `--color-primary`   | `#1a3c6e` | Headers, top bar, main nav   |
| `--color-accent`    | `#e87722` | Buttons, borders, highlights |
| `--color-green`     | `#2e7d32` | Completed/Active status      |
| `--color-bg`        | `#f5f5f5` | Page background              |
| `--color-card`      | `#ffffff` | Card backgrounds             |
| `--color-text`      | `#1a1a1a` | Primary text                 |
| `--color-text-muted`| `#555555` | Secondary text               |
| `--color-border`    | `#d0d0d0` | Dividers, input borders      |
| `--color-warning`   | `#f5a623` | Amber status (On Hold)       |
| `--color-danger`    | `#c0392b` | Red status (Cancelled)       |

## Authentication Flow

1. User clicks **Footer SMC logo** → navigates to `/login`
2. POST `/api/auth/login` with `employeeId` + `password`
3. Returns JWT token (7d expiry) + user object
4. Token stored in `localStorage` as `smc_token`
5. `AuthContext` provides `user`, `token`, `login()`, `logout()`, `isAuthenticated`, `isAdmin`, `isSuperAdmin`
6. `ProtectedRoute` wraps `/admin/*` — redirects to `/login` if not authenticated
7. Axios interceptor in `api/axios.js` auto-attaches `Authorization: Bearer <token>` header
8. On 401, clears token + redirects to `/login`

## Role-Based Access

- **viewer**: Can view public pages only (no admin access)
- **admin**: Can create/update projects, add updates. Protected by `requireAdmin` middleware.
- **superadmin**: Can delete projects + create users. Protected by `requireSuperAdmin` middleware.

## API Endpoints

### Auth (`/api/auth`)
| Method | Endpoint      | Auth        | Description                |
|--------|---------------|-------------|----------------------------|
| POST   | `/login`      | Public      | Login, returns JWT         |
| GET    | `/me`         | JWT         | Get current user info      |
| POST   | `/register`   | Superadmin  | Create new user            |

### Projects (`/api/projects`)
| Method | Endpoint         | Auth   | Description                       |
|--------|------------------|--------|-----------------------------------|
| GET    | `/`              | Public | List projects (filters + pagination) |
| GET    | `/:id`           | Public | Single project detail             |
| POST   | `/`              | Admin  | Create project (auto-generates projectId) |
| PUT    | `/:id`           | Admin  | Update project                    |
| DELETE | `/:id`           | SA     | Delete project                    |
| POST   | `/:id/updates`   | Admin  | Add update note to project        |

### Query Params for GET `/api/projects`
`?category=Road&status=In Progress&ward=Ward No. 5&search=hotgi&page=1&limit=10`

## Key Design Decisions

- **Project ID** auto-generated as `SMC-YYYY-NNN` via Mongoose `pre('save')` hook
- **Indian number formatting**: `formatINR()` shows ₹ Cr / ₹ L / ₹ with `en-IN` locale
- **Dates**: `formatDate()` shows Indian English format (e.g. "15 January 2024")
- **Admin Login** accessible only via clicking the **footer SMC logo** (intentional, no nav link)
- **Shared form**: AddProject and EditProject use the same component (EditProject re-exports AddProject)
- **CSS**: Plain CSS with CSS variables, no framework (SMC visual match)
- **Mobile responsive**: 3-col → 2-col → 1-col breakpoints at 768px and 480px
- **Home page data fetching**: Uses `useEffect` with `cancelled` flag cleanup to prevent stale state updates on unmounted components. Both projects + stats fetched via `Promise.all` for parallel requests. `search` is included in the dependency array to avoid stale closure bug when navigating back to Home.

## Routing (React Router v6)

| Path                     | Component      | Access  |
|--------------------------|----------------|---------|
| `/`                      | Home           | Public  |
| `/projects`              | Home (filtered)| Public  |
| `/about`                 | About          | Public  |
| `/projects/:id`          | ProjectDetail  | Public  |
| `/login`                 | Login          | Public  |
| `/admin/dashboard`       | Dashboard      | Auth    |
| `/admin/projects`        | ManageProjects | Auth    |
| `/admin/projects/add`    | AddProject     | Auth    |
| `/admin/projects/edit/:id` | EditProject  | Auth    |
| `*`                      | 404 Page       | Public  |

## How to Run

### Prerequisites
- Node.js 18+
- MongoDB (e.g., `docker run -d --name smc-mongo -p 27017:27017 mongo:7`)

### Backend
```bash
cd backend
npm install
npm run seed    # Creates superadmin + 5 sample projects
npm run dev     # Port 5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev     # Port 5173
```

### Default Credentials
- **Employee ID:** `SMC001`
- **Password:** `Admin@123`

## Environment Variables (`backend/.env`)

| Variable         | Default                                        |
|------------------|------------------------------------------------|
| `PORT`           | `5000`                                         |
| `MONGO_URI`      | `mongodb://localhost:27017/smc_projects`        |
| `JWT_SECRET`     | `your_super_secret_key_here`                   |
| `JWT_EXPIRES_IN` | `7d`                                           |
| `NODE_ENV`       | `development`                                  |

## .gitignore Rules

```
node_modules/
dist/
.env
```

## Logos

- **`favicon_smc.png`** — SMC logo, stored at project root AND in `frontend/public/`
- Used as favicon, in Navbar top bar, and in Footer first column
- Footer logo links to `/login`

## Notes for Future AI Agents

- Always update this file when making structural changes, adding routes, or changing auth logic
- Maintain the SMC color scheme (navy + orange + green) in any new components
- Use `formatINR()` for all monetary values shown to users
- Use `formatDate()` for all dates shown to users
- The admin login is intentionally hidden — only accessible via footer logo click
- CSS class naming: lowercase with hyphens (`.project-card`, `.filter-bar`)
- No CSS-in-JS or frameworks — all plain CSS with `:root` variables