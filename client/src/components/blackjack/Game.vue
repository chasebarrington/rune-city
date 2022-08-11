<template>
    <body>
        <div v-if='!err' class="max-w-lg mx-auto">
            <div class="bg-gradient-to-b from-emerald-900 to-emerald-700 border border-emerald-400 h-fit py-12 mx-auto rounded-lg rounded-b-none overflow-x-hidden grid gap-y-12 mt-6">
                <Deck ref="deck" :cards="game.dealer"></Deck>
                <Deck ref="deck" :cards="game.hand" :player="true" :win="game.win" :tie="game.tie" :finished="game.finished"></Deck>
            </div>
            <div class="border border-zinc-700 mx-auto px-4 py-4 rounded-lg rounded-t-none w-full">
                <div class="flex flex-wrap gap-x-4 gap-y-4 place-content-center" v-if="game.finished">
                    <input type="text" v-model="bet" class="appearance-none border border-zinc-700 rounded w-20 py-2 px-3 bg-zinc-800 text-zinc-200" placeholder="1000">
                    <Button v-on:click="double" color="emerald">2x</Button>
                    <Button v-on:click="half" color="slate">1/2</Button>
                    <Button v-on:click="deal" color="slate" _class="group">
                        Deal
                        <svg class="inline mb-1 fill-blue-300 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
                        <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
                        </svg>
                    </Button>
                </div>
                <div v-if="!game.finished" class="flex flex-wrap gap-x-4 gap-y-4 place-content-center">
                    <p class="self-center py-2 px-2 bg-zinc-800 border border-zinc-700 rounded-lg">Bet: {{game.bet}}</p>
                    <Button v-on:click="hit" color="emerald">Hit</Button>
                    <Button v-on:click="stand" color="slate">Stand</Button>
                </div>
            </div>
        </div>
    </body>
</template>

<script>
import Deck from './Deck.vue'
import Button from '../ui/Button.vue'
export default ({
    data(){
        return {
            game: {
                hand: [],
                dealer: [],
                bet: 0,
                finished: false,
                win: false,
                tie: false
            },
            bet: '',
            err: false
        }
    },
    mounted(){
        this.$socket.sendObj({
            type: 'game',
            game_type: 'blackjack',
            action: 'join',
            token: this.$auth.token,
        });

        this.$options.sockets.onmessage = (msg) => {
            const message = JSON.parse(msg.data);

            // if message is not a game message, ignore it
            if(message.type !== 'game') return;
            if(message.game_type !== 'blackjack') return;

            // if message is a game message, handle it
            if (message.game)
                this.game = message.game;

            if(message.balance)
                this.$auth.setBalance(message.balance);
        }
    },
    methods:{
        double(){
            this.bet *= 2;
        },
        half(){
            this.bet /= 2;
        },
        hit(){
            this.$socket.sendObj({
                type: 'game',
                game_type: 'blackjack',
                action: 'hit',
                token: this.$auth.token,
            });
        },
        stand(){
            this.$socket.sendObj({
                type: 'game',
                game_type: 'blackjack',
                action: 'stand',
                token: this.$auth.token,
            });
        },
        deal(){
            if(this.bet == '')
                this.bet = 10;

            this.$socket.sendObj({
                type: 'game',
                game_type: 'blackjack',
                action: 'deal',
                bet: this.bet,
                token: this.$auth.token,
            });

           this.$refs.deck.deal();
        }
    },
    components:{
        Deck,
        Button
    },
})
</script>
