<script>
import Button from './ui/button.vue'
export default {
  props: {
    minimized: {
      required: true,
      default: false
    }
  },
  data() {
    return {
      message: '',
      footerText: '',
      messages: [],
    }
  },
  computed: {
    user() {
        return this.$auth.user || { user: { user: '' } };
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

        // check if user is logged in and user is valid
        if (!this.$auth.isLoggedIn) {
            return this.notify('not logged in')
        }

        // if message has more than one newline in a row, replace it with just one
        this.message = this.message.replace(/\n{2,}/g, '\n');

        this.$socket.sendObj({
            type: 'message',
            token: this.$auth.token,
            msg: this.message
        });
        this.message = '';
    },
    toggle() {
      this.minimized = !this.minimized;
    },
    resizeWindow() {
      var chat = document.getElementById("chat");
      chat.style.height = window.innerHeight - 56 + 'px';
    }
  },
  mounted() {

    this.resizeWindow();
    window.addEventListener("resize", this.resizeWindow);

    this.$options.sockets.onmessage = (msg) => {

      const message = JSON.parse(msg.data);
      const arr = Array.isArray(message);

      if (message.type != 'message' && !arr) {
        return;
      }

      if(arr && message.length > 0 && message[0].type != 'message') {
        return;
      }

      // if the message is an array, it's a batch of messages
      if (arr) {
        this.messages = message;
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
  destroyed() {
    window.removeEventListener("resize", this.resizeWindow);
  },
  components: {
    Button
  }
}

</script>

<template>
  <div id="chat" class="bg-zinc-800 border-r border-r-zinc-700 w-screen lg:w-80 fixed z-20" :class="minimized ? '-left-[100vw]' : 'left-0'">
    <div class="inputbox bg-zinc-900">
      <label for="chatinput" class="absolute"></label>
      <textarea placeholder="enter your message here :)" id="chatinput" name="chatinput" class="resize-none px-2 py-2" v-model="message" @keydown.enter.exact.prevent="send" @keydown.enter.shift.exact.prevent="message += '\r\n'" />
      <Button @click="send" color="emerald">send</Button>
    </div>
    <div class="messagebox">
      <div id="chatbox" class="messages">
        <div v-for="(message, index) in messages" :key="index">
          <div class="flex w-fit" :class="message.user == this.user.user ? 'ml-auto' : ''" v-if="messages[index - 1] == null || (messages[index - 1] != null && messages[index - 1].user != messages[index].user)">
            <div class="text-lg text-zinc-100">{{message.user}}</div>
            <div class="text-sm text-zinc-400 pl-2 pt-2">{{message.date}}</div>
          </div>
          <div class="message break-words whitespace-pre-line" :class="message.user == this.user.user ? 'ml-auto' : ''" >{{message.msg}}</div>
        </div>
      </div>
      <div v-if="footerText" class="text-rose-500 text-center mt-2">{{footerText}}</div>
    </div>
  </div>
</template>

<style>

.inputbox {
  width:100%;
  height:3.5rem;
  padding:8px;
  display:flex;
  column-gap:8px;
  position:absolute;
  bottom:0px;
}

textarea {
  width:100%;
  border-radius:6px;
  overflow-y: hidden;
  outline:none;
}

.message {
  color: rgb(147 197 253);
  background-color: rgb(51 65 85);
  width: fit-content;
  padding: 6px 10px 6px 10px;
  margin-top: 4px;
  border-radius: 0.7rem;
}

.messages {
  overflow-y: auto;
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.messages::-webkit-scrollbar {
    display: none;
}

.messagebox {
    width: 100%;
    height: calc(100% - 3.5rem);
    padding: 8px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
}

</style>