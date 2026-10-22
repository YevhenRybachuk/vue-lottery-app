<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useUsersStore, type CreateUserDto, type UpdateUserDto } from '@/entities/user'
import { UserForm } from '@/features/user-form'
import { useAppToast } from '@/shared/ui'

const props = defineProps<{ id: string }>()
const router = useRouter()
const usersStore = useUsersStore()
const { currentUser, isLoading } = storeToRefs(usersStore)
const toast = useAppToast()
const isSaving = ref(false)

const initialValues = computed<Partial<CreateUserDto>>(() => ({
    firstName: currentUser.value?.firstName ?? '',
    lastName: currentUser.value?.lastName ?? '',
    email: currentUser.value?.email ?? '',
    username: currentUser.value?.username ?? '',
    password: '',
    age: currentUser.value?.age ?? 18,
    gender: currentUser.value?.gender ?? 'male',
    phone: currentUser.value?.phone ?? '',
}))

async function loadUser(): Promise<void> {
    const id = Number(props.id)
    if (!Number.isInteger(id) || id <= 0) {
        toast.error('Некоректний ID користувача')
        return
    }
    try {
        await usersStore.fetchUser(id)
    } catch (cause) {
        toast.error('Не вдалося завантажити користувача', cause instanceof Error ? cause.message : undefined)
    }
}

watch(() => props.id, loadUser, { immediate: true })

async function handleSubmit(values: CreateUserDto | UpdateUserDto): Promise<void> {
    isSaving.value = true
    try {
        await usersStore.updateUser(Number(props.id), values as UpdateUserDto)
        toast.success('Користувача оновлено')
        await router.push(`/users/${props.id}`)
    } catch (cause) {
        toast.error('Не вдалося оновити користувача', cause instanceof Error ? cause.message : undefined)
    } finally {
        isSaving.value = false
    }
}
</script>

<template>
    <section class="container py-4">
        <RouterLink :to="`/users/${id}`" class="btn btn-outline-secondary btn-sm mb-3">← До деталей</RouterLink>
        <h1 class="h3 mb-4">Редагування користувача #{{ id }}</h1>
        <p v-if="isLoading">Завантаження даних...</p>
        <UserForm
            v-else
            :key="id"
            :initial-values="initialValues"
            :is-saving="isSaving"
            submit-label="Зберегти зміни"
            is-edit-mode
            @submit="handleSubmit"
        />
    </section>
</template>
