import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { onTokensRefreshed } from './api/http-client'
import './assets/styles/main.scss'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)

const authStore = useAuthStore()

onTokensRefreshed(({ accessToken, refreshToken }) => {
    authStore.setTokens(accessToken, refreshToken)
})

if (authStore.accessToken) {
    try {
        await authStore.fetchCurrentUser()
    } catch {
        // Session cleanup handled in http client
    }
}

app.use(router)
app.mount('#app')