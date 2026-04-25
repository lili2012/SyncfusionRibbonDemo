import App from './components/App.vue'
import { createApp} from 'vue'
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore, useCommandLineStore,  } from 'sgcad';
import { createPinia } from 'pinia'
import { UploadService, rpcImpl } from "sgcad";
import {credential, initializeCos} from "@/utils/Cos"
registerLicense('Ngo9BigBOggjGyl/VkV+XU9AclRGQmJPYVF2R2VJflR1fV9DY0wgOX1dQl9lSX1ScUVhWXxccXdTQmBXUkc=');

const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
useCommandLineStore(pinia)
//const userStore = useUserStore(pinia)
app.use(pinia)
app.mount('#app')
//await userStore.initialize()
const upload = new UploadService(rpcImpl, false, false);
upload.getCredential({}).then((res:Credential) => {
  Object.assign(credential, res);
  initializeCos(credential);
}).catch((err:any) => {
  console.error(err)
})

