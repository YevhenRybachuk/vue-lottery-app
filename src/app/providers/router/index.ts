import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/features/auth'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/home').then((m) => m.HomePage),
            meta: { title: 'Р“РѕР»РѕРІРЅР°' },
        },
        {
            path: '/about',
            name: 'about',
            component: () => import('@/pages/about').then((m) => m.AboutPage),
            meta: { title: 'РџСЂРѕ Р°РІС‚РѕСЂР°' },
        },
        {
            path: '/users',
            name: 'users',
            component: () => import('@/pages/users').then((m) => m.UsersPage),
            meta: { title: 'РљРѕСЂРёСЃС‚СѓРІР°С‡С–', requiresAuth: true },
        },
        {
            path: '/users/create',
            name: 'user-create',
            component: () => import('@/pages/user-details').then((m) => m.UserCreatePage),
            meta: { title: 'РЎС‚РІРѕСЂРµРЅРЅСЏ РєРѕСЂРёСЃС‚СѓРІР°С‡Р°', requiresAuth: true },
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
                    meta: { title: 'Р”РµС‚Р°Р»С– РєРѕСЂРёСЃС‚СѓРІР°С‡Р°', requiresAuth: true },
                },
                {
                    path: 'edit',
                    name: 'user-edit',
                    component: () => import('@/pages/user-details').then((m) => m.UserEditPage),
                    props: true,
                    meta: { title: 'Р РµРґР°РіСѓРІР°РЅРЅСЏ РєРѕСЂРёСЃС‚СѓРІР°С‡Р°', requiresAuth: true },
                },
            ],
        },
        {
            path: '/login',
            name: 'login',
            component: () => import('@/pages/login').then((m) => m.LoginPage),
            meta: { title: 'Р’С…С–Рґ', layout: 'auth' },
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'not-found',
            component: () => import('@/pages/not-found').then((m) => m.NotFoundPage),
            meta: { title: 'РЎС‚РѕСЂС–РЅРєСѓ РЅРµ Р·РЅР°Р№РґРµРЅРѕ' },
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