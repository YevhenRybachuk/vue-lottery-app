import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from '@/app/providers/router'
import { useAuthStore } from '@/features/auth'
import { onTokensRefreshed } from '@/shared/api'
import { registerServices } from './providers/services'
import { setupUi } from './providers/ui'
import './styles/main.scss'

registerServices()

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
setupUi(app)

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
