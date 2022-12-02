<script setup>
import { ref, watch } from "vue";
const props = defineProps({
    color: {
        type: String,
        default: '#000000'
    }
})
const mode = ref('hsla')
const value = ref(props.color)

watch(props, () => {
    value.value = props.color
})
</script>
<template>
    <v-menu :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ props }">
            <v-btn v-bind="props" :style="{ backgroundColor: value }" class="color-block" icon :ripple="false"></v-btn>
        </template>
        <v-color-picker v-model="value" :mode="mode" @update:modelValue="$emit('change', value)"></v-color-picker>
    </v-menu>
</template>
<style lang="scss">
.color-block {
    width: 36px !important;
    height: 36px !important;
    min-width: initial !important;
    .v-btn__overlay, .v-btn__underlay {
        display: none;
    }
}

.v-color-picker {
    overflow-x: hidden !important;
}
</style>