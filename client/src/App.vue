<script>
import chat from './components/chat.vue'
import navbar from './components/navbar.vue'
export default {
  data() {
    return {
      toggle: true
    }
  },
  mounted() {
    this.$options.sockets.onmessage = (msg) => {

        const message = JSON.parse(msg.data);
        const arr = Array.isArray(message);

        if (message.type != 'bet' && !arr) 
            return;

        if(arr && message.length > 0 && message[0].type != 'bet') 
            return;

        if(arr) {
            this.$auth.bets = message;
        } else {
            if(this.$auth.bets.length > 6) {
                this.$auth.bets.shift();
            }
            this.$auth.bets.push(message);
        }
    }
  },
  components: {
    chat,
    navbar
  }
}
</script>

<template>
  <navbar>
    <button @click="toggle = !toggle" class="px-6 border-x text-center border-x-zinc-700">
        <div>chat</div>
        <div class="text-2xl">💬</div>
    </button>
  </navbar>
  <div class="flex mt-14">
    <chat :minimized="toggle"></chat>
    <router-view :class="toggle ? 'w-full' : 'w-full ml-0 lg:ml-80'" />
  </div>
</template>
