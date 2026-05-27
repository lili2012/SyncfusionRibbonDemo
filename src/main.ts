import App from './components/App.vue'
import { createApp} from 'vue'
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore, useCommandLineStore, useProgressStore } from 'sgcad';
import { createPinia } from 'pinia'
registerLicense('Ngo9BigBOggjGyl/VkV+XU9AclREQmFMYVF2R2VJdlR1cl9DZEwxOX1dQl9lSXtRcEdiXHZdcHVQT2NXUkc=');
const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
useCommandLineStore(pinia)
useProgressStore(pinia)
//const userStore = useUserStore(pinia)
app.use(pinia)
app.mount('#app')
//await userStore.initialize()


