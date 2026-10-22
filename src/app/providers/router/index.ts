import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/home').then((m) => m.HomePage),
            meta: { title: 'Головна' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/pages/about').then((m) => m.AboutPage),
            meta: { title: 'Про автора' },
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('@/pages/users').then((m) => m.UsersPage),
            meta: { title: 'Користувачі', requiresAuth: true },
        },
        {
            path: '/users/create',
            name: 'user-create',
            component: () => import('@/pages/user-details').then((m) => m.UserCreatePage),
            meta: { title: 'Створення користувача', requiresAuth: true },
        },
        {
            path: '/users/:id',
            component: () => import('@/app/layouts/UserLayout.vue'),
            children: [
                {
                    path: '',
                    name: 'user-details',
                    component: () => import('@/pages/user-details').then((m) => m.UserDetailsPage),
                    props: true,
                    meta: { title: 'Деталі користувача', requiresAuth: true },
                },
                {
                    path: 'edit',
                    name: 'user-edit',
                    component: () => import('@/pages/user-details').then((m) => m.UserEditPage),
                    props: true,
                    meta: { title: 'Редагування користувача', requiresAuth: true },
                },
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/login').then((m) => m.LoginPage),
            meta: { title: 'Вхід', layout: 'auth' },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
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