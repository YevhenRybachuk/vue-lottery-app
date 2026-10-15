import { http } from '../api/http-client'
import type { AuthResponse, LoginCredentials, RefreshTokenResponse } from '../types/auth'
import type { User } from '../types/user'

export class AuthService {
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        return http<AuthResponse>('/auth/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        })
    }

    async getCurrentUser(): Promise<User> {
        return http<User>('/auth/me', {
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