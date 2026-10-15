<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { User } from '../types/user'

const users = ref<User[]>([])
const isLoading = ref(false)
const error = ref<string | null>(null)
const search = ref('')
const page = ref(1)
const pageSize = 10

const filteredUsers = computed(() => {
  const term = search.value.trim().toLowerCase()

  if (!term) return users.value

  return users.value.filter((user) =>
      `${user.firstName} ${user.lastName} ${user.email} ${user.username}`
          .toLowerCase()
          .includes(term),
  )
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredUsers.value.length / pageSize)),
)

const paginatedUsers = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredUsers.value.slice(start, start + pageSize)
})

async function loadUsers() {
  isLoading.value = true
  error.value = null

  try {
    users.value = await ServiceProvider.users.getAll({ limit: 100 })
  } catch (err) {
    error.value =
        err instanceof Error ? err.message : 'Не вдалося завантажити користувачів'
  } finally {
    isLoading.value = false
  }
}

function previousPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

watch(search, () => {
  page.value = 1
})

onMounted(loadUsers)
</script>

<template>
  <section class="users-page">
    <h1>Користувачі</h1>
    <p class="description">
      Список користувачів, отриманий із REST API DummyJSON.
    </p>

    <input
        v-model="search"
        class="search-input"
        type="search"
        placeholder="Пошук за ім'ям, email або username..."
        aria-label="Пошук користувачів"
    />

    <p v-if="isLoading" class="status">Завантаження користувачів...</p>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
      <button type="button" @click="loadUsers">Спробувати ще раз</button>
    </div>

    <template v-else>
      <p class="results-count">
        Знайдено користувачів: {{ filteredUsers.length }}
      </p>

      <div v-if="paginatedUsers.length" class="users-list">
        <article v-for="user in paginatedUsers" :key="user.id" class="user-card">
          <img
              v-if="user.image"
              :src="user.image"
              :alt="`${user.firstName} ${user.lastName}`"
              class="user-avatar"
          />

          <div class="user-info">
            <h2>{{ user.firstName }} {{ user.lastName }}</h2>
            <p>{{ user.email }}</p>
            <p>@{{ user.username }}</p>
          </div>
        </article>
      </div>

      <p v-else class="status">Користувачів не знайдено.</p>

      <div class="pagination">
        <button
            type="button"
            :disabled="page <= 1"
            @click="previousPage"
        >
          Назад
        </button>

        <span>Сторінка {{ page }} з {{ totalPages }}</span>

        <button
            type="button"
            :disabled="page >= totalPages"
            @click="nextPage"
        >
          Далі
        </button>
      </div>
    </template>
  </section>
</template>

<style scoped lang="scss">
.users-page {
  max-width: 1000px;
  margin: 0 auto;
  padding: 32px 5%;
}

h1 {
  margin-bottom: 8px;
}

.description,
.results-count {
  color: #666;
}

.search-input {
  box-sizing: border-box;
  width: 100%;
  margin: 16px 0;
  padding: 12px 14px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font: inherit;

  &:focus {
    border-color: #0d6efd;
    outline: 2px solid rgb(13 110 253 / 15%);
  }
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}

.user-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  border: 1px solid #e1e1e1;
  border-radius: 10px;
  background: #fff;
}

.user-avatar {
  width: 64px;
  height: 64px;
  flex-shrink: 0;
  border-radius: 50%;
  object-fit: cover;
  background: #eee;
}

.user-info {
  min-width: 0;

  h2 {
    margin: 0 0 8px;
    font-size: 18px;
  }

  p {
    margin: 4px 0;
    overflow-wrap: anywhere;
    color: #666;
  }
}

.status {
  padding: 24px 0;
  color: #555;
}

.error-message {
  padding: 16px;
  border: 1px solid #dc3545;
  border-radius: 8px;
  color: #b02a37;

  button {
    padding: 8px 12px;
    cursor: pointer;
  }
}

.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 24px;

  button {
    padding: 8px 14px;
    border: 1px solid #ccc;
    border-radius: 6px;
    background: #fff;
    cursor: pointer;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.45;
    }
  }
}
</style>