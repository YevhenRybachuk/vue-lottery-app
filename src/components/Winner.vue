<script setup lang="ts">
import BaseButton from './BaseButton.vue'
import type { Participant } from '../types/participant'

defineProps<{
  winner: Participant
}>()

const emit = defineEmits<{
  remove: [id: string]
}>()
</script>

<template>
  <div class="card h-100">
    <div class="card-body">
      <div class="d-flex justify-content-between align-items-start">
        <div>
          <h5 class="card-title mb-2">
            {{ winner.name }}
          </h5>

          <p class="card-text mb-1">
            {{ winner.email }}
          </p>

          <p class="card-text text-muted mb-0">
            {{ winner.phone }}
          </p>
        </div>

        <BaseButton
            variant="outline-danger"
            size="sm"
            @click="emit('remove', winner.id)"
        >
          Видалити
        </BaseButton>
      </div>
    </div>
  </div>
</template>