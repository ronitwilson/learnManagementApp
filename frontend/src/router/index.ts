import { createRouter, createWebHistory } from 'vue-router'
import LoginPage from '../views/LoginPage.vue'
import DashboardPage from '../views/DashboardPage.vue'

const routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginPage,
        meta: { guest: true },
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardPage,
        meta: { requiresAuth: true },
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// Navigation guard
router.beforeEach((to, _from, next) => {
    const token = localStorage.getItem('jwt_token')

    if (to.meta.requiresAuth && !token) {
        next({ name: 'Login' })
    } else if (to.meta.guest && token) {
        next({ name: 'Dashboard' })
    } else {
        next()
    }
})

export default router
