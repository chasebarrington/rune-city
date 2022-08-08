import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import router from './routes'
import VueNativeSock from "vue-native-websocket-vue3";

createApp(App)
    .use(router)
    .use(VueNativeSock, '' + import.meta.env.VITE_WEBSOCKET, {})
    .mount('#app')
