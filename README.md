# GBV Reporting & Support — MERN Prototype (Clerk Authentication)

This repository is a MERN-stack prototype that lets communities report gender-based violence safely and gives administrators a Clerk-backed dashboard.

## Key Highlights

- **Secure submission flow** — Reporters can submit incidents with optional location and images. Clerk tokens and the reporter's user ID are sent along with each submission.
- **Modern admin experience** — The admin section now requires Clerk authentication before rendering the report list and shows a centered sign-in prompt for unauthenticated visitors.
- **Improved UX** — The Donate view now stays within the viewport, preview modals expand thumbnails, dark-mode contrast was tuned across the admin table, and primary call-to-actions remain legible on any theme.

## Backend

- `backend/server.js` sets up the Express API and connects to MongoDB via `backend/config/db.js`.
- The `Report` schema is implemented via Mongoose (`backend/models/Report.js`) and exposes POST `/api/reports` plus GET `/api/reports` in `backend/routes/routes.js`.
- Placeholder `verifyClerk` middleware verifies that a request carries an Authorization header and optionally exposes `x-user-id`; this should be replaced by the official Clerk SDK in production.

## Frontend

- Clerk integration lives in `frontend/src/main.jsx` (reads `VITE_CLERK_PUBLISHABLE_KEY`).
- Routes are defined in `frontend/src/App.jsx`; `/admin` is now guarded by a `SignedIn` block that either renders `ReportsList` or invites the user to sign in.
- The report form (`frontend/src/pages/ReportForm.jsx`) validates input, uploads previews, and posts to the backend. The success message is centered, and the textarea text is ensured to remain readable.
- `ReportsList` has refreshed styling: cards, refresh CTA, and modal interactions now use the dark theme consistently, with a reminder to click a title to view full details.
- Donate styles (image, layout) have been tuned to fit the viewport without compromising responsive behavior.

## Environment Variables

Create `.env` files for both services or provide their values through your shell.

Backend (`backend/.env`):

```
MONGO_URI=mongodb://127.0.0.1:27017/gbv_db
PORT=5000
# Optional: CLERK_API_KEY=your_clerk_api_key_here (for real server-side verification)
```

Frontend (`frontend/.env` or `.env.local`):

```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
VITE_API_BASE=http://localhost:5000
```

## Development

Start backend and frontend in two terminals.

Backend

```powershell
cd backend
npm install
# add your env vars
npm run dev
```

Frontend

```powershell
cd frontend
npm install
# ensure your Clerk key + API base are set
npm run dev
```

## Testing & Linting

Run `npm run lint` inside `frontend/` to check ESLint rules (note: there are existing errors in `MapView.jsx`, `ReportForm.jsx`, and an effect dependency warning in `ReportsList.jsx`).

## Recommended Improvements

- Replace the placeholder `verifyClerk` middleware with `@clerk/clerk-sdk-node` to validate tokens on the backend.
- Add role/access control to support counselor/admin workflows.
- Introduce tests (unit + end-to-end) for the API and critical user flows.
- Harden the backend (encryption, rate limiting) and add logging/monitoring for mayor alerts.
