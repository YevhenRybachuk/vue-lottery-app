import { http } from '@/shared/api'
import type { User, CreateUserDto, UpdateUserDto } from '@/entities/user'
import type {
    Readable,
    Creatable,
    Editable,
    Deletable,
    PaginatedResult,
} from '@/shared/api'

interface UsersResponse {
    users: User[]
    total: number
    skip: number
    limit: number
}

const STORAGE_MODIFIED_USERS = 'local_modified_users'
const STORAGE_CREATED_USERS = 'local_created_users'
const STORAGE_DELETED_USERS = 'local_deleted_users'

function getSavedObject<T>(key: string, fallback: T): T {
    try {
        const data = localStorage.getItem(key)
        return data ? JSON.parse(data) : fallback
    } catch {
        return fallback
    }
}

export class UserService
    implements
        Readable<User>,
        Creatable<User, CreateUserDto>,
        Editable<User, UpdateUserDto>,
        Deletable<User>
{
    private modifiedUsers: Map<number, User>
    private createdUsers: User[]
    private deletedUserIds: Set<number>

    constructor() {
        this.modifiedUsers = new Map()
        const savedMods = getSavedObject<Record<number, User>>(STORAGE_MODIFIED_USERS, {})
        Object.entries(savedMods).forEach(([id, user]) => {
            this.modifiedUsers.set(Number(id), user)
        })

        this.createdUsers = getSavedObject<User[]>(STORAGE_CREATED_USERS, [])
        this.deletedUserIds = new Set(getSavedObject<number[]>(STORAGE_DELETED_USERS, []))
    }

    private saveState() {
        const modsObj: Record<number, User> = {}
        this.modifiedUsers.forEach((user, id) => {
            const copy = { ...user } as Record<string, unknown>
            delete copy['password']
            modsObj[id] = copy as unknown as User
        })

        const cleanedCreatedUsers = this.createdUsers.map(user => {
            const copy = { ...user } as Record<string, unknown>
            delete copy['password']
            return copy as unknown as User
        })

        localStorage.setItem(STORAGE_MODIFIED_USERS, JSON.stringify(modsObj))
        localStorage.setItem(STORAGE_CREATED_USERS, JSON.stringify(cleanedCreatedUsers))
        localStorage.setItem(STORAGE_DELETED_USERS, JSON.stringify(Array.from(this.deletedUserIds)))
    }

    async getAll(params: { limit?: number; skip?: number; q?: string } = {}): Promise<PaginatedResult<User>> {
        const query = new URLSearchParams()

        if (params.limit !== undefined) query.set('limit', String(params.limit))
        if (params.skip !== undefined) query.set('skip', String(params.skip))
        if (params.q) query.set('q', params.q)

        const endpoint = params.q ? '/users/search' : '/users'
        const suffix = query.size > 0 ? `?${query.toString()}` : ''
        const response = await http<UsersResponse>(`${endpoint}${suffix}`)

        let usersList = response.users
            .filter(u => !this.deletedUserIds.has(u.id))
            .map(u => this.modifiedUsers.get(u.id) || u)

        const matchingCreated = this.createdUsers.filter(u => {
            if (this.deletedUserIds.has(u.id)) return false
            if (!params.q) return true
            const qLower = params.q.toLowerCase()
            return (
                u.firstName.toLowerCase().includes(qLower) ||
                u.lastName.toLowerCase().includes(qLower) ||
                u.email.toLowerCase().includes(qLower) ||
                u.username.toLowerCase().includes(qLower)
            )
        })

        if (params.skip === 0 || !params.skip) {
            usersList = [...matchingCreated, ...usersList]
        }

        const deletedCount = params.q
            ? response.users.filter(u => this.deletedUserIds.has(u.id)).length
            : this.deletedUserIds.size

        const calculatedTotal = response.total + matchingCreated.length - deletedCount

        return {
            users: usersList,
            total: Math.max(0, calculatedTotal)
        }
    }

    async getById(id: number): Promise<User> {
        if (this.deletedUserIds.has(id)) {
            throw new Error('Користувача було видалено')
        }

        const created = this.createdUsers.find(u => u.id === id)
        if (created) return this.modifiedUsers.get(id) || created

        if (this.modifiedUsers.has(id)) {
            return this.modifiedUsers.get(id)!
        }

        const user = await http<User>(`/users/${id}`)
        return this.modifiedUsers.get(id) || user
    }

    async create(data: CreateUserDto): Promise<User> {
        const dataWithoutPassword: Record<string, unknown> = { ...data }
        delete dataWithoutPassword['password']

        const apiResult = await http<User>('/users/add', {
            method: 'POST',
            body: JSON.stringify(data),
        })

        const newId = Date.now()
        const newUser: User = {
            ...dataWithoutPassword,
            ...apiResult,
            id: newId
        } as unknown as User

        this.createdUsers.unshift(newUser)
        this.saveState()

        return newUser
    }

    async update(id: number, data: UpdateUserDto): Promise<User> {
        const dataWithoutPassword: Record<string, unknown> = { ...data }
        delete dataWithoutPassword['password']

        const apiResult = await http<User>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        })

        const existing = await this.getById(id)
        const updatedUser: User = {
            ...existing,
            ...apiResult,
            ...dataWithoutPassword,
            id
        } as unknown as User

        this.modifiedUsers.set(id, updatedUser)

        const createdIdx = this.createdUsers.findIndex(u => u.id === id)
        if (createdIdx !== -1) {
            this.createdUsers[createdIdx] = updatedUser
        }

        this.saveState()
        return updatedUser
    }

    async delete(id: number): Promise<void> {
        await http<unknown>(`/users/${id}`, {
            method: 'DELETE',
        })

        const wasCreated = this.createdUsers.some(u => u.id === id)
        this.createdUsers = this.createdUsers.filter(u => u.id !== id)
        if (!wasCreated) {
            this.deletedUserIds.add(id)
        }

        this.modifiedUsers.delete(id)
        this.saveState()
    }
}