<script setup lang="ts">
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="default-layout d-flex flex-column min-vh-100">
    <AppHeader />
    <main class="flex-grow-1 py-4">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>