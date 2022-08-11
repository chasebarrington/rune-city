
<script>
import gamecard from '../components/ui/gamecard.vue'
import bets from '../components/bets.vue'
export default {
    components: {
        gamecard,
        bets
    },
    computed: {
        user() {
            return this.$auth.user
        },
        balance() {
            return this.user.balance
        }
    }
}
</script>

<template>
    <div class="antialiased bg-zinc-900 min-h-screen-nav w-full text-center max-w-none px-4">
        <div class="py-6">
            <h1 class="text-zinc-100 mb-4">Dashboard</h1>
            <h2>welcome {{user.user}} 👋</h2>
            <div class="relative w-fit mx-auto">
                <p>balance: {{balance}}</p>
            </div>
            <div class="flex flex-wrap gap-x-6 gap-y-2 m-10 mx-auto place-content-center max-w-6xl">
                <gamecard title="Blackjack" to="/blackjack" img="https://osgamble.mo.cloudinary.net/H4lE3TU.png"></gamecard>
            </div>
        </div>
        <bets></bets>
    </div>
</template>