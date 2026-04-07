# Deployment Notes

## Recommended Vercel Setup

Deploy the frontend and backend as two separate Vercel projects from the same GitHub repository.

### Frontend

- Root directory: `frontend`
- Framework preset: `Vite`
- Environment variable:
  - `VITE_API_URL=https://your-backend-url/api`

### Backend

- Root directory: `backend`
- Runtime: Python 3.11
- Environment variables:
  - `DATABASE_URL=...` for a real production database

## Important

The backend falls back to SQLite locally, and to `/tmp/rms.db` on Vercel if `DATABASE_URL` is not set. That fallback is only for smoke testing. For a real deployment, set `DATABASE_URL` to a hosted database.
