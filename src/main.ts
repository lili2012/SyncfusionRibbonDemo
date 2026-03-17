import App from './App.vue'
import { createApp} from 'vue'
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore, useCommandLineStore,useUserStore } from 'sgcad';
import { createPinia } from 'pinia'

registerLicense('Ngo9BigBOggjGyl/VkV+XU9AclRGQmJPYVF2R2VJflR1fV9DY0wgOX1dQl9lSX1ScUVhWXxccXdTQmBXUkc=');

const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
useCommandLineStore(pinia)
const userStore = useUserStore(pinia)
app.use(pinia)
app.mount('#app')
userStore.initialize()
