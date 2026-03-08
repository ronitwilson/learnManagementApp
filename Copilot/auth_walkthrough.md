# Login System — Walkthrough

## What Was Built

### Backend (`backend/`)
| File | Purpose |
|---|---|
| [server.js](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/server.js) | Express server (port 3001) with Passport local + optional Google OAuth |
| [store.js](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/store.js) | In-memory user store (swap for a real DB later) |
| [routes/auth.js](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/routes/auth.js) | `/register`, `/login`, `/google`, `/google/callback` endpoints |
| [.env.example](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/.env.example) | Environment variables template |

**Key design:** Google OAuth is **optional** — controlled by `ENABLE_GOOGLE_OAUTH=true/false` in `.env`. The backend exposes `GET /api/config` returning `{"googleOAuthEnabled": true|false}` so the frontend can react.

### Frontend (`frontend/`)
| File | Purpose |
|---|---|
| [LoginPage.vue](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/views/LoginPage.vue) | Premium login/register form, conditionally shows Google button |
| [DashboardPage.vue](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/views/DashboardPage.vue) | Post-login landing with logout |
| [router/index.ts](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/router/index.ts) | Vue Router with auth navigation guards |
| [style.css](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/style.css) | Dark design system (Inter font, CSS vars, animated gradients) |

**Google OAuth toggle flow:** On mount, [LoginPage.vue](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/views/LoginPage.vue) calls `GET /api/config` — if `googleOAuthEnabled` is `false`, the Google button is hidden entirely.

### Node.js Upgrade
Upgraded from v16.20.0 → **v22.22.1** via `nvm` to satisfy Vite 6.x requirements.

---

## Verification Results

| Test | Result |
|---|---|
| `GET /api/config` | ✅ `{"googleOAuthEnabled":false}` |
| `POST /api/auth/register` (testuser/test1234) | ✅ Returns JWT + `{"id":1,"username":"testuser"}` |
| `POST /api/auth/login` (testuser/test1234) | ✅ Returns JWT + user object |
| Frontend serves at `:5173` | ✅ Vue SPA shell loads |
| Backend starts on `:3001` | ✅ No errors |

---

## How to Run

```bash
# Terminal 1 — Backend
cd backend && npm run dev

# Terminal 2 — Frontend
cd frontend && npm run dev
```

## Enabling Google OAuth

1. Set `ENABLE_GOOGLE_OAUTH=true` in `backend/.env`
2. Fill in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
3. Restart the backend — the Google sign-in button will appear automatically on the login page
