import { http } from '@/shared/api'
import type { AuthResponse, LoginCredentials, RefreshTokenResponse } from '@/entities/session'
import type { AuthUser } from '../model/types'

export class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return http<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        })
    }

    async getCurrentUser(): Promise<AuthUser> {
        return http<AuthUser>('/auth/me', {
            method: 'GET'
        })
    }

    async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
        return http<RefreshTokenResponse>('/auth/refresh', {
            method: 'POST',
            body: JSON.stringify({
                refreshToken,
                expiresInMins: 60
            })
        })
    }
}