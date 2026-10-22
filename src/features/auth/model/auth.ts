import { defineStore } from 'pinia'
import { storeToRefs } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import { useSessionStore, type AuthUser, type AuthService, type LoginCredentials } from '@/entities/session'
import type { User } from '@/entities/user'

export const useAuthStore = defineStore('auth', () => {
    const session = useSessionStore()
    const { user, accessToken, refreshToken, isAuthenticated } = storeToRefs(session)

    async function login(credentials: LoginCredentials) {
        const response = await ServiceProvider.get<AuthService>('auth').login(credentials)
        const { accessToken, refreshToken, ...user } = response
        session.setSession(accessToken, refreshToken, user)
        return response
    }

    async function fetchCurrentUser(): Promise<void> {
        if (!accessToken.value) return
        try {
            const user = await ServiceProvider.get<AuthService>('auth').getCurrentUser()
            session.setUser(user)
        } catch (error) {
            logout()
            throw error
        }
    }

    function setTokens(accessToken: string, refreshToken: string): void {
        session.setSession(accessToken, refreshToken, user.value ?? undefined)
    }

    function setUser(user: AuthUser | User): void {
        session.setUser(user as AuthUser)
    }

    function logout(): void {
        session.clearSession()
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
        setUser,
        clearAuth: logout,
    }
})
