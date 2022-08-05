<script>
import Button from './ui/button.vue'
export default {
  data() {
    return {
      message: '',
      footerText: '',
      messages: []
    }
  },
  methods: {
    notify(msg) {
        this.footerText=msg;
        setTimeout(() => {
            this.footerText=''
        }, 1000)
    },
    send() {

        // if message is just whitespace return
        if (!this.message || this.message.trim() === '') { 
            return this.notify('invalid message')
        };
        
        // if message has more than one newline in a row, replace it with just one
        this.message = this.message.replace(/\n{2,}/g, '\n');

        this.$socket.send(JSON.stringify({
            message: this.message
        }))
        this.message = '';
    }
  },
  mounted() {
    this.$options.sockets.onmessage = (msg) => {

      const message = JSON.parse(msg.data);
      
      // if the message is an array, it's a batch of messages
      if (Array.isArray(message)) {
        this.messages = this.messages.concat(message);
      } else {
        this.messages.push(message);
      }

      // check if we were already scrolled to the bottom
      var objDiv = document.getElementById("chatbox");
      let should_scroll = objDiv.scrollTop + objDiv.offsetHeight === objDiv.scrollHeight;

      // wait 50ms and scroll to bottom of chatbox
      setTimeout(() => {
          if(should_scroll)
            objDiv.scrollTop = objDiv.scrollHeight;
      }, 50);

    }
  },
  components: {
    Button
  }
}
</script>

<template>
  <div class="container w-72">
    <div id="chatbox" class="no-scrollbar overflow-y-auto flex flex-col gap-y-2">
      <p v-for="(message, index) in messages" :key="index">
        {{message.message}}
      </p>
    </div>
    <div class="text-rose-500 pt-2 text-center" v-if="footerText">{{footerText}}</div>
    <div class="mt-2 grid grid-cols-3">
      <textarea @keydown.enter.exact.prevent="send" @keydown.enter.shift.exact.prevent="message += '\r\n'" class="appearance-none rounded-md px-2 py-1 outline-none resize-none overflow-y-hidden mr-2 h-9 col-span-2" v-model="message" />
      <Button @click="send" color="emerald">
        send
      </Button>
    </div>
  </div>
</template>

<style>
p {
    @apply text-zinc-100;
    @apply max-w-xl;
    @apply break-words;
    @apply px-2;
    @apply py-1;
    @apply whitespace-pre-line;
    @apply bg-zinc-800;
    @apply rounded-md;
}

.container {
    background-color: rgb(24 24 27);
    padding: 8px;
    height: 100vh;
    display: grid;
    place-content: end;
    position: absolute;
    left: -18rem;
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 150ms;
    @apply lg:left-0;
    @apply lg:relative;
}

.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}

</style>