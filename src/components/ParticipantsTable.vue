<script setup lang="ts">
import { computed, ref } from 'vue'
import BaseModal from './BaseModal.vue'
import BaseInput from './BaseInput.vue'
import BaseButton from './BaseButton.vue'
import SearchBar from './SearchBar.vue'
import type { Participant } from '../types/participant'

type SortField = 'name' | 'birthDate'
type SortDirection = 'asc' | 'desc'

const props = defineProps<{
  participants: Participant[]
}>()

const emit = defineEmits<{
  'delete-participant': [id: string]
  'update-participant': [participant: Participant]
  'filter-by-name': [value: string]
}>()

const searchQuery = ref('')

const sortField = ref<SortField | null>(null)
const sortDirection = ref<SortDirection>('asc')

const showDeleteModal = ref(false)
const showEditModal = ref(false)

const participantToDelete = ref<Participant | null>(null)
const participantToEdit = ref<Participant | null>(null)

const editForm = ref({
  name: '',
  email: '',
  phone: '',
  birthDate: ''
})

const editErrors = ref({
  name: '',
  email: '',
  phone: '',
  birthDate: ''
})

const filterByName = (value: string) => {
  searchQuery.value = value
  emit('filter-by-name', value)
}

const displayedParticipants = computed(() => {
  const filteredParticipants = props.participants.filter(
      participant =>
          participant.name
              .toLowerCase()
              .includes(searchQuery.value.toLowerCase())
  )

  if (!sortField.value) {
    return filteredParticipants
  }

  return [...filteredParticipants].sort((first, second) => {
    let comparison = 0

    if (sortField.value === 'name') {
      comparison = first.name.localeCompare(
          second.name,
          'uk',
          { sensitivity: 'base' }
      )
    }

    if (sortField.value === 'birthDate') {
      comparison =
          first.birthDate.localeCompare(second.birthDate)
    }

    return sortDirection.value === 'asc'
        ? comparison
        : -comparison
  })
})

const sortBy = (field: SortField) => {
  if (sortField.value === field) {
    sortDirection.value =
        sortDirection.value === 'asc'
            ? 'desc'
            : 'asc'

    return
  }

  sortField.value = field
  sortDirection.value = 'asc'
}

const getSortIcon = (field: SortField) => {
  if (sortField.value !== field) {
    return ''
  }

  return sortDirection.value === 'asc'
      ? ' ↑'
      : ' ↓'
}

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

  emit(
      'delete-participant',
      participantToDelete.value.id
  )

  closeDeleteModal()
}

const openEditModal = (participant: Participant) => {
  participantToEdit.value = participant

  editForm.value = {
    name: participant.name,
    email: participant.email,
    phone: participant.phone,
    birthDate: participant.birthDate
  }

  editErrors.value = {
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  }

  showEditModal.value = true
}

const closeEditModal = () => {
  showEditModal.value = false
  participantToEdit.value = null
}

const validateEditForm = (): boolean => {
  editErrors.value = {
    name: '',
    email: '',
    phone: '',
    birthDate: ''
  }

  let isValid = true

  if (!editForm.value.name.trim()) {
    editErrors.value.name = 'Введіть ім’я.'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!editForm.value.email.trim()) {
    editErrors.value.email = 'Введіть email.'
    isValid = false
  } else if (!emailRegex.test(editForm.value.email)) {
    editErrors.value.email = 'Введіть коректний email.'
    isValid = false
  } else {
    const emailExists = props.participants.some(
        participant =>
            participant.id !== participantToEdit.value?.id &&
            participant.email.toLowerCase() ===
            editForm.value.email.trim().toLowerCase()
    )

    if (emailExists) {
      editErrors.value.email =
          'Учасник з таким email вже зареєстрований.'
      isValid = false
    }
  }

  const phoneRegex = /^\+380\d{9}$/

  if (!editForm.value.phone.trim()) {
    editErrors.value.phone =
        'Введіть номер телефону.'
    isValid = false
  } else if (!phoneRegex.test(editForm.value.phone)) {
    editErrors.value.phone =
        'Телефон має бути у форматі +380XXXXXXXXX.'
    isValid = false
  }

  if (!editForm.value.birthDate) {
    editErrors.value.birthDate =
        'Виберіть дату народження.'
    isValid = false
  } else {
    const selectedDate = new Date(
        `${editForm.value.birthDate}T00:00:00`
    )

    const today = new Date()
    today.setHours(0, 0, 0, 0)

    if (selectedDate > today) {
      editErrors.value.birthDate =
          'Дата народження не може бути в майбутньому.'
      isValid = false
    }
  }

  return isValid
}

