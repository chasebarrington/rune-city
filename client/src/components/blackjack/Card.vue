<template>
    <div class="w-14 h-20 border-2 border-black bg-gray-200 rounded relative text-3xl drop-shadow-md hover:z-10 hover:scale-125">
        <div class="w-full h-full shadow-xl" :class="glowClass" >
            <div v-if="color == 'red'" class="text-red-600 w-full h-full flex">
                <div class="self-center w-full">{{suit}}</div>
                <div class="absolute -top-1 left-0.5 h-fit text-2xl font-bold">{{face}}</div>
            </div>
            <div v-else class="w-full h-full flex">
                <div class="self-center w-full">{{suit}}</div>
                <div class="absolute -top-1 px-1 h-fit text-2xl font-bold">{{face}}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        suit: {
            required: true
        },
        face: {
            required: true
        },
        color: {
            required: true
        },
        glowClass: {
            required: true
        }
    }
}
</script>
