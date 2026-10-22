<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useAuthStore } from '../model/auth'
import { AppButton } from '@/shared/ui'

const authStore = useAuthStore()
const router = useRouter()

function logout(): void {
    authStore.logout()
    void router.push('/login')
}
</script>

<template>
    <AppButton severity="danger" @click="logout">Logout</AppButton>
</template>
