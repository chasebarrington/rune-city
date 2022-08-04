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
  <div v-for="(message, index) in messages" :key="index">
    {{message}}
  </div>
  <div>
    <input v-model="message">
    <Button @click="send" color="emerald">
      send
    </Button>
  </div>
</template>