import App from './App.vue'
import { createApp } from 'vue'
import { defineCustomElement } from 'vue'
import HelloWorld from './components/HelloWorld.ce.vue'
customElements.define('hello-world', defineCustomElement(HelloWorld));

import { registerLicense } from '@syncfusion/ej2-base';

registerLicense('Ngo9BigBOggjHTQxAR8/V1NCaF1cWWhIfkx/WmFZfVpgdVRMY15bQHdPIiBoS35RckVqWH5ec3RRQ2RYWEB1');
createApp(App).mount('#app')
