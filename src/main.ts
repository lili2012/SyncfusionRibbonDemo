import App from './App.vue'
import { createApp,defineCustomElement } from 'vue'
import Drawing from "./components/Drawing.ce.vue"
import View from "./components/View.ce.vue"
import { registerLicense } from '@syncfusion/ej2-base';

Drawing.inheritAttrs = false;
const DrawingComponent = defineCustomElement(Drawing, { shadowRoot: true })
const ViewComponent = defineCustomElement(View, { shadowRoot: false })
customElements.define('drawing-page', DrawingComponent)
customElements.define('view-page', ViewComponent)
registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmZCe0xwWmFZfVtgdVRMYllbRn9PIiBoS35Rc0VnWXhedHVVRmFdVUZ+VEBU');
                
createApp(App).mount('#app')
