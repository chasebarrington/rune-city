<script>
import Game from '../../components/blackjack/Game.vue'
import bets from '../../components/bets.vue'
export default {
    components: {
        Game,
        bets
    },
    data() {
        return {
            win: 0,
            loss: 0,
            translatey: 0,
            opacity: 0,
            interpolatedBalance: 0
        }
    },
    computed: {
        user() {
            return this.$auth.user
        },
        balance() {
            return this.user.balance
        }
    },
    watch: {
        balance(nB, oB) {
            this.translatey = 10;
            this.opacity = 0;

            if(nB > oB) {
                this.win = nB - oB;
            } else {
                this.loss = oB - nB;
            }

            // animate the balance change
            this.interpolatedBalance = oB;
            let i = 0;
            let interval = setInterval(() => {
                i++;
                this.interpolatedBalance = Math.floor(oB + (nB - oB) * i / 100);
                if (i >= 100) {
                    clearInterval(interval);
                }
            }, 10);

            // set a timeout and slide the text in
            setTimeout(() => {
                this.translatey = 0;
                this.opacity = 100;
            }, 200);

            // set a timeout and remove the text
            setTimeout(() => {
                this.win = 0;
                this.loss = 0;
            }, 1000);
        }
    }
}
</script>

<template>
    <div class="antialiased bg-zinc-900 min-h-screen-nav w-screen text-center max-w-none px-4">
        <div class="py-6">
            <h1 class="text-zinc-100 mb-4">Blackjack</h1>
            <h2>feeling lucky, {{user.user}}? 🤑</h2>
            <div class="relative w-fit mx-auto">
                <p>balance: {{interpolatedBalance || balance}}</p>
                <p v-if="win" class="absolute right-0 text-emerald-400 transition-all" :class="'translate-y-' + translatey + ' opacity-' + opacity">+{{win}}</p>
                <p v-if="loss" class="absolute right-0 text-rose-400 transition-all" :class="'translate-y-' + translatey + ' opacity-' + opacity">-{{loss}}</p>
            </div>
            <Game></Game>
            <div class="pt-6">
                <bets></bets>
            </div>
        </div>
    </div>
</template>