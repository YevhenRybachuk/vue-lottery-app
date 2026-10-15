import { http } from '../api/http-client'
import type { User, CreateUserDto, UpdateUserDto } from '../types/user'
import type {
    Readable,
    Creatable,
    Editable,
    Deletable,
} from './interfaces'

interface UsersResponse {
    users: User[]
    total: number
    skip: number
    limit: number
}

export class UserService
    implements
        Readable<User>,
        Creatable<User, CreateUserDto>,
        Editable<User, UpdateUserDto>,
        Deletable
{
    async getAll(params: { limit?: number; skip?: number } = {}): Promise<User[]> {
        const query = new URLSearchParams()

        if (params.limit !== undefined) {
            query.set('limit', String(params.limit))
        }

        if (params.skip !== undefined) {
            query.set('skip', String(params.skip))
        }

        const suffix = query.size > 0 ? `?${query.toString()}` : ''
        const response = await http<UsersResponse>(`/users${suffix}`)

        return response.users
    }

    async getById(id: number): Promise<User> {
        return http<User>(`/users/${id}`)
    }

    async create(data: CreateUserDto): Promise<User> {
        return http<User>('/users/add', {
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        return http<User>(`/users/${id}`, {
            method: 'PATCH',
            body: JSON.stringify(data),
        })
    }

    async delete(id: number): Promise<void> {
        await http<unknown>(`/users/${id}`, {
            method: 'DELETE',
        })
    }
}