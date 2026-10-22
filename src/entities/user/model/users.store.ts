import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { ServiceProvider } from '@/shared/api'
import type { UserService } from '../api/user.service'
import type { CreateUserDto, UpdateUserDto, User } from './types'

export const useUsersStore = defineStore('users', () => {
    const users = ref<User[]>([])
    const currentUser = ref<User | null>(null)
    const total = ref(0)
    const isLoading = ref(false)
    const error = ref<string | null>(null)
    const hasUsers = computed(() => users.value.length > 0)

    const service = () => ServiceProvider.get<UserService>('users')

    async function fetchUsers(limit = 10, skip = 0, q = ''): Promise<void> {
        isLoading.value = true
        error.value = null
        try {
            const result = await service().getAll({ limit, skip, q })
            users.value = result.users
            total.value = result.total
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Failed to load users'
            throw cause
        } finally {
            isLoading.value = false
        }
    }

    async function fetchUser(id: number): Promise<User> {
        isLoading.value = true
        error.value = null
        try {
            const user = await service().getById(id)
            currentUser.value = user
            return user
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Failed to load user'
            throw cause
        } finally {
            isLoading.value = false
        }
    }

    async function createUser(data: CreateUserDto): Promise<User> {
        error.value = null
        try {
            const user = await service().create(data)
            users.value = [user, ...users.value]
            total.value += 1
            currentUser.value = user
            return user
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Failed to create user'
            throw cause
        }
    }

    async function updateUser(id: number, data: UpdateUserDto): Promise<User> {
        error.value = null
        try {
            const user = await service().update(id, data)
            users.value = users.value.map((item) => item.id === id ? user : item)
            if (currentUser.value?.id === id) currentUser.value = user
            return user
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Failed to update user'
            throw cause
        }
    }

    async function removeUser(id: number): Promise<void> {
        error.value = null
        try {
            await service().delete(id)
            users.value = users.value.filter((user) => user.id !== id)
            total.value = Math.max(0, total.value - 1)
            if (currentUser.value?.id === id) currentUser.value = null
        } catch (cause) {
            error.value = cause instanceof Error ? cause.message : 'Failed to delete user'
            throw cause
        }
    }

    return {
        users,
        currentUser,
        total,
        isLoading,
        error,
        hasUsers,
        fetchUsers,
        fetchUser,
        createUser,
        updateUser,
        removeUser,
    }
})
