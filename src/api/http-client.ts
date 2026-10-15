const BASE_URL = import.meta.env.VITE_API_URL

export async function http<T>(
    path: string,
    options: RequestInit = {},
): Promise<T> {
    if (!BASE_URL) {
        throw new Error('Не задано VITE_API_URL у файлі .env')
    }

    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
    })

    if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    return response.json() as Promise<T>
}