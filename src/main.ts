import './style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import { ToastService } from 'primevue';
import { ConfirmationService } from 'primevue';
import router from './router/index';
import Material from '@primeuix/themes/material'

import App from './App.vue'

const pinia = createPinia()
const app = createApp(App)

app.use(PrimeVue, {
    theme: {
        preset: Material,
    }
})
app.use(pinia);
app.use(ToastService);
app.use(ConfirmationService);
app.use(router);
app.mount('#app')
