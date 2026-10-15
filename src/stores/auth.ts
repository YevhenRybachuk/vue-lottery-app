import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { AuthUser, LoginCredentials } from '../types/auth'
import type { User } from '../types/user'

export const useAuthStore = defineStore('auth', () => {
    const user = ref<AuthUser | null>(
        JSON.parse(localStorage.getItem('auth_user') || 'null')
    )
    const accessToken = ref<string | null>(
        localStorage.getItem('access_token')
    )
    const refreshToken = ref<string | null>(
        localStorage.getItem('refresh_token')
    )

    const isAuthenticated = computed(() => Boolean(accessToken.value))

    function setTokens(access: string, refresh: string) {
        accessToken.value = access
        refreshToken.value = refresh
        localStorage.setItem('access_token', access)
        localStorage.setItem('refresh_token', refresh)
    }

    function setUser(userData: AuthUser | User) {
        user.value = userData as AuthUser
        localStorage.setItem('auth_user', JSON.stringify(userData))
    }

    function clearAuth() {
        user.value = null
        accessToken.value = null
        refreshToken.value = null
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('auth_user')
    }

    async function login(credentials: LoginCredentials) {
        const response = await ServiceProvider.auth.login(credentials)
        const { accessToken: access, refreshToken: refresh, ...userData } = response

        setTokens(access, refresh)
        setUser(userData)
        return response
    }

    async function fetchCurrentUser() {
        if (!accessToken.value) return
        try {
            const currentUser = await ServiceProvider.auth.getCurrentUser()
            setUser(currentUser)
        } catch {
            logout()
        }
    }

    function logout() {
        clearAuth()
    }

    return {
        user,
        accessToken,
        refreshToken,
        isAuthenticated,
        login,
        logout,
        fetchCurrentUser,
        setTokens,
        clearAuth
    }
})