import App from './App.vue'
import { createApp} from 'vue'
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore, useCommandLineStore,useUserStore } from 'sgcad';
import { createPinia } from 'pinia'

registerLicense('Ngo9BigBOggjGyl/VkR+XU9Ff1RGQmFWfFN0Q3NbdVp4flFHcC0sT3RfQFtjSn5QdkdmWX1WeHBcRGtfUw==');

const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
useCommandLineStore(pinia)
const userStore = useUserStore(pinia)
app.use(pinia)
app.mount('#app')
userStore.initialize()
