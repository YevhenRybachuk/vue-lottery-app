<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { UserForm } from '@/features/user-form'
import type { CreateUserDto, UpdateUserDto } from '@/entities/user'
import { UserService } from '@/entities/user'

const props = defineProps<{
  id: string
}>()

const router = useRouter()
const isLoading = ref(false)
const isSaving = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)
const initialValues = ref<Partial<CreateUserDto>>({})

async function loadUser() {
  const userId = Number(props.id)
  if (!Number.isInteger(userId) || userId <= 0) {
    error.value = 'Некоректний ID користувача'
    return
  }

  isLoading.value = true
  error.value = null

  try {
    const userService = new UserService()
    const user = await userService.getById(userId)
    initialValues.value = {
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      username: user.username || '',
      password: '',
      age: user.age || 18,
      gender: user.gender || 'male',
      phone: user.phone || ''
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не вдалося завантажити користувача'
  } finally {
    isLoading.value = false
  }
}

watch(() => props.id, loadUser)
onMounted(loadUser)

async function handleSubmit(values: UpdateUserDto) {
  isSaving.value = true
  error.value = null
  successMessage.value = null

  try {
    const userService = new UserService()
    await userService.update(Number(props.id), values)
    successMessage.value = 'Зміни збережено успішно!'

    setTimeout(() => {
      router.push(`/users/${props.id}`)
    }, 1000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Не вдалося зберегти зміни'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section class="user-edit container py-4">
    <RouterLink :to="`/users/${id}`" class="btn btn-outline-secondary btn-sm mb-3">
      ← Назад до деталей
    </RouterLink>

    <h1 class="h3 mb-4">Редагування користувача #{{ id }}</h1>

    <p v-if="isLoading">Завантаження даних...</p>

    <div v-else-if="error && !initialValues.firstName" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <UserForm
        v-else
        :initial-values="initialValues"
        :is-saving="isSaving"
        submit-label="Зберегти зміни"
        :is-edit-mode="true"
        :error="error"
        :success-message="successMessage"
        @submit="handleSubmit"
    />
  </section>
</template>