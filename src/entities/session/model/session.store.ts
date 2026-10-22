import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthUser } from './types'

const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'auth_user'

function readUser(): AuthUser | null {
    try {
        const value = localStorage.getItem(USER_KEY)
        return value ? JSON.parse(value) as AuthUser : null
    } catch {
        return null
    }
}

export const useSessionStore = defineStore('session', () => {
    const accessToken = ref<string | null>(localStorage.getItem(TOKEN_KEY))
    const refreshToken = ref<string | null>(localStorage.getItem(REFRESH_TOKEN_KEY))
    const user = ref<AuthUser | null>(readUser())
    const isAuthenticated = computed(() => accessToken.value !== null)

    function setSession(access: string, refresh: string, currentUser?: AuthUser): void {
        accessToken.value = access
        refreshToken.value = refresh
        localStorage.setItem(TOKEN_KEY, access)
        localStorage.setItem(REFRESH_TOKEN_KEY, refresh)

        if (currentUser) setUser(currentUser)
    }

    function setUser(currentUser: AuthUser): void {
        user.value = currentUser
        localStorage.setItem(USER_KEY, JSON.stringify(currentUser))
    }

    function clearSession(): void {
        accessToken.value = null
        refreshToken.value = null
        user.value = null
        localStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        localStorage.removeItem(USER_KEY)
    }

    return { accessToken, refreshToken, user, isAuthenticated, setSession, setUser, clearSession }
})
