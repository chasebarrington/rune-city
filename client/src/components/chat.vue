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
            message: this.message,
            opacity: 100
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
  <div class="bg-zinc-900 max-w-[20rem] px-2 py-2 md:w-fit h-screen grid place-content-end absolute -left-80 lg:left-0 lg:relative transition-all">
    <div id="chatbox" class="no-scrollbar overflow-y-auto flex flex-col">
      <p class="text-zinc-100 max-w-xl break-words px-2 py-1 my-1 whitespace-pre-line transition-opacity delay-100 bg-zinc-800 rounded-md" v-for="(message, index) in messages" :class="'opacity-' + message.opacity" :key="index">
        {{message.message}}
      </p>
    </div>
    <div class="text-rose-500 py-2" v-if="footerText">{{footerText}}</div>
    <div class="mt-1 grid grid-cols-3">
      <textarea @keydown.enter.exact.prevent="send" @keydown.enter.shift.exact.prevent="message += '\r\n'" class="appearance-none rounded-md px-2 py-1 outline-none resize-none overflow-y-hidden mr-2 h-9 col-span-2" v-model="message" />
      <Button @click="send" color="emerald">
        send
      </Button>
    </div>
  </div>
</template>

<style>
.no-scrollbar::-webkit-scrollbar {
    display: none;
}

.no-scrollbar {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>