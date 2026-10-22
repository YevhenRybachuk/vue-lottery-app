<script setup lang="ts">
const props = withDefaults(
    defineProps<{
      type?: 'button' | 'submit' | 'reset'
      disabled?: boolean
      variant?:
          | 'primary'
          | 'secondary'
          | 'danger'
          | 'success'
          | 'outline-danger'
      size?: 'sm' | 'md' | 'lg'
      form?: string
    }>(),
    {
      type: 'button',
      disabled: false,
      variant: 'primary',
      size: 'md'
    }
)
</script>

<template>
  <button
      :type="props.type"
      :disabled="props.disabled"
      :form="props.form"
      :class="[
      'btn',
      `btn-${props.variant}`,
      {
        'btn-sm': props.size === 'sm',
        'btn-lg': props.size === 'lg'
      }
    ]"
  >
    <slot />
  </button>
</template>