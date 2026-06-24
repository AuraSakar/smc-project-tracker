# SMC Project Tracker

A full-stack MERN application for tracking civic projects of **Solapur Municipal Corporation (SMC)**.

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (running on localhost:27017)

## Setup

### Backend

```bash
cd backend
npm install
npm run seed    # Populate database with sample data
npm run dev     # Start server on port 5000
```

### Frontend

```bash
cd frontend
npm install
npm run dev     # Start dev server on port 5173
```

## Default Admin Credentials

| Field        | Value      |
|-------------|------------|
| Employee ID | `SMC001`   |
| Password    | `Admin@123`|

## Environment Variables (backend/.env)

| Variable         | Description                  | Default                                    |
|-----------------|------------------------------|--------------------------------------------|
| `PORT`          | Server port                  | `5000`                                     |
| `MONGO_URI`     | MongoDB connection string    | `mongodb://localhost:27017/smc_projects`    |
| `JWT_SECRET`    | JWT signing secret           | `your_super_secret_key_here`               |
| `JWT_EXPIRES_IN`| Token expiration duration    | `7d`                                       |
| `NODE_ENV`      | Environment mode             | `development`                              |

## Features

- **Public**: Browse projects by category, status, ward; search; pagination
- **Detail page**: Progress bar, budget breakdown, officials, map, timeline, images, documents
- **Admin panel**: Dashboard, CRUD projects, progress updates, user management
- **Authentication**: JWT-based login with role-based access (admin/superadmin/viewer)
- **Indian formatting**: INR amounts (₹ Cr/L) and Indian date format

## Tech Stack

- **Backend**: Node.js, Express, MongoDB/Mongoose, JWT, bcrypt
- **Frontend**: React, Vite, React Router, React Hook Form, Recharts, Axios
- **Styling**: Custom CSS with SMC color scheme (navy + orange + green)