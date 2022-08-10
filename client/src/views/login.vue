<template>
  <div class="antialiased bg-zinc-900 min-h-screen-nav w-full text-center max-w-none px-4">
    <div class="max-w-xl lg:max-w-2xl mx-auto py-24">
      <h1 class="text-zinc-200 py-2 px-6 mb-6">Log in</h1>
        <div class="w-full max-w-xs mt-12 mx-auto">
          <form @submit.prevent="submit" class="border border-zinc-700 rounded-lg px-8 pt-6 pb-8 mb-4">
            <div class="mb-4">
              <p class="block font-bold mb-2" for="username">
                Username
              </p>
              <input v-model="username" class="appearance-none border border-zinc-700 rounded w-full py-2 px-3 bg-zinc-800 text-zinc-200" id="username" type="text" placeholder="Username">
            </div>
            <div class="mb-6">
              <p class="block font-bold mb-2" for="username">
                Password
              </p>
              <input v-model="password" class="appearance-none border border-zinc-700 rounded w-full py-2 px-3 bg-zinc-800 text-zinc-200" id="password" type="password" placeholder="******************">
              <p v-if="error" class="text-red-500 text-xs mt-6 italic">{{error}}</p>
            </div>
            <div class="flex items-center justify-between">
              <Button color="emerald">
                Sign In
              </Button>
              <p>Forgot Password?</p>
            </div>
          </form>
          <p class="text-center text-gray-500 text-xs">
            &copy;2022 RuneCity. All rights reserved.
          </p>
        </div>
      </div>
  </div>
</template>

<script>
import Button from '../components/ui/button.vue'

export default {
  data() {
    return {
      username: '',
      password: '',
      error: ''
    }
  },
  methods: {
    submit() {
      if(this.username == '' || this.password == '') {
        this.error = 'Please fill in all fields';
        return
      }
      this.$socket.sendObj({
          type: 'auth',
          action: 'login',
          username: this.username,
          password: this.password
      });
    }
  },
  mounted() {
    if(this.$auth.isLoggedIn) {
      return this.$router.push('/dashboard');
    }
    this.$options.sockets.onmessage = (msg) => {
      const message = JSON.parse(msg.data);
      if(message.type == 'auth') {
          this.$auth.login(message.user, message.token);
          this.$router.push('/dashboard');
      } else if(message.type == 'error') {
          this.error = message.message;
      } 
    }
  },
  components: {
    Button
  }
}
</script>
