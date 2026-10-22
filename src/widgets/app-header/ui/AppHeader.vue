<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
import Logo from './Logo.vue'
import { LogoutButton, useAuthStore } from '@/features/auth'
import { AppButton } from '@/shared/ui'
import { useSettingsStore } from '@/entities/setting'

const authStore = useAuthStore()
const settings = useSettingsStore()
</script>

<template>
  <header class="app-header">
    <Logo />

    <AppNavigation />

    <div class="auth-actions">
      <AppButton severity="secondary" @click="settings.toggleTheme()">
        {{ settings.isDark ? 'Світла тема' : 'Темна тема' }}
      </AppButton>
      <template v-if="authStore.isAuthenticated">
        <span v-if="authStore.user" class="user-name me-3">
          {{ authStore.user.firstName }}
        </span>
        <LogoutButton />
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

:global(.app-dark) .app-header {
  border-bottom-color: #38443c;
}
</style>
