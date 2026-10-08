<script setup lang="ts">
import { ref } from 'vue'
import BaseModal from './BaseModal.vue'
import type { Participant } from '../types/participant'

defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  'delete-participant': [id: string]
}>()

const showDeleteModal = ref(false)
const participantToDelete = ref<Participant | null>(null)

const openDeleteModal = (participant: Participant) => {
  participantToDelete.value = participant
  showDeleteModal.value = true
}

const closeDeleteModal = () => {
  showDeleteModal.value = false
  participantToDelete.value = null
}

const confirmDelete = () => {
  if (!participantToDelete.value) {
    return
  }

  emit('delete-participant', participantToDelete.value.id)
  closeDeleteModal()
}
</script>

<template>
  <section class="participants-table mt-5">
    <h2 class="mb-4">Учасники</h2>

    <p v-if="participants.length === 0">
      Поки що учасників немає.
    </p>

    <div
        v-else
        class="table-responsive"
    >
      <table class="table table-striped table-hover align-middle">
        <thead>
        <tr>
          <th>Ім’я</th>
          <th>Email</th>
          <th>Телефон</th>
          <th>Дата народження</th>
          <th>Дії</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="participant in participants"
            :key="participant.id"
        >
          <td>{{ participant.name }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td>{{ participant.birthDate }}</td>
          <td>
            <button
                type="button"
                class="btn btn-sm btn-danger"
                @click="openDeleteModal(participant)"
            >
              Видалити
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>

    <BaseModal v-model="showDeleteModal">
      <template #header>
        <h5 class="modal-title">
          Підтвердження видалення
        </h5>
      </template>

      <p v-if="participantToDelete">
        Ви дійсно бажаєте видалити учасника
        "{{ participantToDelete.name }}",
        "{{ participantToDelete.email }}"?
      </p>

      <template #footer>
        <button
            type="button"
            class="btn btn-secondary"
            @click="closeDeleteModal"
        >
          Ні
        </button>

        <button
            type="button"
            class="btn btn-danger"
            @click="confirmDelete"
        >
          Так
        </button>
      </template>
    </BaseModal>
  </section>
</template>