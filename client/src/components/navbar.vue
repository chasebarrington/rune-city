<template>
    <div class="relative overflow-y-hidden">
        <div class="bg-zinc-900 w-screen border-b border-b-zinc-700 flex gap-x-4 fixed top-0 z-50">
            <div class="text-white">
                <slot></slot>
            </div>
            <router-link class="py-4 flex gap-2" to="/">
                <img alt="coins" class="w-4 h-4 self-center" width="16" height="16" src="https://osgamble.mo.cloudinary.net/OeHv8Z4.png">
                <p class="text-zinc-200">Rune City</p>
            </router-link>
            <router-link class="px-2 py-1 text-blue-300 rounded-lg absolute right-2 top-3 bg-slate-700" to="/inventory" v-if="this.$auth.isLoggedIn">
                Inventory
            </router-link>
        </div>
    </div>
</template>