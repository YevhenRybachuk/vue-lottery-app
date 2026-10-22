<script setup lang="ts">
import { ref } from 'vue'
import { AppButton, AppConfirmDialog, AppTable } from '@/shared/ui'
import type { User } from '@/entities/user'

defineProps<{ users: User[] }>()

const emit = defineEmits<{ delete: [id: number] }>()
const showDeleteDialog = ref(false)
const userToDelete = ref<User | null>(null)
const columns = [
    { field: 'avatar', header: 'Аватар' },
    { field: 'name', header: "Ім'я" },
    { field: 'email', header: 'Email' },
    { field: 'username', header: 'Username' },
    { field: 'age', header: 'Вік' },
    { field: 'actions', header: 'Дії' },
]

function confirmDelete(): void {
    if (userToDelete.value) emit('delete', userToDelete.value.id)
    showDeleteDialog.value = false
}
</script>

<template>
    <AppTable :value="users" :columns="columns">
        <template #avatar="{ data }">
            <img
                v-if="data.image"
                :src="data.image"
                :alt="`${data.firstName} ${data.lastName}`"
                class="rounded-circle"
                width="40"
                height="40"
            >
            <span v-else>{{ data.firstName?.[0] }}{{ data.lastName?.[0] }}</span>
        </template>
        <template #name="{ data }">
            <RouterLink :to="`/users/${data.id}`">{{ data.firstName }} {{ data.lastName }}</RouterLink>
        </template>
        <template #username="{ data }">@{{ data.username }}</template>
        <template #actions="{ data }">
            <div class="d-flex gap-2">
                <RouterLink :to="`/users/${data.id}`" class="btn btn-sm btn-outline-primary">Деталі</RouterLink>
                <RouterLink :to="`/users/${data.id}/edit`" class="btn btn-sm btn-outline-secondary">Редагувати</RouterLink>
                <AppButton severity="danger" @click="userToDelete = data; showDeleteDialog = true">
                    Видалити
                </AppButton>
            </div>
        </template>
    </AppTable>

    <AppConfirmDialog
        v-model="showDeleteDialog"
        title="Підтвердження видалення"
        confirm-label="Так, видалити"
        cancel-label="Ні"
        @confirm="confirmDelete"
    >
        <p v-if="userToDelete" class="mb-0">
            Видалити користувача <strong>{{ userToDelete.firstName }} {{ userToDelete.lastName }}</strong>
            (@{{ userToDelete.username }})?
        </p>
    </AppConfirmDialog>
</template>
