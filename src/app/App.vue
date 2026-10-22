<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import DefaultLayout from './layouts/DefaultLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'
import { AppToast } from '@/shared/ui'
import { useSettingsStore } from '@/entities/setting'

const route = useRoute()
const settings = useSettingsStore()

const layout = computed(() => {
  return route.meta.layout === 'auth' ? AuthLayout : DefaultLayout
})
</script>

<template>
  <div class="app-root" :class="{ 'app-dark': settings.isDark }">
    <component :is="layout">
      <RouterView />
    </component>
    <AppToast />
  </div>
</template>

<style lang="scss">
.app-root {
  min-height: 100vh;
  background: var(--app-background, #fff);
  color: var(--app-foreground, #212529);
}

.app-root.app-dark {
  --app-background: #151a17;
  --app-foreground: #e7eee9;
  background: var(--app-background);
  color: var(--app-foreground);
}

.app-dark .default-layout,
.app-dark .app-header {
  background: #1d2520;
  color: var(--app-foreground);
}

.app-dark .user-card,
.app-dark .user-form,
.app-dark .card,
.app-dark .list-group-item {
  background-color: #202923;
  color: var(--app-foreground);
}

.app-dark .text-muted,
.app-dark .user-name {
  color: #b6c3ba !important;
}
</style>
