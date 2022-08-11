<script>
export default {
    data() {
        return {
            last_recv: 0
        }
    },
    computed: {
        bets() {
            return this.$auth.bets
        }
    },
    mounted() {
        this.$options.sockets.onmessage = (msg) => {

            // if we received a message within the last 100ms, ignore it
            if (this.last_recv + 100 > Date.now()) return;
        
            const message = JSON.parse(msg.data);
            const arr = Array.isArray(message);

            if (message.type != 'bet' && !arr) {
                return;
            }

            if(arr && message.length > 0 && message[0].type != 'bet') {
                return;
            }

            let bets = this.bets;

            if(arr)
                bets = message;
            else {
                if(bets.length > 6) {
                    bets.shift();
                }
                bets.push(message);
            }

            this.$auth.setBets(bets);
        }
    }
}
</script>

<template>
    <div class="border overflow-y-hidden border-zinc-700 mx-auto w-fit rounded-lg">
    <table class="table-auto text-zinc-100 border-collapse rounded-lg">
        <thead>
            <tr>
                <th class="px-2 py-1">Game</th>
                <th class="px-2 py-1">Player</th>
                <th class="px-2 py-1">Bet</th>
                <th class="px-2 py-1">Payout</th>
            </tr>
        </thead>
        <tbody class="bg-slate-700 text-blue-300 border-collapse">
            <tr v-for="(bet, index) in bets.slice().reverse()" :key="index" class="p-2">
                <td class="px-2 py-1">{{bet.game_type}}</td>
                <td class="px-2 py-1">{{bet.user}}</td>
                <td class="px-2 py-1">{{bet.bet}}</td>
                <td class="px-2 py-1">{{bet.payout}}</td>
            </tr> 
        </tbody>
    </table>
    </div>
</template>
