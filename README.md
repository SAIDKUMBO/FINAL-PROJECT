# GBV Reporting & Support — MERN Prototype (Clerk Authentication)

This repository is a prototype for a Gender-Based Violence (GBV) reporting and support platform (MERN stack) with Clerk authentication on the frontend.

What I added in this change:

- Backend
  - Express server at `backend/server.js` with MongoDB connection (`backend/config/db.js`).
  - Mongoose `Report` model (`backend/models/Report.js`).
  - API routes at `backend/routes/routes.js` with POST `/api/reports` and GET `/api/reports`.
  - A lightweight placeholder `verifyClerk` middleware that requires an Authorization header and accepts an `x-user-id` header for the reporter id. Replace this with real Clerk server-side verification for production.

- Frontend
  - Clerk integration using `@clerk/clerk-react` in `frontend/src/main.jsx` (reads `VITE_CLERK_PUBLISHABLE_KEY`).
  - App routing and SignIn UI (`frontend/src/App.jsx`).
  - Report form page at `frontend/src/pages/ReportForm.jsx` that posts to the backend and includes Clerk token and user id headers when available.

Environment variables

Create a `.env` (backend) and `.env.local` (frontend for Vite) or set env vars in your environment.

Backend (.env):

MONGO_URI=mongodb://127.0.0.1:27017/gbv_db
PORT=5000
# Optional (for full Clerk verification):
CLERK_API_KEY=your_clerk_api_key_here

Frontend (Vite): in `.env` or `.env.local` at `frontend/` root:

  VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
  VITE_API_BASE=http://localhost:5000

Notes on Clerk verification (backend)

The repository uses a placeholder middleware (`verifyClerk`) that currently only enforces the presence of an Authorization header.
For production you should install the official Clerk server SDK (`@clerk/clerk-sdk-node`) and verify the token on protected routes. Example steps:

1. Install: `npm install @clerk/clerk-sdk-node` in `back-end`
2. Use Clerk's SDK to verify session tokens in `verifyClerk` and attach the authenticated user ID to `req.user`.

Quick run (development)

Start the two services separately (recommended). Open two terminals.

1) Backend

```powershell
cd backend
npm install
# create a .env file with at least MONGO_URI (see above)
npm run dev    # or: npm start
```

2) Frontend

```powershell
cd frontend
npm install
# create a .env or .env.local with VITE_CLERK_PUBLISHABLE_KEY and optionally VITE_API_BASE
npm run dev
```

If you prefer a single command to run both (not included by default), you can open two terminals and run the two commands above in parallel.

Next steps (recommended)

- Replace placeholder `verifyClerk` with real Clerk token verification on the server.
- Add role management for counselors/admins and an admin dashboard.
- Add encryption-at-rest and other security/hardening measures for sensitive reports.
- Add tests for the API routes and a small Cypress / Playwright flow for the front-end.
