import {createRouter, createWebHistory} from 'vue-router'

const home = () => import('./views/home.vue')
const login = () => import('./views/login.vue')
const register = () => import('./views/register.vue')
const dashboard = () => import('./views/dashboard.vue')
const inventory = () => import('./views/inventory.vue')
const blackjack = () => import('./views/games/blackjack.vue')

const routes = [
    { path: '/', component: home, name: 'Home'},
    { path: '/login', component: login, name: 'Login'},
    { path: '/register', component: register, name: 'Register'},
    { path: '/dashboard', component: dashboard, name: 'Dashboard'},
    { path: '/inventory', component: inventory, name: 'Inventory'},
    { path: '/blackjack', component: blackjack, name: 'Blackjack'},
    { path: '/:pathMatch(.*)*', component: home, name: 'Home'},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router