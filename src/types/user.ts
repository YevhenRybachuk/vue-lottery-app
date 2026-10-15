export interface User {
    id: number
    firstName: string
    lastName: string
    maidenName?: string
    age: number
    email: string
    phone: string
    username: string
    image?: string
    gender?: string
    address?: {
        address: string
        city: string
        state?: string
    }
}

export type CreateUserDto = Omit<User, 'id'>

export type UpdateUserDto = Partial<CreateUserDto>