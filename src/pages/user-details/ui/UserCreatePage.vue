<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore, type CreateUserDto, type UpdateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import { useAppToast } from '@/shared/ui'

const router = useRouter()
const usersStore = useUsersStore()
const toast = useAppToast()
const isSaving = ref(false)

async function handleSubmit(values: CreateUserDto | UpdateUserDto): Promise<void> {
    isSaving.value = true
    try {
        await usersStore.createUser(values as CreateUserDto)
        toast.success('Користувача створено')
        await router.push('/users')
    } catch (cause) {
        toast.error('Не вдалося створити користувача', cause instanceof Error ? cause.message : undefined)
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <section class="container py-4">
        <RouterLink to="/users" class="btn btn-outline-secondary btn-sm mb-3">← До списку користувачів</RouterLink>
        <h1 class="h3 mb-4">Створення нового користувача</h1>
        <UserForm :is-saving="isSaving" submit-label="Створити користувача" @submit="handleSubmit" />
    </section>
</template>
