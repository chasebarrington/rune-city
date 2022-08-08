<script>
import chat from './components/chat.vue'
import navbar from './components/navbar.vue'
export default {
  data() {
    return {
      toggle: true
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
    <router-view :class="toggle ? '' : 'ml-0 lg:ml-80'" />
  </div>
</template>
