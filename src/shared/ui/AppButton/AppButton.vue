<script setup lang="ts">
import Button from 'primevue/button'

withDefaults(defineProps<{
    label?: string
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
    loading?: boolean
    severity?: 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'help' | 'danger' | 'contrast'
}>(), { type: 'button', disabled: false, loading: false, severity: 'primary' })

defineEmits<{ click: [event: MouseEvent] }>()
</script>

<template>
    <Button
        :label="label"
        :type="type"
        :disabled="disabled"
        :loading="loading"
        :severity="severity"
        @click="$emit('click', $event)"
    >
        <slot />
    </Button>
</template>
