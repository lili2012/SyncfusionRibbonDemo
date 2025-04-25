import App from './App.vue'
import { createApp,defineCustomElement } from 'vue'
import HelloWorld from "./components/HelloWorld.ce.vue"
import { registerLicense } from '@syncfusion/ej2-base';

HelloWorld.inheritAttrs = false;
const HelloWorldComponent = defineCustomElement(HelloWorld, { shadowRoot: true })
customElements.define('hello-world', HelloWorldComponent)

registerLicense('Ngo9BigBOggjHTQxAR8/V1NNaF5cXmZCe0xwWmFZfVtgdVRMYllbRn9PIiBoS35Rc0VnWXhedHVVRmFdVUZ+VEBU');
                
createApp(App).mount('#app')
