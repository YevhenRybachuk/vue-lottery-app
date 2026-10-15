<script setup lang="ts">
import type { User } from '../types/user'

defineProps<{
  users: User[]
}>()

defineEmits<{
  (e: 'delete', id: number): void
}>()
</script>

<template>
  <div class="table-responsive">
    <table class="table table-striped table-hover align-middle">
      <thead>
      <tr>
        <th scope="col">Аватар</th>
        <th scope="col">ПІБ</th>
        <th scope="col">Email</th>
        <th scope="col">Username</th>
        <th scope="col">Вік</th>
        <th scope="col" class="text-end">Дії</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>
          <img
              v-if="user.image"
              :src="user.image"
              :alt="`${user.firstName} ${user.lastName}`"
              class="rounded-circle"
              style="width: 40px; height: 40px; object-fit: cover;"
          />
          <div
              v-else
              class="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center"
              style="width: 40px; height: 40px; font-size: 14px;"
          >
            {{ user.firstName[0] }}{{ user.lastName[0] }}
          </div>
        </td>
        <td>
          <RouterLink :to="`/users/${user.id}`" class="fw-semibold text-decoration-none">
            {{ user.firstName }} {{ user.lastName }}
          </RouterLink>
        </td>
        <td>{{ user.email }}</td>
        <td>@{{ user.username }}</td>
        <td>{{ user.age }}</td>
        <td class="text-end">
          <div class="d-inline-flex gap-1">
            <RouterLink :to="`/users/${user.id}`" class="btn btn-sm btn-outline-primary">
              Деталі
            </RouterLink>
            <RouterLink :to="`/users/${user.id}/edit`" class="btn btn-sm btn-outline-secondary">
              Редагувати
            </RouterLink>
            <button
                type="button"
                class="btn btn-sm btn-outline-danger"
                @click="$emit('delete', user.id)"
            >
              Видалити
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>