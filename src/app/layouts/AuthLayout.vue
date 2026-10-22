<script setup lang="ts">
import { AppFooter } from '@/widgets/app-footer'
</script>

<template>
  <div class="auth-layout d-flex flex-column min-vh-100 bg-light">
    <main class="flex-grow-1 d-flex align-items-center justify-content-center py-5">
      <slot />
    </main>
    <AppFooter />
  </div>
</template>
