<script setup lang="ts">
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

defineProps<{
    value: object[]
    columns: { field: string; header: string }[]
    loading?: boolean
}>()
</script>

<template>
    <DataTable :value="value" :loading="loading" striped-rows responsive-layout="scroll">
        <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header">
            <template #body="slotProps">
                <slot :name="column.field" :data="slotProps.data">
                    {{ (slotProps.data as Record<string, unknown>)[column.field] }}
                </slot>
            </template>
        </Column>
    </DataTable>
</template>
