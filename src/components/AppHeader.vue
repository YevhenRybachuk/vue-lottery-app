<script setup lang="ts">
import AppNavigation from './AppNavigation.vue'
</script>

<template>
  <header class="app-header">
    <RouterLink to="/" class="logo">
      Vue Lottery
    </RouterLink>

    <AppNavigation />

    <RouterLink to="/login" class="login-link">
      Увійти
    </RouterLink>
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

.logo {
  color: #222;
  font-size: 22px;
  font-weight: 700;
  text-decoration: none;
}

.login-link {
  padding: 8px 16px;
  border-radius: 6px;
  background: #0d6efd;
  color: #fff;
  text-decoration: none;
}

.login-link:hover {
  background: #0b5ed7;
}
</style>
