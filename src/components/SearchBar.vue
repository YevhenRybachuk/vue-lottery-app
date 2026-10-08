<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue'
import BaseInput from './BaseInput.vue'

const searchQuery = ref('')

const emit = defineEmits<{
  'filter-by-name': [value: string]
}>()

let debounceTimer: ReturnType<typeof setTimeout> | undefined

watch(searchQuery, newValue => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }

  debounceTimer = setTimeout(() => {
    emit('filter-by-name', newValue.trim())
    debounceTimer = undefined
  }, 300)
})

onBeforeUnmount(() => {
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
})
</script>

<template>
  <div class="search-bar mb-4">
    <BaseInput
        v-model="searchQuery"
        id="participant-search"
        name="participant-search"
        placeholder="Пошук за ім’ям..."
    />
  </div>
</template>