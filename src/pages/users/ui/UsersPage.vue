<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useRoute, useRouter } from 'vue-router'
import { useUsersStore } from '@/entities/user'
import { AppButton, AppInput, useAppToast } from '@/shared/ui'
import { UsersTable } from '@/widgets/users-table'

const route = useRoute()
const router = useRouter()
const usersStore = useUsersStore()
const { users, total, isLoading, error } = storeToRefs(usersStore)
const { fetchUsers, removeUser } = usersStore
const toast = useAppToast()

const searchInput = ref(typeof route.query.q === 'string' ? route.query.q : '')
const pageSize = 10

function parseQuery() {
    const q = typeof route.query.q === 'string' ? route.query.q : ''
    const parsedPage = Number.parseInt(typeof route.query.page === 'string' ? route.query.page : '1', 10)
    return { q, page: Number.isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage }
}

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

async function loadUsers(): Promise<void> {
    const { q, page } = parseQuery()
    searchInput.value = q
    await fetchUsers(pageSize, (page - 1) * pageSize, q).catch(() => undefined)
}

watch(() => route.query, loadUsers, { immediate: true })

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (value) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
        const q = value.trim()
        const query: Record<string, string> = {}
        if (q) query.q = q
        router.replace({ query })
    }, 300)
})

function goToPage(page: number): void {
    const { q } = parseQuery()
    const query: Record<string, string> = {}
    if (q) query.q = q
    if (page > 1) query.page = String(page)
    router.push({ query })
}

async function deleteUser(id: number): Promise<void> {
    try {
        await removeUser(id)
        toast.success('Користувача видалено')
    } catch (cause) {
        toast.error('Не вдалося видалити користувача', cause instanceof Error ? cause.message : undefined)
    }
}
</script>

<template>
    <section class="users-page container py-4">
        <div class="d-flex justify-content-between align-items-center mb-3">
            <div>
                <h1 class="mb-1">Користувачі</h1>
                <p class="text-muted mb-0">Список користувачів з REST API DummyJSON.</p>
            </div>
            <RouterLink to="/users/create" class="btn btn-success">+ Створити користувача</RouterLink>
        </div>

        <div class="mb-4">
            <AppInput
                v-model="searchInput"
                type="search"
                aria-label="Пошук користувачів"
                placeholder="Пошук за ім'ям, email або username..."
            />
        </div>

        <p v-if="isLoading" class="text-secondary py-3">Завантаження користувачів...</p>
        <div v-else-if="error" class="alert alert-danger" role="alert">
            <p class="mb-2">{{ error }}</p>
            <AppButton severity="danger" @click="loadUsers">Спробувати ще раз</AppButton>
        </div>
        <template v-else>
            <p class="text-muted">Знайдено користувачів: {{ total }}</p>
            <UsersTable v-if="users.length" :users="users" @delete="deleteUser" />
            <p v-else class="text-muted py-3">Користувачів не знайдено.</p>

            <div class="d-flex align-items-center justify-content-center gap-3 mt-4">
                <AppButton severity="secondary" :disabled="parseQuery().page <= 1" @click="goToPage(parseQuery().page - 1)">
                    Назад
                </AppButton>
                <span>Сторінка {{ parseQuery().page }} з {{ totalPages }}</span>
                <AppButton severity="secondary" :disabled="parseQuery().page >= totalPages" @click="goToPage(parseQuery().page + 1)">
                    Далі
                </AppButton>
            </div>
        </template>
    </section>
</template>
