<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/features/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const errorMessage = ref<string | null>(null)
const isLoading = ref(false)

const schema = yup.object({
  username: yup.string().required('Введіть username'),
  password: yup.string().min(6, 'Пароль має бути не менше 6 символів').required('Введіть пароль')
})

const { handleSubmit, errors } = useForm({
  validationSchema: schema,
  initialValues: {
    username: 'emilys',
    password: 'emilyspass'
  }
})

const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
  isLoading.value = true
  errorMessage.value = null

  try {
    await authStore.login(values)
    const rawRedirect = route.query.redirect
    let redirectPath = '/users'
    if (typeof rawRedirect === 'string' && rawRedirect.startsWith('/') && !rawRedirect.startsWith('//')) {
      redirectPath = rawRedirect
    }
    router.push(redirectPath)
  } catch (err) {
    errorMessage.value = err instanceof Error ? err.message : 'Невдала спроба авторизації'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%;">
    <h1 class="h3 mb-3 text-center">Авторизація</h1>

    <div v-if="errorMessage" class="alert alert-danger py-2 mb-3" role="alert">
      {{ errorMessage }}
    </div>

    <form novalidate @submit.prevent="onSubmit">
      <div class="mb-3">
        <label for="username" class="form-label">Username</label>
        <input
            id="username"
            v-model="username"
            type="text"
            class="form-control"
            :class="{ 'is-invalid': errors.username }"
            placeholder="Введіть username"
        />
        <div class="invalid-feedback">
          {{ errors.username }}
        </div>
      </div>

      <div class="mb-3">
        <label for="password" class="form-label">Пароль</label>
        <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            placeholder="Введіть пароль"
        />
        <div class="invalid-feedback">
          {{ errors.password }}
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="isLoading">
        {{ isLoading ? 'Завантаження...' : 'Увійти' }}
      </button>
    </form>
  </div>
</template>