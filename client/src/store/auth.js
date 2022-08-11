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
        },
        logout() {
            this.user = null;
            this.token = null;
            localStorage.removeItem('user');
            localStorage.removeItem('token');
        },
        setBalance(balance) {
            this.user.balance = balance;
            localStorage.setItem('user', JSON.stringify(this.user));
        }
    },
    getters: {
        isLoggedIn() {
            return !!this.token && !isTokenExpired(this.token);
        }
    }
});

