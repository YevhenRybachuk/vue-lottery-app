<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import UsersTable from '../components/UsersTable.vue'
import { ServiceProvider } from '../services/service-provider'
import type { User } from '../types/user'

const route = useRoute()
const router = useRouter()

const users = ref<User[]>([])
const totalUsers = ref(0)
const isLoading = ref(false)
const error = ref<string | null>(null)

const searchInput = ref('')
const pageSize = 10
let currentRequestId = 0

function parseQuery() {
  const q = typeof route.query.q === 'string' ? route.query.q : ''
  let page = parseInt(typeof route.query.page === 'string' ? route.query.page : '1', 10)
  if (isNaN(page) || page < 1) {
    page = 1
  }
  return { q, page }
}

const totalPages = computed(() => Math.max(1, Math.ceil(totalUsers.value / pageSize)))

async function loadUsers() {
  const { q, page } = parseQuery()
  searchInput.value = q

  const requestId = ++currentRequestId
  isLoading.value = true
  error.value = null

  const skip = (page - 1) * pageSize

  try {
    const res = await ServiceProvider.users.getAll({
      limit: pageSize,
      skip,
      q
    })

    if (requestId !== currentRequestId) return

    users.value = res.users
    totalUsers.value = res.total
  } catch (err) {
    if (requestId !== currentRequestId) return
    error.value = err instanceof Error ? err.message : 'Не вдалося завантажити користувачів'
  } finally {
    if (requestId === currentRequestId) {
      isLoading.value = false
    }
  }
}

watch(
    () => route.query,
    () => {
      loadUsers()
    },
    { immediate: true }
)

let debounceTimer: ReturnType<typeof setTimeout>
watch(searchInput, (newVal) => {
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    const trimmed = newVal.trim()
    const currentQ = typeof route.query.q === 'string' ? route.query.q : ''
    if (trimmed !== currentQ) {
      const query: Record<string, string> = {}
      if (trimmed) query.q = trimmed
      router.replace({ query })
    }
  }, 300)
})

function goToPage(p: number) {
  const { q } = parseQuery()
  const query: Record<string, string> = {}
  if (q) query.q = q
  if (p > 1) query.page = String(p)

  router.push({ query })
}

function previousPage() {
  const { page } = parseQuery()
  if (page > 1) {
    goToPage(page - 1)
  }
}

function nextPage() {
  const { page } = parseQuery()
  if (page < totalPages.value) {
    goToPage(page + 1)
  }
}

async function deleteUser(id: number) {
  try {
    await ServiceProvider.users.delete(id)
    loadUsers()
  } catch (err) {
    alert(err instanceof Error ? err.message : 'Не вдалося видалити користувача')
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

      <RouterLink to="/users/create" class="btn btn-success">
        + Створити користувача
      </RouterLink>
    </div>

    <input
        v-model="searchInput"
        class="form-control mb-4"
        type="search"
        placeholder="Пошук за ім'ям, email або username..."
        aria-label="Пошук користувачів"
    />

    <p v-if="isLoading" class="text-secondary py-3">Завантаження користувачів...</p>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      <p class="mb-2">{{ error }}</p>
      <button type="button" class="btn btn-outline-danger btn-sm" @click="loadUsers">
        Спробувати ще раз
      </button>
    </div>

    <template v-else>
      <p class="text-muted">Знайдено користувачів: {{ totalUsers }}</p>

      <UsersTable
          v-if="users.length"
          :users="users"
          @delete="deleteUser"
      />

      <p v-else class="text-muted py-3">Користувачів не знайдено.</p>

      <div class="d-flex align-items-center justify-content-center gap-3 mt-4">
        <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            :disabled="parseQuery().page <= 1"
            @click="previousPage"
        >
          Назад
        </button>

        <span>Сторінка {{ parseQuery().page }} з {{ totalPages }}</span>

        <button
            type="button"
            class="btn btn-outline-secondary btn-sm"
            :disabled="parseQuery().page >= totalPages"
            @click="nextPage"
        >
          Далі
        </button>
      </div>
    </template>
  </section>
</template>