import { createApp, markRaw } from 'vue';
import App from './App.vue'
import './index.css'
import router from './routes'
import VueNativeSock from "vue-native-websocket-vue3";
import { createPinia } from 'pinia'
import { useSocketStoreWithOut } from './store/useSocketStore';

const app = createApp(App);
const pinia = createPinia();
const store = useSocketStoreWithOut();

pinia.use(({ store }) => {
    store.$router = markRaw(router)
});

app.use(pinia);
app.use(VueNativeSock, '' + import.meta.env.VITE_WEBSOCKET, {
    store: store,
    format: "json",
    connectManually: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 3000
});

app.use(router);

app.mount('#app');

export default app;