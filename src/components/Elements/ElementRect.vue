<script setup>
const props = defineProps({
    color: String,
    width: {
        type: Number,
        default: 30
    },
    height: {
        type: Number,
        default: 30
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
    <div class="element-rect" data-type="rect"
        :style="{ backgroundColor: color, width: `${width}px`, height: `${height}px`, top: `${y}px`, left: `${x}px` }">
    </div>
</template>
<style lang="scss" scoped>
.element-rect {
    min-width: 40px;
    min-height: 40px;
}
</style>