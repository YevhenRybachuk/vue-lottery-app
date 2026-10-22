<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { useForm, useField } from 'vee-validate'
import * as yup from 'yup'
import { useAuthStore } from '@/features/auth'
import { AppButton, AppInput, useAppToast } from '@/shared/ui'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useAppToast()

const schema = yup.object({
    username: yup.string().required('Введіть username'),
    password: yup.string().min(6, 'Пароль має містити щонайменше 6 символів').required('Введіть пароль'),
})

const { handleSubmit, errors, isSubmitting } = useForm({
    validationSchema: schema,
    initialValues: { username: 'emilys', password: 'emilyspass' },
})
const { value: username } = useField<string>('username')
const { value: password } = useField<string>('password')

const onSubmit = handleSubmit(async (values) => {
    try {
        await authStore.login(values)
        const redirect = route.query.redirect
        const target = typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('//')
            ? redirect
            : '/users'
        await router.push(target)
    } catch (cause) {
        toast.error('Помилка авторизації', cause instanceof Error ? cause.message : 'Не вдалося увійти')
    }
})
</script>

<template>
    <div class="card shadow-sm p-4" style="max-width: 400px; width: 100%;">
        <h1 class="h3 mb-3 text-center">Авторизація</h1>
        <form novalidate @submit.prevent="onSubmit">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <AppInput
                    id="username"
                    v-model="username"
                    name="username"
                    placeholder="Введіть username"
                    :error="errors.username"
                />
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Пароль</label>
                <AppInput
                    id="password"
                    v-model="password"
                    name="password"
                    type="password"
                    placeholder="Введіть пароль"
                    :error="errors.password"
                />
            </div>
            <AppButton type="submit" class="w-100" :loading="isSubmitting">Увійти</AppButton>
        </form>
    </div>
</template>
