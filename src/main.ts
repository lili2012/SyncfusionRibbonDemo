import App from './App.vue'
import { createApp,defineCustomElement } from 'vue'
import HelloWorld from "./components/HelloWorld.ce.vue"
import { registerLicense } from '@syncfusion/ej2-base';

HelloWorld.inheritAttrs = false;
const HelloWorldComponent = defineCustomElement(HelloWorld, { shadowRoot: true })
customElements.define('hello-world', HelloWorldComponent)

registerLicense('ORg4AjUWIQA/Gnt2XVhhQlJHfVtdWnxLflFzVWZTfFx6dVBWESFaRnZdR11gS3pTdEBgWXlbdXdS');
createApp(App).mount('#app')
