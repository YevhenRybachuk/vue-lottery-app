<script setup lang="ts">
defineProps<{
  modelValue: string
  type?: 'text' | 'email' | 'tel' | 'date'
  placeholder?: string
  id?: string
  name?: string
  required?: boolean
  disabled?: boolean
  error?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const updateValue = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <div class="mb-3">
    <input
      :id="id"
      :name="name"
      :type="type ?? 'text'"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      :disabled="disabled"
      :class="['form-control', { 'is-invalid': error }]"
      @input="updateValue"
    >

    <div
      v-if="error"
      class="invalid-feedback"
    >
      {{ error }}
    </div>
  </div>
</template>