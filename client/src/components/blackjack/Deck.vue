<template>
    <div class="flex flex-wrap gap-x-1 gap-y-1 place-content-center relative mx-auto" >
        <div v-if="cards.length == 1" class="w-14 h-20 border-2 flex border-black bg-gradient-to-b from-rose-400 to-rose-500 rounded text-3xl drop-shadow-md hover:z-10 hover:scale-125 transition-transform">
            <div class="mx-auto mb-2 self-center text-4xl">?</div>
        </div>
        <div v-for="(card, index) in cards" :key="index">
            <Card :index="index"  class="card translate-x-72 transition-transform" :suit="card.suit" :face="card.face" :color="card.color" :glow-class="glowClass" />
        </div>
        <p class="absolute -top-4 -right-4 bg-zinc-900 border border-zinc-700 rounded-full h-fit px-2 py-1 z-50">{{handValue}}</p>
    </div>
</template>

<script>

import Card from './Card.vue'
export default {
    props: {
        cards: {
            type: Array,
            required: true
        },
        win: {
            type: Boolean,
            default: false
        },
        tie: {
            type: Boolean,
            default: false
        },
        finished: {
            type: Boolean,
            default: false
        },
        player: {
            type: Boolean,
            default: false
        }
    },
    updated() {

        // calculate card color from the card suit
        let cardColor = (cardSuit) => {
            let color = '';
            if(cardSuit === '♥' || cardSuit === '♦') {
                color = 'red';
            } else {
                color = 'black';
            }
            return color;
        }

        // update card color
        this.cards.forEach(card => {
            card.color = cardColor(card.suit);
        });

    },
    computed: {
        // calculate hand value
        handValue() {
            let value = 0;

            // calculate initial value
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].face === "A") {
                    value += 11;
                } else if (this.cards[i].face === "J" || this.cards[i].face === "Q" || this.cards[i].face === "K") {
                    value += 10;
                } else {
                    value += parseInt(this.cards[i].face);
                }
            }

            // check if A is in this.cards and value is over 21
            for (let i = 0; i < this.cards.length; i++) {
                if (this.cards[i].face === "A" && value > 21) {
                    value -= 10;
                }
            }

            return value;
        },

        glowClass() {
            if(this.win) {
                return 'shadow-emerald-500';
            } else if(this.tie) {
                return 'shadow-yellow-500';
            } else if (this.finished) {
                return 'shadow-rose-500';
            }
        }
    },
    updated() {
        var elements = document.getElementsByClassName("card");
        for(var i = 0; i < elements.length; i++) {
            let elem = elements[i];
            setTimeout(() => {
                elem.classList.remove('translate-x-72');
            }, 50 * elem.getAttribute('index'));
        }
    },
    methods: {
        deal() {
            var elements = document.getElementsByClassName("card");
            for(var i = 0; i < elements.length; i++) {
                let elem = elements[i];
                setTimeout(() => {
                    elem.classList.add('translate-x-72');
                }, 1);
            }
        }
    },  
    components: {
        Card
    }
}
</script>
