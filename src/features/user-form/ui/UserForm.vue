<script setup lang="ts">
import { watch } from 'vue'
import { useForm, useField } from 'vee-validate'
import { userCreateValidationSchema, userEditValidationSchema } from '../model/user.schema'
import type { CreateUserDto, UpdateUserDto } from '@/entities/user'
import { AppButton, AppInput } from '@/shared/ui'

const props = withDefaults(defineProps<{
    initialValues?: Partial<CreateUserDto>
    isSaving?: boolean
    submitLabel?: string
    isEditMode?: boolean
    error?: string | null
    successMessage?: string | null
}>(), {
    initialValues: () => ({}),
    isSaving: false,
    submitLabel: 'Зберегти',
    isEditMode: false,
    error: null,
    successMessage: null,
})

const emit = defineEmits<{ submit: [values: CreateUserDto | UpdateUserDto] }>()
const schema = props.isEditMode ? userEditValidationSchema : userCreateValidationSchema
const { handleSubmit, errors, setValues } = useForm({
    validationSchema: schema,
    initialValues: {
        firstName: props.initialValues.firstName || '',
        lastName: props.initialValues.lastName || '',
        email: props.initialValues.email || '',
        username: props.initialValues.username || '',
        password: props.initialValues.password || '',
        age: props.initialValues.age ?? 18,
        gender: props.initialValues.gender || 'male',
        phone: props.initialValues.phone || '',
    },
})

watch(() => props.initialValues, (values) => {
    setValues({
        firstName: values.firstName || '',
        lastName: values.lastName || '',
        email: values.email || '',
        username: values.username || '',
        password: values.password || '',
        age: values.age ?? 18,
        gender: values.gender || 'male',
        phone: values.phone || '',
    })
}, { deep: true })

const { value: firstName } = useField<string>('firstName')
const { value: lastName } = useField<string>('lastName')
const { value: email } = useField<string>('email')
const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')
const { value: age } = useField<number>('age')
const { value: gender } = useField<string>('gender')
const { value: phone } = useField<string>('phone')

const onSubmit = handleSubmit((values) => {
    const payload: Record<string, unknown> = { ...values }
    if (props.isEditMode && !payload.password) delete payload['password']
    emit('submit', payload as unknown as CreateUserDto | UpdateUserDto)
})
</script>

<template>
    <form class="card p-4 shadow-sm user-form" novalidate @submit.prevent="onSubmit">
        <div v-if="successMessage" class="alert alert-success" role="status">{{ successMessage }}</div>
        <div v-if="error" class="alert alert-danger" role="alert">{{ error }}</div>

        <div class="row g-3">
            <div class="col-md-6">
                <label for="firstName" class="form-label">Ім'я *</label>
                <AppInput id="firstName" v-model="firstName" name="firstName" :error="errors.firstName" required />
            </div>
            <div class="col-md-6">
                <label for="lastName" class="form-label">Прізвище *</label>
                <AppInput id="lastName" v-model="lastName" name="lastName" :error="errors.lastName" required />
            </div>
            <div class="col-md-6">
                <label for="email" class="form-label">Email *</label>
                <AppInput id="email" v-model="email" name="email" type="email" placeholder="user@example.com" :error="errors.email" required />
            </div>
            <div class="col-md-6">
                <label for="username" class="form-label">Username *</label>
                <AppInput id="username" v-model="username" name="username" :error="errors.username" required />
            </div>
            <div class="col-md-6">
                <label for="password" class="form-label">Пароль {{ isEditMode ? '(необов’язково)' : '*' }}</label>
                <AppInput
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    :placeholder="isEditMode ? 'Залиште порожнім, щоб не змінювати' : 'Введіть пароль'"
                    :error="errors.password"
                    :required="!isEditMode"
                />
            </div>
            <div class="col-md-6">
                <label for="age" class="form-label">Вік *</label>
                <AppInput id="age" v-model.number="age" name="age" type="number" :error="errors.age" required />
            </div>
            <div class="col-md-6">
                <label for="gender" class="form-label">Стать *</label>
                <select id="gender" v-model="gender" class="form-select" :class="{ 'is-invalid': errors.gender }">
                    <option value="male">male</option>
                    <option value="female">female</option>
                </select>
                <div class="invalid-feedback">{{ errors.gender }}</div>
            </div>
            <div class="col-md-6">
                <label for="phone" class="form-label">Телефон *</label>
                <AppInput id="phone" v-model="phone" name="phone" type="tel" placeholder="+380971234567" :error="errors.phone" required />
            </div>
        </div>

        <div class="mt-4 d-flex gap-2">
            <AppButton type="submit" severity="success" :loading="isSaving">{{ submitLabel }}</AppButton>
            <RouterLink to="/users" class="btn btn-secondary">Скасувати</RouterLink>
        </div>
    </form>
</template>

<style scoped lang="scss">
.user-form {
    max-width: 800px;
}
</style>
