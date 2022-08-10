<script>
export default {
    props: {
       title: {
           required: true
       },
       img: {
           required: true
       },
       to: {
           required: true
       },
       small: {
           default:'175'
       },
       large: {
           default:'250'
       }
    },
}
</script>

<template>
    <router-link :to="to" class="w-fit group">
        <img class="transition-transform group-hover:scale-110" :alt="title"
        :srcset="img + '?tx=w_'+small + ' ' + small + 'w,'
        + ' ' + img + '?tx=w_'+large + ' ' + large + 'w'"
        :sizes="'(max-width: 640px) ' + small + 'px, ' + large + 'px'">
        <h2 class="pt-2 transition-all text-zinc-400 group-hover:text-zinc-50 group-hover:translate-y-2">Blackjack</h2>
    </router-link>
</template>