<script setup lang="ts">
import Dialog from 'primevue/dialog'
import AppButton from '../AppButton/AppButton.vue'

const props = withDefaults(defineProps<{
    modelValue: boolean
    title?: string
    message?: string
    confirmLabel?: string
    cancelLabel?: string
    loading?: boolean
}>(), {
    title: 'Підтвердження',
    confirmLabel: 'Підтвердити',
    cancelLabel: 'Скасувати',
    loading: false,
})

const emit = defineEmits<{
    'update:modelValue': [value: boolean]
    confirm: []
}>()

function close(): void {
    emit('update:modelValue', false)
}
</script>

<template>
    <Dialog
        :visible="props.modelValue"
        :header="title"
        modal
        :closable="!loading"
        :draggable="false"
        @update:visible="emit('update:modelValue', $event)"
    >
        <slot>{{ message }}</slot>
        <template #footer>
            <AppButton :label="cancelLabel" severity="secondary" :disabled="loading" @click="close" />
            <AppButton :label="confirmLabel" severity="danger" :loading="loading" @click="emit('confirm')" />
        </template>
    </Dialog>
</template>
