import App from './components/App.vue'
import { createApp} from 'vue'
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore, useCommandLineStore, useProgressStore, useViewStore } from 'sgcad';
import { createPinia } from 'pinia'
registerLicense('Ngo9BigBOggjGyl/VkV+XU9AclRFQmFOYVF2R2VJe1R1d19FZkwgOX1dQl9lSXhRcUVnXHtbc3ZVQGRXUkc=');
const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
useCommandLineStore(pinia)
useProgressStore(pinia)
useViewStore(pinia)
//const userStore = useUserStore(pinia)
app.use(pinia)
app.mount('#app')
//await userStore.initialize()


