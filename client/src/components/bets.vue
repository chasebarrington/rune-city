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
            <tr v-for="(bet, index) in this.$auth.bets.slice().reverse()" :key="index" class="p-2">
                <td class="px-2 py-1">{{bet.game_type}}</td>
                <td class="px-2 py-1">{{bet.user}}</td>
                <td class="px-2 py-1">{{bet.bet}}</td>
                <td class="px-2 py-1" :class="bet.payout > 0 ? 'text-emerald-400' : 'text-rose-500'">{{bet.payout}}</td>
            </tr> 
        </tbody>
    </table>
    </div>
</template>
