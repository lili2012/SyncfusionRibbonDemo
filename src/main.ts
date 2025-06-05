import App from './App.vue'
import { createApp,defineCustomElement } from 'vue'
import Drawing from "./components/Drawing.ce.vue"
import { registerLicense } from '@syncfusion/ej2-base';
import { useSelectionSetStore } from 'sgcad';
import { createPinia } from 'pinia'
Drawing.inheritAttrs = false;
const DrawingComponent = defineCustomElement(Drawing, { shadowRoot: true })
customElements.define('drawing-page', DrawingComponent)

registerLicense('ORg4AjUWIQA/Gnt2XFhhQlJHfVldW3xLflFzVWJTell6d11WESFaRnZdR11mSXlTd0BrWHxfeXxRTWJV');
const pinia = createPinia()
const app = createApp(App)
useSelectionSetStore(pinia)
app.use(pinia)
app.mount('#app')