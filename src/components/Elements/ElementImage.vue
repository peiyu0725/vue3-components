<script setup>
defineProps({
    src: String,
    width: [String, Number],
    height: [String, Number],
    x: {
        type: Number,
        default: 0
    },
    y: {
        type: Number,
        default: 0
    }
});
</script>
<template>
    <img data-type="image" :src="src" :width="width" :height="height" :style="{ top: `${y}px`, left: `${x}px` }" />
</template>
<style lang="scss" scoped>
img {
    min-width: 40px;
}
</style>