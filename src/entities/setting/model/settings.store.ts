import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export type AppTheme = 'light' | 'dark'

export const useSettingsStore = defineStore('settings', () => {
    const theme = ref<AppTheme>('light')
    const isDark = computed(() => theme.value === 'dark')

    function setTheme(value: AppTheme): void {
        theme.value = value
    }

    function toggleTheme(): void {
        theme.value = isDark.value ? 'light' : 'dark'
    }

    return { theme, isDark, setTheme, toggleTheme }
}, { persist: { key: 'app-settings', pick: ['theme'] } })
