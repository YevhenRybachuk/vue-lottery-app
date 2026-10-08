<script setup lang="ts">
import { reactive, ref } from 'vue'
import BaseButton from './BaseButton.vue'
import BaseInput from './BaseInput.vue'
import type { Participant } from '../types/participant'

const props = defineProps<{
  participants: Participant[]
}>()

const form = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: ''
})

const errors = reactive({
  name: '',
  email: '',
  phone: '',
  birthDate: ''
})

const submitted = ref(false)

const emit = defineEmits<{
  'add-participant': [participant: {
    name: string
    email: string
    phone: string
    birthDate: string
  }]
}>()

const validateForm = (): boolean => {
  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.birthDate = ''

  let isValid = true

  if (!form.name.trim()) {
    errors.name = 'Введіть ім’я.'
    isValid = false
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!form.email.trim()) {
    errors.email = 'Введіть email.'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Введіть коректний email.'
    isValid = false
  } else {
    const emailExists = props.participants.some(
        participant =>
            participant.email.toLowerCase() === form.email.trim().toLowerCase()
    )

    if (emailExists) {
      errors.email = 'Учасник з таким email вже зареєстрований.'
      isValid = false
    }
  }

  const phoneRegex = /^\+380\d{9}$/

  if (!form.phone.trim()) {
    errors.phone = 'Введіть номер телефону.'
    isValid = false
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = 'Телефон має бути у форматі +380XXXXXXXXX.'
    isValid = false
  }

  if (!form.birthDate) {
    errors.birthDate = 'Виберіть дату народження.'
    isValid = false
  } else {
    const selectedDate = new Date(`${form.birthDate}T00:00:00`)
    const today = new Date()

    today.setHours(0, 0, 0, 0)

    if (selectedDate > today) {
      errors.birthDate = 'Дата народження не може бути в майбутньому.'
      isValid = false
    }
  }

  return isValid
}

const resetForm = () => {
  form.name = ''
  form.email = ''
  form.phone = ''
  form.birthDate = ''

  errors.name = ''
  errors.email = ''
  errors.phone = ''
  errors.birthDate = ''

  submitted.value = false
}

const submitForm = () => {
  submitted.value = true

  if (!validateForm()) {
    return
  }

  emit('add-participant', {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim(),
    birthDate: form.birthDate
  })

  resetForm()
}
</script>

<template>
  <section class="registration-form">
    <h2 class="mb-4">Реєстрація учасника</h2>

    <form @submit.prevent="submitForm">
      <BaseInput
          v-model="form.name"
          id="name"
          name="name"
          placeholder="Ім’я"
          :error="errors.name"
          required
      />

      <BaseInput
          v-model="form.email"
          id="email"
          name="email"
          type="email"
          placeholder="Email"
          :error="errors.email"
          required
      />

      <BaseInput
          v-model="form.phone"
          id="phone"
          name="phone"
          type="tel"
          placeholder="+380XXXXXXXXX"
          :error="errors.phone"
          required
      />

      <BaseInput
          v-model="form.birthDate"
          id="birthDate"
          name="birthDate"
          type="date"
          :error="errors.birthDate"
          required
      />

      <BaseButton type="submit">
        Зареєструватися
      </BaseButton>
    </form>

    <p
        v-if="submitted && !Object.values(errors).some(Boolean)"
        class="text-success mt-3"
    >
      Дані форми успішно пройшли валідацію.
    </p>
  </section>
</template>