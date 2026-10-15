<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import type { User } from '../types/user'

defineProps<{
  users: User[]
}>()

const emit = defineEmits<{
  (e: 'delete', id: number): void
}>()

const showDeleteModal = ref(false)
const userToDelete = ref<User | null>(null)

function openDeleteModal(user: User) {
  userToDelete.value = user
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  userToDelete.value = null
}

function confirmDelete() {
  if (userToDelete.value) {
    emit('delete', userToDelete.value.id)
  }
  closeDeleteModal()
}
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
                @click="openDeleteModal(user)"
            >
              Видалити
            </button>
          </div>
        </td>
      </tr>
      </tbody>
    </table>

    <BaseModal v-model="showDeleteModal">
      <template #header>
        <h5 class="modal-title mb-0">Підтвердження видалення</h5>
      </template>

      <p v-if="userToDelete" class="mb-0">
        Ви дійсно бажаєте видалити користувача <strong>{{ userToDelete.firstName }} {{ userToDelete.lastName }}</strong> (@{{ userToDelete.username }})?
      </p>

      <template #footer>
        <button type="button" class="btn btn-secondary" @click="closeDeleteModal">
          Ні
        </button>
        <button type="button" class="btn btn-danger" @click="confirmDelete">
          Так
        </button>
      </template>
    </BaseModal>
  </div>
</template>