import {createRouter, createWebHistory} from 'vue-router'
import useAuthStore from './store/auth'

const home = () => import('./views/home.vue')
const login = () => import('./views/login.vue')
const register = () => import('./views/register.vue')
const dashboard = () => import('./views/dashboard.vue')

const routes = [
    { path: '/', component: home, name: 'Home'},
    { path: '/login', component: login, name: 'Login'},
    { path: '/register', component: register, name: 'Register'},
    { path: '/dashboard', component: dashboard, name: 'Dashboard'},
    { path: '/:pathMatch(.*)*', component: home, name: 'Home'},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

router.beforeEach((to) => {
    const store = useAuthStore();
    if ((to.name !== 'Login' && to.name !== 'Register' && to.name !== 'Home') && !store.isLoggedIn) {
        console.log('not logged in'); 
        return '/login'
    }
})

export default router