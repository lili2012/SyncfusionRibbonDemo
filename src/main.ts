import App from './App.vue'
import { createApp} from 'vue'
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore } from 'sgcad';
import { createPinia } from 'pinia'

registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfVhdW3xLflFzVWJTelt6d1ZWESFaRnZdR11lSXhTd0BkWHhXcH1RTWJV');

const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
app.use(pinia)
app.mount('#app')