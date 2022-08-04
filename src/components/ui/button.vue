<template>
    <button :class="button_data[color] + ' ' + _class">
        <router-link v-if="a != null" :to="a">
            <slot />
        </router-link>
        <slot v-else />
    </button>
</template>

<script>

const button_data = {
  emerald: 'bg-emerald-400 hover:bg-emerald-300',
  sky: 'bg-sky-400 hover:bg-sky-300'
};

export default {
    props: {
        color: {
            required: true
        },
        _class: {
            required: false
        },
        intensity: {
            required: false,
            type: Number,
            default: 400
        },
        a: {
            required: false,
            type: String,
        }
    },
    data() {
        return {
            button_data: button_data
        }
    }
}
</script>

<style scoped>
button {
    @apply rounded-lg;
    @apply px-4;
    @apply py-1;
    @apply text-lg;
    @apply font-sans;
    @apply font-medium;
    @apply transition-all;
    @apply duration-300;
}
</style>