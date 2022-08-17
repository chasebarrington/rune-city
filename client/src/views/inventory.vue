<script>
import gamecard from '../components/ui/gamecard.vue'
import bets from '../components/bets.vue'
export default {
    components: {
        bets
    },
    computed: {
        user() {
            return this.$auth.user
        }
    }
}
</script>

<template>
    <div class="antialiased bg-zinc-900 min-h-screen-nav w-full text-center max-w-none px-4">
        <div class="py-6">
            <h1 class="text-zinc-100 mb-4">Inventory</h1>
            <h2>your items, {{user.user}} 💸</h2>
            <div class="grid"></div>
        </div>
        <bets></bets>
    </div>
</template>