<script>
import Button from '../components/ui/button.vue'
export default {
  data() {
    return {
      message: '',
      messages: []
    }
  },
  methods: {
    send() {
      this.$socket.send(JSON.stringify({
        message: this.message
      }))
      this.message = '';
    }
  },
  mounted() {
    this.$options.sockets.onmessage = (msg) => {
      const message = JSON.parse(msg.data);
      this.messages.push(message.message);
    }
  },
  components: {
    Button
  }
}
</script>

<template>
  <div class="bg-gray-800 w-screen h-screen">
    <div class="bg-gray-900 rounded-md px-2 py-2 w-fit h-screen grid place-content-end ml-auto">
      <div class="overflow-y-auto">
        <div class="text-gray-100 my-2" v-for="(message, index) in messages" :key="index">
          {{message}}
        </div>
      </div>
      <div class="mt-4">
        <input class="appearance-none rounded-md px-2 py-1 mr-2" v-model="message">
        <Button @click="send" color="emerald">
          send
        </Button>
      </div>
    </div>
  </div>
</template>