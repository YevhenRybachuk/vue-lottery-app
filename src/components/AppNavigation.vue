<script setup lang="ts">
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
</script>

<template>
  <nav class="navigation">
    <RouterLink to="/" active-class="" exact-active-class="router-link-active">
      Головна
    </RouterLink>
    <RouterLink to="/about">
      Про автора
    </RouterLink>
    <RouterLink to="/users">
      Користувачі
    </RouterLink>
    <RouterLink v-if="!authStore.isAuthenticated" to="/login">
      Login
    </RouterLink>
  </nav>
</template>

<style scoped lang="scss">
.navigation {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;

  a {
    color: #555;
    text-decoration: none;
    padding: 8px 0;
    border-bottom: 2px solid transparent;
    transition: color 0.2s ease;
  }

  a:hover {
    color: #0d6efd;
  }

  a.router-link-active {
    color: #0d6efd;
    border-bottom-color: #0d6efd;
    font-weight: 600;
  }
}
</style>