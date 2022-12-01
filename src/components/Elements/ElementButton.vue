<script setup>
defineProps({
    color: String,
    fontColor: String,
    width: {
        type: Number,
        default: 100
    },
    height: {
        type: Number,
        default: 36
    },
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    },
    text: String
});
</script>
<template>
    <v-btn class="element-button" variant="flat" :ripple="false" :color="color" v-bind="$attrs"
        :style="{ width: `${width}px`, height: `${height}px`, top: `${y}px`, left: `${x}px`, color: fontColor }">
        {{ text }}
    </v-btn>
</template>
<style lang="scss">
.element-button {
    // .v-btn__content {
    //     color: #ffffff;
    // }
}
</style>