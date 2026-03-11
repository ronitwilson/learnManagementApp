Install backend dependencies in package.json — add express, passport, passport-local, passport-google-oauth20 (or GitHub OAuth), express-session, jsonwebtoken, cors, dotenv, and their @types/* dev deps.

Create backend entry + auth routes — create backend/src/index.ts (Express app setup with CORS, session middleware) and backend/src/routes/auth.ts with three routes:

POST /auth/login — Passport local strategy (username + password)
GET /auth/oauth/google — initiates OAuth2 redirect
GET /auth/oauth/google/callback — OAuth2 callback, issues JWT
Create Passport strategies config — backend/src/config/passport.ts defining LocalStrategy (validate user credentials, stub DB lookup for now) and GoogleStrategy (OAuth2 client ID/secret from .env).

Install frontend dependencies in package.json — add vue-router, axios, and @types/node.

Set up Vue Router — create frontend/src/router/index.ts with routes for /login and / (home/dashboard), and update main.ts to register the router plugin.

Create the Login page component — create frontend/src/views/LoginView.vue with:

A username/password form that POSTs to /auth/login via Axios
An "Login with Google" button that redirects to /auth/oauth/google
Basic validation and error display
Update App.vue to use <RouterView> instead of the default scaffold content.
Further Considerations
OAuth2 provider — Google OAuth2 is assumed; should it be GitHub or another provider instead?
JWT vs. sessions — The plan uses JWTs returned to the frontend (stored in localStorage or a cookie). Should it use server-side sessions instead?
User store / DB — Local strategy currently stubs the user lookup. Should a real DB (e.g., SQLite for dev) be wired in now, or is a hardcoded mock user acceptable for this step?