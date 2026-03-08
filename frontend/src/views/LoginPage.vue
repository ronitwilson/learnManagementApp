<script setup lang="ts">
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter, useRoute } from 'vue-router'

const API = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const router = useRouter()
const route = useRoute()

const isLogin = ref(true)
const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const googleEnabled = ref(false)

// Check if Google OAuth is enabled from the backend
onMounted(async () => {
  try {
    const { data } = await axios.get(`${API}/api/config`)
    googleEnabled.value = data.googleOAuthEnabled
  } catch {
    googleEnabled.value = false
  }

  // Handle Google OAuth callback token in URL
  const token = route.query.token as string | undefined
  const user = route.query.username as string | undefined
  if (token && user) {
    localStorage.setItem('jwt_token', token)
    localStorage.setItem('username', user)
    router.replace({ name: 'Dashboard' })
  }

  // Handle Google OAuth errors
  const err = route.query.error as string | undefined
  if (err) {
    error.value = 'Google sign-in failed. Please try again.'
  }
})

async function handleSubmit() {
  error.value = ''
  if (!username.value.trim() || !password.value.trim()) {
    error.value = 'Please fill in all fields'
    return
  }
  loading.value = true
  try {
    const endpoint = isLogin.value ? '/api/auth/login' : '/api/auth/register'
    const { data } = await axios.post(`${API}${endpoint}`, {
      username: username.value.trim(),
      password: password.value,
    })
    localStorage.setItem('jwt_token', data.token)
    localStorage.setItem('username', data.user.username)
    router.push({ name: 'Dashboard' })
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Something went wrong'
  } finally {
    loading.value = false
  }
}

function signInWithGoogle() {
  window.location.href = `${API}/api/auth/google`
}

function toggleMode() {
  isLogin.value = !isLogin.value
  error.value = ''
}
</script>

<template>
  <div class="login-wrapper">
    <!-- Animated background orbs -->
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>
    <div class="bg-orb bg-orb-3"></div>

    <div class="login-card">
      <!-- Header -->
      <div class="card-header">
        <div class="logo-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
          </svg>
        </div>
        <h1>LearnHub</h1>
        <p class="subtitle">{{ isLogin ? 'Welcome back! Sign in to continue.' : 'Create your account to get started.' }}</p>
      </div>

      <!-- Error message -->
      <Transition name="fade">
        <div v-if="error" class="error-banner" id="error-banner">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          <span>{{ error }}</span>
        </div>
      </Transition>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="login-form">
        <div class="input-group">
          <label for="username">Username</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input
              id="username"
              v-model="username"
              type="text"
              placeholder="Enter your username"
              autocomplete="username"
            />
          </div>
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <svg class="input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter your password"
              autocomplete="current-password"
            />
          </div>
        </div>

        <button id="submit-btn" type="submit" class="btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner"></span>
          <span v-else>{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
        </button>
      </form>

      <!-- Google OAuth -->
      <div v-if="googleEnabled" class="divider">
        <span>or</span>
      </div>

      <button v-if="googleEnabled" id="google-btn" class="btn-google" @click="signInWithGoogle">
        <svg class="google-icon" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>

      <!-- Toggle -->
      <p class="toggle-text">
        {{ isLogin ? "Don't have an account?" : 'Already have an account?' }}
        <a href="#" @click.prevent="toggleMode" id="toggle-mode">{{ isLogin ? 'Sign up' : 'Sign in' }}</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
.login-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-primary);
}

/* ─── Animated Background Orbs ─── */
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.35;
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}
.bg-orb-1 {
  width: 500px; height: 500px;
  background: var(--accent-primary);
  top: -120px; left: -120px;
  animation-delay: 0s;
}
.bg-orb-2 {
  width: 400px; height: 400px;
  background: var(--accent-secondary);
  bottom: -100px; right: -100px;
  animation-delay: -7s;
}
.bg-orb-3 {
  width: 300px; height: 300px;
  background: var(--accent-tertiary);
  top: 50%; left: 60%;
  animation-delay: -14s;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.08); }
  66% { transform: translate(-30px, 20px) scale(0.94); }
}

/* ─── Card ─── */
.login-card {
  position: relative;
  width: 100%;
  max-width: 420px;
  padding: 2.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  z-index: 1;
}

/* ─── Header ─── */
.card-header {
  text-align: center;
  margin-bottom: 2rem;
}
.logo-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 16px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  margin-bottom: 1rem;
}
.logo-icon svg {
  width: 28px;
  height: 28px;
  color: #fff;
}
.card-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.4rem;
}
.subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin: 0;
}

/* ─── Error ─── */
.error-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.25);
  color: #f87171;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}
.error-banner svg {
  flex-shrink: 0;
  width: 18px;
  height: 18px;
}

/* ─── Form ─── */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}
.input-group label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.input-wrapper {
  position: relative;
}
.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: var(--text-muted);
  pointer-events: none;
}
.input-wrapper input {
  width: 100%;
  padding: 0.8rem 1rem 0.8rem 2.8rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  transition: border-color 0.2s, box-shadow 0.2s;
  outline: none;
  box-sizing: border-box;
}
.input-wrapper input::placeholder {
  color: var(--text-muted);
}
.input-wrapper input:focus {
  border-color: var(--accent-primary);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* ─── Submit ─── */
.btn-primary {
  width: 100%;
  padding: 0.85rem;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  color: #fff;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s, opacity 0.15s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}
.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.35);
}
.btn-primary:active:not(:disabled) {
  transform: translateY(0);
}
.btn-primary:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* ─── Spinner ─── */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Divider ─── */
.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}
.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
}
.divider span {
  color: var(--text-muted);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* ─── Google ─── */
.btn-google {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--input-bg);
  color: var(--text-primary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  transition: background 0.2s, border-color 0.2s;
}
.btn-google:hover {
  background: var(--border-color);
  border-color: var(--text-muted);
}
.google-icon {
  width: 20px;
  height: 20px;
}

/* ─── Toggle ─── */
.toggle-text {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.88rem;
  margin-top: 1.5rem;
}
.toggle-text a {
  color: var(--accent-primary);
  font-weight: 600;
  text-decoration: none;
  transition: color 0.15s;
}
.toggle-text a:hover {
  color: var(--accent-secondary);
}

/* ─── Transition ─── */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
