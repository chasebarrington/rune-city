import { createApp, markRaw } from 'vue';
import App from './App.vue'
import './index.css'
import router from './routes'
import VueNativeSock from "vue-native-websocket-vue3";
import { createPinia } from 'pinia'
import { useSocketStoreWithOut } from './store/useSocketStore';
import useAuthStore from './store/auth'

const app = createApp(App);
const pinia = createPinia();
const store = useSocketStoreWithOut();
const authStore = useAuthStore();

app.config.globalProperties.$auth = authStore;

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

router.beforeEach((to) => {
    if((to.name == 'Login' || to.name == 'Register') && authStore.isLoggedIn) {
        return '/dashboard';
    }
    if ((to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Home') && !authStore.isLoggedIn) {
        authStore.logout();
        return '/login'
    }
})

export default app;