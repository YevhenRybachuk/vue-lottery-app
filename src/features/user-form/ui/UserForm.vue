<script setup lang="ts">
import { useForm, useField } from 'vee-validate'
import { watch } from 'vue'
import { userCreateValidationSchema, userEditValidationSchema } from '../model/user.schema.ts'
import type { CreateUserDto, UpdateUserDto } from '@/entities/user'
const props = withDefaults(
    defineProps<{
      initialValues?: Partial<CreateUserDto>
      isSaving?: boolean
      submitLabel?: string
      isEditMode?: boolean
      error?: string | null
      successMessage?: string | null
    }>(),
    {
      initialValues: () => ({}),
      isSaving: false,
      submitLabel: 'Зберегти',
      isEditMode: false,
      error: null,
      successMessage: null
    }
)

const emit = defineEmits<{
  (e: 'submit', values: CreateUserDto | UpdateUserDto): void
}>()

const schema = props.isEditMode ? userEditValidationSchema : userCreateValidationSchema

const { handleSubmit, errors, setValues } = useForm({
  validationSchema: schema,
  initialValues: {
    firstName: props.initialValues.firstName || '',
    lastName: props.initialValues.lastName || '',
    email: props.initialValues.email || '',
    username: props.initialValues.username || '',
    password: props.initialValues.password || '',
    age: props.initialValues.age ?? 18,
    gender: props.initialValues.gender || 'male',
    phone: props.initialValues.phone || ''
  }
})

watch(
    () => props.initialValues,
    (newValues) => {
      setValues({
        firstName: newValues.firstName || '',
        lastName: newValues.lastName || '',
        email: newValues.email || '',
        username: newValues.username || '',
        password: newValues.password || '',
        age: newValues.age ?? 18,
        gender: newValues.gender || 'male',
        phone: newValues.phone || ''
      })
    },
    { deep: true }
)

const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')
const { value: age } = useField<number>('age')
const { value: gender } = useField<string>('gender')
const { value: phone } = useField<string>('phone')

const onSubmit = handleSubmit((values) => {
  const payload: Record<string, unknown> = { ...values }
  if (props.isEditMode && !payload.password) {
    delete payload['password']
  }
  emit('submit', payload as unknown as (CreateUserDto | UpdateUserDto))
})
</script>

<template>
  <form class="card p-4 shadow-sm" style="max-width: 800px;" novalidate @submit.prevent="onSubmit">
    <div v-if="successMessage" class="alert alert-success" role="alert">
      {{ successMessage }}
    </div>

    <div v-if="error" class="alert alert-danger" role="alert">
      {{ error }}
    </div>

    <div class="row g-3">
      <div class="col-md-6">
        <label for="firstName" class="form-label">Ім'я *</label>
        <input id="firstName" v-model="firstName" type="text" class="form-control" :class="{ 'is-invalid': errors.firstName }" />
        <div class="invalid-feedback">{{ errors.firstName }}</div>
      </div>

      <div class="col-md-6">
        <label for="lastName" class="form-label">Прізвище *</label>
        <input id="lastName" v-model="lastName" type="text" class="form-control" :class="{ 'is-invalid': errors.lastName }" />
        <div class="invalid-feedback">{{ errors.lastName }}</div>
      </div>

      <div class="col-md-6">
        <label for="email" class="form-label">Email *</label>
        <input id="email" v-model="email" type="email" class="form-control" :class="{ 'is-invalid': errors.email }" placeholder="user@example.com" />
        <div class="invalid-feedback">{{ errors.email }}</div>
      </div>

      <div class="col-md-6">
        <label for="username" class="form-label">Username *</label>
        <input id="username" v-model="username" type="text" class="form-control" :class="{ 'is-invalid': errors.username }" />
        <div class="invalid-feedback">{{ errors.username }}</div>
      </div>

      <div class="col-md-6">
        <label for="password" class="form-label">
          Пароль {{ isEditMode ? '(необов\'язково)' : '*' }}
        </label>
        <input
            id="password"
            v-model="password"
            type="password"
            class="form-control"
            :class="{ 'is-invalid': errors.password }"
            :placeholder="isEditMode ? 'Залиште порожнім, щоб не змінювати' : 'Введіть пароль'"
        />
        <div class="invalid-feedback">{{ errors.password }}</div>
      </div>

      <div class="col-md-6">
        <label for="age" class="form-label">Вік *</label>
        <input id="age" v-model.number="age" type="number" class="form-control" :class="{ 'is-invalid': errors.age }" />
        <div class="invalid-feedback">{{ errors.age }}</div>
      </div>

      <div class="col-md-6">
        <label for="gender" class="form-label">Стать *</label>
        <select id="gender" v-model="gender" class="form-select" :class="{ 'is-invalid': errors.gender }">
          <option value="male">male</option>
          <option value="female">female</option>
        </select>
        <div class="invalid-feedback">{{ errors.gender }}</div>
      </div>

      <div class="col-md-6">
        <label for="phone" class="form-label">Телефон *</label>
        <input id="phone" v-model="phone" type="tel" class="form-control" :class="{ 'is-invalid': errors.phone }" placeholder="+380971234567" />
        <div class="invalid-feedback">{{ errors.phone }}</div>
      </div>
    </div>

    <div class="mt-4 d-flex gap-2">
      <button type="submit" class="btn btn-success" :disabled="isSaving">
        {{ isSaving ? 'Збереження...' : submitLabel }}
      </button>
      <RouterLink to="/users" class="btn btn-secondary">
        Скасувати
      </RouterLink>
    </div>
  </form>
</template>