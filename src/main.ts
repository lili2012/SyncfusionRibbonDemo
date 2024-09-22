import App from './App.vue'
import { createApp,defineCustomElement } from 'vue'
import HelloWorld from "./components/HelloWorld.ce.vue"
import { registerLicense } from '@syncfusion/ej2-base';

const HelloWorldComponent = defineCustomElement(HelloWorld, { shadowRoot: true })
customElements.define('hello-world', HelloWorldComponent)

registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhIfkx/WmFZfVpgdVRMY15bQHdPIiBoS35RckVqWH5ec3RRQ2RYWEB1');
createApp(App).mount('#app')
