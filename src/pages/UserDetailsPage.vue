<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { ServiceProvider } from '../services/service-provider'
import type { User } from '../types/user'

const props = defineProps<{
  id: string
}>()

const user = ref<User | null>(null)
const isLoading = ref(false)
const error = ref<string | null>(null)

async function loadUser() {
  const userId = Number(props.id)

  if (!Number.isInteger(userId) || userId <= 0) {
    error.value = 'Некоректний ідентифікатор користувача'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    user.value = await ServiceProvider.users.getById(userId)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не вдалося завантажити користувача'
  } finally {
    isLoading.value = false
  }
}

watch(() => props.id, loadUser)
onMounted(loadUser)
</script>

<template>
  <section class="user-details container py-4">
    <RouterLink to="/users" class="btn btn-outline-secondary btn-sm mb-3">
      ← До списку користувачів
    </RouterLink>

    <p v-if="isLoading">Завантаження...</p>

    <div v-else-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <article v-else-if="user" class="card p-4 shadow-sm" style="max-width: 600px;">
      <div class="d-flex align-items-center gap-3 mb-4">
        <img
            v-if="user.image"
            :src="user.image"
            :alt="`${user.firstName} ${user.lastName}`"
            class="rounded-circle"
            style="width: 96px; height: 96px; object-fit: cover;"
        />
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

      <div class="d-flex gap-2">
        <RouterLink :to="`/users/${user.id}/edit`" class="btn btn-primary">
          Редагувати користувача
        </RouterLink>
      </div>
    </article>
  </section>
</template>