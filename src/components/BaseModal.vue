<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'

defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

const closeModal = () => {
  emit('update:modelValue', false)
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleEscape)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <Transition name="modal">
    <div
        v-if="modelValue"
        class="modal-backdrop-custom"
        @click.self="closeModal"
    >
      <div
          class="modal-dialog-custom"
          role="dialog"
          aria-modal="true"
      >
        <div class="modal-content">
          <div class="modal-header">
            <slot name="header" />

            <button
                type="button"
                class="btn-close"
                aria-label="Закрити"
                @click="closeModal"
            />
          </div>

          <div class="modal-body">
            <slot />
          </div>

          <div class="modal-footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped lang="scss">
.modal-backdrop-custom {
  position: fixed;
  inset: 0;
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: rgb(0 0 0 / 50%);
}

.modal-dialog-custom {
  width: 100%;
  max-width: 500px;
}

.modal-content {
  border: 0;
  border-radius: 0.5rem;
  background-color: #fff;
  box-shadow: 0 0.5rem 1rem rgb(0 0 0 / 15%);
}

.modal-header,
.modal-footer {
  padding: 1rem;
}

.modal-body {
  padding: 1rem;
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>