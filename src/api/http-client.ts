const BASE_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com'

type TokensRefreshedCallback = (tokens: { accessToken: string; refreshToken: string }) => void

let onTokensRefreshedCallback: TokensRefreshedCallback | null = null
let refreshPromise: Promise<string> | null = null

export function onTokensRefreshed(cb: TokensRefreshedCallback) {
    onTokensRefreshedCallback = cb
}

function clearSessionAndRedirect() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('refresh_token')
    localStorage.removeItem('auth_user')
    const baseUrl = import.meta.env.BASE_URL || '/'
    const loginUrl = baseUrl.endsWith('/') ? `${baseUrl}login` : `${baseUrl}/login`
    window.location.href = loginUrl
}

async function performTokenRefresh(): Promise<string> {
    const refreshToken = localStorage.getItem('refresh_token')

    if (!refreshToken) {
        clearSessionAndRedirect()
        throw new Error('No refresh token available')
    }

    try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken, expiresInMins: 60 })
        })

        if (!refreshResponse.ok) {
            clearSessionAndRedirect()
            throw new Error('Failed to refresh token')
        }

        const data = await refreshResponse.json()
        localStorage.setItem('access_token', data.accessToken)
        localStorage.setItem('refresh_token', data.refreshToken)

        if (onTokensRefreshedCallback) {
            onTokensRefreshedCallback({
                accessToken: data.accessToken,
                refreshToken: data.refreshToken
            })
        }

        return data.accessToken
    } catch (err) {
        clearSessionAndRedirect()
        throw err
    }
}

export async function http<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    let token = localStorage.getItem('access_token')

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>)
    }

    if (token) {
        headers['Authorization'] = `Bearer ${token}`
    }

    let response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers
    })

    if (response.status === 401 && !path.includes('/auth/login') && !path.includes('/auth/refresh')) {
        if (!refreshPromise) {
            refreshPromise = performTokenRefresh().finally(() => {
                refreshPromise = null
            })
        }

        try {
            token = await refreshPromise
            headers['Authorization'] = `Bearer ${token}`
            response = await fetch(`${BASE_URL}${path}`, {
                ...options,
                headers
            })
        } catch {
            throw new Error('Unauthorized')
        }
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json() as Promise<T>
}