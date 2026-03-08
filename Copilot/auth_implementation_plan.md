# Login System — Username/Password + Google OAuth

Add a full authentication flow to the Learn Management App: a polished Vue 3 login/register page on the frontend, backed by a Node.js/Express API with JWT-based local login and Google OAuth via Passport.js.

## User Review Required

> [!IMPORTANT]
> **Google OAuth credentials required.** You will need to create a Google Cloud project and obtain a Client ID + Client Secret. The backend will read them from a `.env` file. I'll generate a `.env.example` so you know what to fill in.

> [!NOTE]
> The backend stores users **in-memory** (a simple array) for now. This is suitable for development; swap with a database (MongoDB, PostgreSQL, etc.) when ready for production.

---

## Proposed Changes

### Backend (`backend/`)

#### [NEW] [server.js](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/server.js)
- Express server on port `3001`
- CORS configured for the frontend origin (`http://localhost:5173`)
- `express.json()` body parser
- Passport.js initialised with Google OAuth 2.0 strategy + local strategy
- Mounts `/api/auth` routes

#### [NEW] [routes/auth.js](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/routes/auth.js)
| Route | Method | Purpose |
|---|---|---|
| `/api/auth/register` | POST | Register a new user (username + password, bcrypt hashed) |
| `/api/auth/login` | POST | Login with username + password → returns JWT |
| `/api/auth/google` | GET | Redirect to Google OAuth consent screen |
| `/api/auth/google/callback` | GET | Google callback → creates/finds user → returns JWT via redirect |

#### [NEW] [.env.example](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/.env.example)
```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
JWT_SECRET=your-jwt-secret
```

#### [MODIFY] [package.json](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/backend/package.json)
- Add dependencies: `express`, `cors`, `bcryptjs`, `jsonwebtoken`, `passport`, `passport-google-oauth20`, `dotenv`
- Add scripts: `"start": "node server.js"`, `"dev": "node --watch server.js"`

---

### Frontend (`frontend/`)

#### [NEW] [src/views/LoginPage.vue](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/views/LoginPage.vue)
- Premium dark-themed login/register form with animated gradient background
- Toggle between Login and Register modes
- Username + password fields
- "Sign in with Google" button that redirects to the backend's Google OAuth route
- Calls the backend API via `axios` for local login/register

#### [NEW] [src/views/DashboardPage.vue](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/views/DashboardPage.vue)
- Simple post-login dashboard showing the logged-in username
- Logout button that clears the JWT and redirects to login

#### [NEW] [src/router/index.ts](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/router/index.ts)
- `/login` → LoginPage (public)
- `/dashboard` → DashboardPage (requires JWT in localStorage)
- Navigation guard redirects unauthenticated users to `/login`

#### [MODIFY] [src/main.ts](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/main.ts)
- Mount Vue Router

#### [MODIFY] [src/App.vue](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/App.vue)
- Replace content with `<router-view />`

#### [MODIFY] [src/style.css](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/src/style.css)
- Replace default Vite styles with a modern design system (Google Fonts, CSS variables, animated gradients)

#### [MODIFY] [package.json](file:///home/ronit/workspace/fullstack/app2/learnManagementApp/frontend/package.json)
- Add dependencies: `vue-router`, `axios`

---

## Verification Plan

### Automated Tests
1. **Backend starts cleanly:**
   ```bash
   cd /home/ronit/workspace/fullstack/app2/learnManagementApp/backend && npm install && node -e "require('./server.js')"
   ```
   Expect: No crash; server listens on port 3001.

2. **Frontend builds without errors:**
   ```bash
   cd /home/ronit/workspace/fullstack/app2/learnManagementApp/frontend && npm install && npm run build
   ```
   Expect: Successful build output in `dist/`.

### Browser Verification
3. **Login page renders:** Navigate to `http://localhost:5173/login` and verify:
   - Username and password input fields are visible
   - Login / Register toggle works
   - "Sign in with Google" button is visible
   - Submitting empty fields shows validation feedback

4. **Local login flow:** Register a test user, then login → should redirect to `/dashboard` with the username displayed.

### Manual Verification
5. **Google OAuth** (requires real credentials in `.env`): Click the Google button → should redirect to Google consent → on return, user lands on dashboard. _This step only works once you configure your `.env`._
