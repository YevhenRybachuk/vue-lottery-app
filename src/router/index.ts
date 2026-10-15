import { createRouter, createWebHistory } from 'vue-router'

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
            meta: { title: 'Користувачі' },
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('../pages/LoginPage.vue'),
            meta: { title: 'Вхід' },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('../pages/NotFoundPage.vue'),
            meta: { title: 'Сторінку не знайдено' },
        },
    ],
})

router.afterEach((to) => {
    document.title = `${String(to.meta.title ?? 'Vue Lottery App')} | Vue Lottery App`
})

export default router