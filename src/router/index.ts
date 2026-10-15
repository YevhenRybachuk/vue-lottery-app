import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('../pages/HomePage.vue'),
            meta: { title: 'Головна' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('../pages/AboutPage.vue'),
            meta: { title: 'Про автора' },
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('../pages/UsersPage.vue'),
            meta: { title: 'Користувачі', requiresAuth: true },
        },
        {
            path: '/users/create',
            name: 'user-create',
            component: () => import('../pages/UserCreatePage.vue'),
            meta: { title: 'Створення користувача', requiresAuth: true },
        },
        {
            path: '/users/:id',
            component: () => import('../layouts/UserLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'user-details',
                    component: () => import('../pages/UserDetailsPage.vue'),
                    props: true,
                    meta: { title: 'Деталі користувача', requiresAuth: true },
                },
                {
                    path: 'edit',
                    name: 'user-edit',
                    component: () => import('../pages/UserEditPage.vue'),
                    props: true,
                    meta: { title: 'Редагування користувача', requiresAuth: true },
                },
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../pages/LoginPage.vue'),
            meta: { title: 'Вхід', layout: 'auth' },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../pages/NotFoundPage.vue'),
            meta: { title: 'Сторінку не знайдено' },
        },
    ],
})

router.beforeEach((to) => {
    const authStore = useAuthStore()

    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
        return { name: 'login', query: { redirect: to.fullPath } }
    }
    if (to.name === 'login' && authStore.isAuthenticated) {
        return { name: 'users' }
    }
})

router.afterEach((to) => {
    document.title = `${String(to.meta.title ?? 'Vue Lottery App')} | Vue Lottery App`
})

export default router