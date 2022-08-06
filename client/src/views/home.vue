<script>
import Button from '../components/ui/button.vue'
export default {
  components: {
    Button
  }
}
</script>

<template>
  <div class="antialiased bg-zinc-900 w-screen min-h-screen-nav text-center max-w-none px-4">
    <NavBar/>
    <div class="max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto py-24">
      <h1 class="text-transparent bg-clip-text bg-gradient-to-br from-green-400 via-teal-400 to-indigo-400 py-2 px-6 mb-6">The quick and easy way to rune riches</h1>
      <h2 class="text-center text-zinc-400">An online community for exchanging virtual goods.</h2>
      <div class="flex flex-wrap gap-5 px-5 mt-10 justify-center">
          <Button to="/register" color="emerald">Register</Button>
          <Button to="/login" color="slate" _class="group">
            Log in
            <svg class="inline mb-1 fill-blue-300 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
              <path d="M13.025 1l-2.847 2.828 6.176 6.176h-16.354v3.992h16.354l-6.176 6.176 2.847 2.828 10.975-11z"></path>
            </svg>
          </Button>
      </div>
    </div>
    <div class="border-y border-y-zinc-700 py-4 grid sm:flex gap-4 place-content-center">
      <p>Blackjack</p>
      <p>Roulette</p>
      <p>Loot Boxes</p>
    </div>
    <div class="max-w-5xl gap-x-32 gap-y-16 grid md:grid-cols-3 py-20 text-left mx-auto px-12 place-items-center">
      <div>
        <h2>Provably fair</h2>
        <p class="pt-4">Our odds of any particular outcome are random, and can be verified through mathematical algorithms.</p>
      </div>
      <div>
        <h2>Automated</h2>
        <p class="pt-4">Every portion of Rune City is automated, including cashing in and cashing out. You won't be waiting on humans.</p>
      </div>
      <div>
        <h2>Risk free</h2>
        <p class="pt-4">None of your information other than your username is stored, and we never share any info to any third parties.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
h1 {
    @apply text-4xl;
    @apply font-extrabold;
    @apply font-sans;
}
h2 {
    @apply text-zinc-200;
    @apply text-lg;
    @apply font-medium;
    @apply font-sans;
}
p {
    @apply text-zinc-400;
    @apply font-sans;
    @apply font-medium;
    @apply text-sm;
}
@media (min-width: 340px) {
    h1 {
        @apply text-5xl;
    }
}
@media (min-width: 768px) {
    h1 {
        @apply text-6xl;
    }
    h2 {
        @apply text-xl
    }
}
@media (min-width: 1024px) {
    h1 {
        font-size: 76px;
    }
    h2 {
        @apply text-2xl
    }
}

</style>