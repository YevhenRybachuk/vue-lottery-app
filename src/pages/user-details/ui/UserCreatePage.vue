<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { UserForm } from '@/features/user-form'
import type { CreateUserDto, UpdateUserDto } from '@/entities/user'
import { UserService } from '@/entities/user'

const router = useRouter()
const isSaving = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

async function handleSubmit(values: CreateUserDto | UpdateUserDto) {
  isSaving.value = true
  error.value = null
  successMessage.value = null

  try {
    const userService = new UserService()
    await userService.create(values as CreateUserDto)
    successMessage.value = 'РљРѕСЂРёСЃС‚СѓРІР°С‡Р° СѓСЃРїС–С€РЅРѕ СЃС‚РІРѕСЂРµРЅРѕ!'
    setTimeout(() => {
      router.push('/users')
    }, 1000)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'РќРµ РІРґР°Р»РѕСЃСЏ СЃС‚РІРѕСЂРёС‚Рё РєРѕСЂРёСЃС‚СѓРІР°С‡Р°'
  } finally {
    isSaving.value = false
  }
}
</script>

<template>
  <section class="user-create container py-4">
    <RouterLink to="/users" class="btn btn-outline-secondary btn-sm mb-3">
      в†ђ Р”Рѕ СЃРїРёСЃРєСѓ РєРѕСЂРёСЃС‚СѓРІР°С‡С–РІ
    </RouterLink>

    <h1 class="h3 mb-4">РЎС‚РІРѕСЂРµРЅРЅСЏ РЅРѕРІРѕРіРѕ РєРѕСЂРёСЃС‚СѓРІР°С‡Р°</h1>

    <UserForm
        :is-saving="isSaving"
        submit-label="РЎС‚РІРѕСЂРёС‚Рё РєРѕСЂРёСЃС‚СѓРІР°С‡Р°"
        :error="error"
        :success-message="successMessage"
        @submit="handleSubmit"
    />
  </section>
</template>