<script setup lang="ts">
import AppHeader from './components/AppHeader.vue'
</script>

<template>
  <AppHeader />

  <main>
    <RouterView />
  </main>
</template>

<style lang="scss">
#app {
  min-height: 100vh;
}

main {
  padding-bottom: 40px;
}
</style>
