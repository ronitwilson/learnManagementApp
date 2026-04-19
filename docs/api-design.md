# API Design — Learn Management App

## Overview

The backend is a REST API built with **Node.js** and **Express.js**. It handles user authentication via local credentials and optionally via Google OAuth 2.0. All protected operations use short-lived **JSON Web Tokens (JWT)**.

| Property | Value |
|---|---|
| Base URL | `http://localhost:3001` |
| API Prefix | `/api` |
| Content-Type | `application/json` |
| Auth Scheme | Bearer JWT |

---

## Authentication

After a successful login or registration the server returns a JWT. Include it in subsequent requests using the `Authorization` header:

```
Authorization: Bearer <token>
```

Tokens expire after **24 hours**. A new token must be obtained by logging in again.

---

## Environment Configuration

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3001` | Port the server listens on |
| `JWT_SECRET` | Yes (prod) | `dev-secret` | Secret used to sign JWT tokens |
| `FRONTEND_URL` | No | `http://localhost:5173` | Frontend origin for CORS and OAuth redirects |
| `ENABLE_GOOGLE_OAUTH` | No | `false` | Set to `"true"` to enable Google OAuth routes |
| `GOOGLE_CLIENT_ID` | If OAuth enabled | — | Google Cloud OAuth client ID |
| `GOOGLE_CLIENT_SECRET` | If OAuth enabled | — | Google Cloud OAuth client secret |

---

## Data Models

### Local User

```json
{
  "id": 1,
  "username": "alice",
  "password": "<bcrypt hash>",
  "provider": "local"
}
```

### Google OAuth User

```json
{
  "id": 2,
  "username": "Alice Smith",
  "googleId": "1234567890",
  "provider": "google"
}
```

> **Note:** `password` is never returned in API responses. Only `id` and `username` are exposed to clients.

### JWT Payload

```json
{
  "id": 1,
  "username": "alice",
  "iat": 1713484800,
  "exp": 1713571200
}
```

### Standard Success Response (auth endpoints)

```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "username": "alice"
  }
}
```

### Standard Error Response

```json
{
  "error": "Human-readable error message"
}
```

---

## Endpoints

### GET /api/config

Returns feature flags so the frontend can adapt its UI accordingly.

**Auth required:** No

**Response `200 OK`**
```json
{
  "googleOAuthEnabled": false
}
```

---

### POST /api/auth/register

Creates a new local user account and returns a JWT.

**Auth required:** No

**Request body**
```json
{
  "username": "alice",
  "password": "s3cr3t"
}
```

| Field | Type | Rules |
|---|---|---|
| `username` | string | Required |
| `password` | string | Required, minimum 4 characters |

**Response `201 Created`**
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "username": "alice"
  }
}
```

**Error responses**

| Status | Condition | `error` message |
|---|---|---|
| 400 | Missing username or password | `"Username and password are required"` |
| 400 | Password shorter than 4 characters | `"Password must be at least 4 characters"` |
| 409 | Username already taken | `"Username already taken"` |
| 500 | Unexpected server error | `"Internal server error"` |

---

### POST /api/auth/login

Authenticates an existing local user and returns a JWT.

**Auth required:** No

**Request body**
```json
{
  "username": "alice",
  "password": "s3cr3t"
}
```

**Response `200 OK`**
```json
{
  "token": "<jwt>",
  "user": {
    "id": 1,
    "username": "alice"
  }
}
```

**Error responses**

| Status | Condition | `error` message |
|---|---|---|
| 401 | User not found or wrong password | `"User not found"` / `"Incorrect password"` |
| 500 | Unexpected server error | `"Internal server error"` |

---

### GET /api/auth/google

> **Conditional** — only available when `ENABLE_GOOGLE_OAUTH=true`

Initiates the Google OAuth 2.0 authorization flow. Redirects the browser to Google's consent screen requesting `profile` and `email` scopes.

**Auth required:** No  
**Response:** `302 Redirect` → Google consent screen

---

### GET /api/auth/google/callback

> **Conditional** — only available when `ENABLE_GOOGLE_OAUTH=true`

OAuth callback handler. Google redirects here after the user grants (or denies) consent.

**Auth required:** No (handled by OAuth flow)

**On success — `302 Redirect`**

Redirects the browser to the frontend with the JWT and username in the query string:

```
{FRONTEND_URL}/login?token=<jwt>&username=<encoded-username>
```

**On failure — `302 Redirect`**

```
{FRONTEND_URL}/login?error=google_failed
```

---

## Error Code Reference

| HTTP Status | Meaning |
|---|---|
| 400 Bad Request | Missing or invalid request body fields |
| 401 Unauthorized | Invalid credentials |
| 409 Conflict | Resource already exists (e.g. duplicate username) |
| 500 Internal Server Error | Unexpected server-side failure |

---

## Notes

- **Data persistence:** The current implementation uses an **in-memory store** (`backend/store.js`). All data is lost on server restart. A persistent database (PostgreSQL, MongoDB, etc.) is required for production use.
- **Google OAuth:** Disabled by default. Set `ENABLE_GOOGLE_OAUTH=true` and provide valid Google Cloud credentials to enable the `/api/auth/google` routes.
- **CORS:** The server accepts requests from `FRONTEND_URL` (default `http://localhost:5173`) and `http://localhost:3010` with credentials enabled.
- **Password hashing:** bcryptjs with 10 salt rounds.
