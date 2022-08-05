<script>
import chat from './components/chat.vue'
export default {
  components: {
    chat
  }
}
</script>


<template>
  <div class="flex">
    <chat></chat>
    <router-view/>
  </div>
</template>
