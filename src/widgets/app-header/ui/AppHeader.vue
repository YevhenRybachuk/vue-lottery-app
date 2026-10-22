<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppNavigation from './AppNavigation.vue'
import Logo from './Logo.vue'
import { useAuthStore } from '@/features/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <header class="app-header">
    <Logo />

    <AppNavigation />

    <div class="auth-actions">
      <template v-if="authStore.isAuthenticated">
        <span v-if="authStore.user" class="user-name me-3">
          {{ authStore.user.firstName }}
        </span>
        <button type="button" class="btn btn-outline-danger btn-sm" @click="handleLogout">
          Logout
        </button>
      </template>
      <template v-else>
        <RouterLink to="/login" class="login-link">
          Login
        </RouterLink>
      </template>
    </div>
  </header>
</template>

<style scoped lang="scss">
.app-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  padding: 18px 5%;
  border-bottom: 1px solid #ddd;
  background: #fff;
}

.auth-actions {
  display: flex;
  align-items: center;
}

.user-name {
  font-weight: 600;
  color: #333;
}

.login-link {
  padding: 8px 16px;
  border-radius: 6px;
  background: #0d6efd;
  color: #fff;
  text-decoration: none;

  &:hover {
    background: #0b5ed7;
  }
}
</style>