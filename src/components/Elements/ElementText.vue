<script setup>
const props = defineProps({
    fontColor: String,
    text: String,
    fontSize: {
        type: [Number, String],
        default: 16
    },
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
    <div class="element-text" data-type="text" :style="{ fontSize: `${fontSize}px`, color: fontColor, top: `${y}px`, left: `${x}px` }">
        {{ text }}
    </div>
</template>
<style lang="scss" scoped>
.element-text {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    min-height: 40px;
    overflow: hidden;
}
</style>