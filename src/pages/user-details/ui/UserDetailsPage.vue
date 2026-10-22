<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { useUsersStore } from '@/entities/user'
import { useAppToast } from '@/shared/ui'

const props = defineProps<{ id: string }>()
const usersStore = useUsersStore()
const { currentUser: user, isLoading, error } = storeToRefs(usersStore)
const toast = useAppToast()

async function loadUser(): Promise<void> {
    const id = Number(props.id)
    if (!Number.isInteger(id) || id <= 0) {
        toast.error('Некоректний ідентифікатор користувача')
        return
    }
    try {
        await usersStore.fetchUser(id)
    } catch (cause) {
        toast.error('Не вдалося завантажити користувача', cause instanceof Error ? cause.message : undefined)
    }
}

watch(() => props.id, loadUser, { immediate: true })
</script>

<template>
    <section class="container py-4">
        <RouterLink to="/users" class="btn btn-outline-secondary btn-sm mb-3">← До списку користувачів</RouterLink>
        <p v-if="isLoading">Завантаження...</p>
        <div v-else-if="error" class="alert alert-danger" role="alert">{{ error }}</div>
        <article v-else-if="user && user.id === Number(id)" class="card p-4 shadow-sm user-card">
            <div class="d-flex align-items-center gap-3 mb-4">
                <img
                    v-if="user.image"
                    :src="user.image"
                    :alt="`${user.firstName} ${user.lastName}`"
                    class="rounded-circle user-card__avatar"
                >
                <div>
                    <h1 class="h3 mb-1">{{ user.firstName }} {{ user.lastName }}</h1>
                    <p class="text-muted mb-0">@{{ user.username }}</p>
                </div>
            </div>
            <ul class="list-group list-group-flush mb-4">
                <li class="list-group-item"><strong>ID:</strong> {{ user.id }}</li>
                <li class="list-group-item"><strong>Email:</strong> {{ user.email }}</li>
                <li class="list-group-item"><strong>Телефон:</strong> {{ user.phone }}</li>
                <li class="list-group-item"><strong>Вік:</strong> {{ user.age }}</li>
                <li class="list-group-item"><strong>Стать:</strong> {{ user.gender || 'Не вказано' }}</li>
                <li class="list-group-item"><strong>Місто:</strong> {{ user.address?.city ?? 'Не вказано' }}</li>
            </ul>
            <RouterLink :to="`/users/${user.id}/edit`" class="btn btn-primary align-self-start">Редагувати користувача</RouterLink>
        </article>
    </section>
</template>

<style scoped lang="scss">
.user-card {
    max-width: 600px;
}

.user-card__avatar {
    width: 96px;
    height: 96px;
    object-fit: cover;
}
</style>
