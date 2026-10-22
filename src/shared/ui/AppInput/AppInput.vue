<script setup lang="ts">
import InputText from 'primevue/inputtext'

withDefaults(defineProps<{
    modelValue: string | number
    type?: string
    id?: string
    ariaLabel?: string
    name?: string
    placeholder?: string
    disabled?: boolean
    required?: boolean
    invalid?: boolean
    error?: string
}>(), { type: 'text', disabled: false, required: false, invalid: false })

const emit = defineEmits<{ 'update:modelValue': [value: string | number] }>()

function updateValue(value: string | undefined): void {
    emit('update:modelValue', value ?? '')
}
</script>

<template>
    <div class="app-input">
        <InputText
            :id="id"
            :aria-label="ariaLabel"
            :name="name"
            :model-value="String(modelValue ?? '')"
            :type="type"
            :placeholder="placeholder"
            :disabled="disabled"
            :required="required"
            :invalid="invalid || Boolean(error)"
            :aria-describedby="error && id ? `${id}-error` : undefined"
            @update:model-value="updateValue"
        />
        <small v-if="error" :id="id ? `${id}-error` : undefined" class="app-input__error" role="alert">
            {{ error }}
        </small>
    </div>
</template>

<style scoped lang="scss">
.app-input {
    display: grid;
    gap: 0.25rem;
}

.app-input__error {
    color: var(--p-red-600);
}
</style>
