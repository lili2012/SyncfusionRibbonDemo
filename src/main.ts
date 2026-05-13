import App from './components/App.vue'
import { createApp} from 'vue'
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore, useCommandLineStore, useProgressStore } from 'sgcad';
import { createPinia } from 'pinia'

registerLicense('Ngo9BigBOggjGyl/VkV+XU9AclRHQmFPYVF2R2VJdlR0cF9CY0wxOX1dQl9lSXpRcEdiXXpcdHRRQ2RXUkc=');

const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
useCommandLineStore(pinia)
useProgressStore(pinia)
//const userStore = useUserStore(pinia)
app.use(pinia)
app.mount('#app')
//await userStore.initialize()


