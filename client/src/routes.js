import {createRouter, createWebHistory} from 'vue-router'

const home = () => import('./views/home.vue')
const login = () => import('./views/login.vue')

const routes = [
    { path: '/', component: home, meta: { title: 'Home' }},
    { path: '/login', component: login, meta: { title: 'Login' }},
    { path: '/:pathMatch(.*)*', component: home, meta: { title: 'Home' }},
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

export default router