const updateParticipant = () => {
  if (
      !participantToEdit.value ||
      !validateEditForm()
  ) {
    return
  }

  emit('update-participant', {
    id: participantToEdit.value.id,
    name: editForm.value.name.trim(),
    email: editForm.value.email.trim(),
    phone: editForm.value.phone.trim(),
    birthDate: editForm.value.birthDate
  })

  closeEditModal()
}
</script>

<template>
  <section class="participants-table mt-5">
    <h2 class="mb-4">
      Учасники
    </h2>

    <SearchBar
        @filter-by-name="filterByName"
    />

    <p v-if="participants.length === 0">
      Поки що учасників немає.
    </p>

    <p
        v-else-if="displayedParticipants.length === 0"
        class="text-muted"
    >
      Учасників за вашим запитом не знайдено.
    </p>

    <div
        v-else
        class="table-responsive"
    >
      <table class="table table-striped table-hover align-middle">
        <thead>
        <tr>
          <th>
            <button
                type="button"
                class="btn btn-link p-0 text-dark text-decoration-none"
                @click="sortBy('name')"
            >
              Ім’я{{ getSortIcon('name') }}
            </button>
          </th>

          <th>Email</th>

          <th>Телефон</th>

          <th>
            <button
                type="button"
                class="btn btn-link p-0 text-dark text-decoration-none"
                @click="sortBy('birthDate')"
            >
              Дата народження{{ getSortIcon('birthDate') }}
            </button>
          </th>

          <th>Дії</th>
        </tr>
        </thead>

        <tbody>
        <tr
            v-for="participant in displayedParticipants"
            :key="participant.id"
        >
          <td>{{ participant.name }}</td>
          <td>{{ participant.email }}</td>
          <td>{{ participant.phone }}</td>
          <td>{{ participant.birthDate }}</td>

          <td>
            <div class="d-flex gap-2">
              <BaseButton
                  size="sm"
                  @click="openEditModal(participant)"
              >
                Редагувати
              </BaseButton>

              <BaseButton
                  variant="danger"
                  size="sm"
                  @click="openDeleteModal(participant)"
              >
                Видалити
              </BaseButton>
            </div>
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
        <BaseButton
            variant="secondary"
            @click="closeDeleteModal"
        >
          Ні
        </BaseButton>

        <BaseButton
            variant="danger"
            @click="confirmDelete"
        >
          Так
        </BaseButton>
      </template>
    </BaseModal>

    <BaseModal v-model="showEditModal">
      <template #header>
        <h5 class="modal-title">
          Редагування учасника
        </h5>
      </template>

      <form
          id="edit-participant-form"
          novalidate
          @submit.prevent="updateParticipant"
      >
        <BaseInput
            v-model="editForm.name"
            id="edit-name"
            name="edit-name"
            placeholder="Ім’я"
            :error="editErrors.name"
        />

        <BaseInput
            v-model="editForm.email"
            id="edit-email"
            name="edit-email"
            type="email"
            placeholder="Email"
            :error="editErrors.email"
        />

        <BaseInput
            v-model="editForm.phone"
            id="edit-phone"
            name="edit-phone"
            type="tel"
            placeholder="+380XXXXXXXXX"
            :error="editErrors.phone"
        />

        <BaseInput
            v-model="editForm.birthDate"
            id="edit-birth-date"
            name="edit-birth-date"
            type="date"
            :error="editErrors.birthDate"
        />
      </form>

      <template #footer>
        <BaseButton
            variant="secondary"
            @click="closeEditModal"
        >
          Скасувати
        </BaseButton>

        <BaseButton
            type="submit"
            form="edit-participant-form"
        >
          Оновити дані
        </BaseButton>
      </template>
    </BaseModal>
  </section>
</template>