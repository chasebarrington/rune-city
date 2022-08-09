import { defineStore } from "pinia";
import decode from "jwt-decode";

function isTokenExpired(token) {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
        return true;
    }
    return false;
}

// create pinia store for jwt token
export default defineStore({
    id: "auth",
    state: () => ({
        user: JSON.parse(localStorage.getItem('user')),
        token: localStorage.getItem('token'),
    }),
    actions: {
        login(user, token) {
            this.user = user;
            this.token = token;
            localStorage.setItem('user', JSON.stringify(user));
            localStorage.setItem('token', token);
            this.$router.push({ name: 'Dashboard' }); 
        },
        logout() {
            this.user = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        }
    },
    getters: {
        isLoggedIn() {
            const token = this.token;
            return !!token && !isTokenExpired(token);
        }
    }
});

