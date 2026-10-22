<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container text-center py-3">
      <p class="mb-0 text-muted">
        &copy; {{ currentYear }} Vue Lottery App. Навчальний проєкт.
      </p>
    </div>
  </footer>
</template>

<style scoped lang="scss">
.app-footer {
  border-top: 1px solid #e9ecef;
  background-color: #f8f9fa;
  margin-top: auto;
}
</style>