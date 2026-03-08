<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')

onMounted(() => {
  username.value = localStorage.getItem('username') || 'User'
})

function logout() {
  localStorage.removeItem('jwt_token')
  localStorage.removeItem('username')
  router.push({ name: 'Login' })
}
</script>

<template>
  <div class="dashboard-wrapper">
    <!-- Background orbs (same as login for visual continuity) -->
    <div class="bg-orb bg-orb-1"></div>
    <div class="bg-orb bg-orb-2"></div>

    <div class="dashboard-card">
      <div class="avatar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>

      <h1>Welcome, <span class="highlight">{{ username }}</span> 👋</h1>
      <p class="subtext">You're now signed into LearnHub.</p>

      <div class="info-cards">
        <div class="info-card">
          <div class="info-icon courses-icon">📚</div>
          <div>
            <span class="info-label">My Courses</span>
            <span class="info-value">0 enrolled</span>
          </div>
        </div>
        <div class="info-card">
          <div class="info-icon progress-icon">📊</div>
          <div>
            <span class="info-label">Progress</span>
            <span class="info-value">Nothing yet</span>
          </div>
        </div>
      </div>

      <button id="logout-btn" class="btn-logout" @click="logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>
    </div>
  </div>
</template>

<style scoped>
.dashboard-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: var(--bg-primary);
}
.bg-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.3;
  animation: float 20s ease-in-out infinite;
  pointer-events: none;
}
.bg-orb-1 {
  width: 450px; height: 450px;
  background: var(--accent-primary);
  top: -80px; right: -80px;
}
.bg-orb-2 {
  width: 350px; height: 350px;
  background: var(--accent-tertiary);
  bottom: -60px; left: -60px;
  animation-delay: -10s;
}
@keyframes float {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(40px, -30px) scale(1.08); }
  66% { transform: translate(-30px, 20px) scale(0.94); }
}

.dashboard-card {
  position: relative;
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background: var(--card-bg);
  border: 1px solid var(--border-color);
  border-radius: 20px;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  text-align: center;
  z-index: 1;
}

.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  margin-bottom: 1.25rem;
}
.avatar svg {
  width: 36px;
  height: 36px;
  color: #fff;
}

.dashboard-card h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.4rem;
}
.highlight {
  background: linear-gradient(135deg, var(--accent-primary), var(--accent-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.subtext {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin: 0 0 2rem;
}

.info-cards {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
}
.info-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  border-radius: 14px;
  background: var(--input-bg);
  border: 1px solid var(--border-color);
  text-align: left;
}
.info-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}
.info-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 600;
}
.info-value {
  display: block;
  font-size: 0.9rem;
  color: var(--text-primary);
  font-weight: 500;
}

.btn-logout {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 12px;
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background 0.2s, border-color 0.2s;
}
.btn-logout:hover {
  background: rgba(239, 68, 68, 0.16);
  border-color: rgba(239, 68, 68, 0.5);
}
.btn-logout svg {
  width: 18px;
  height: 18px;
}
</style>
