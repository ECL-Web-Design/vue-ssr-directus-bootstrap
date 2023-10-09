<template>
    <slot :selectorClass="'image-background-selector'" class="slot"></slot>
</template>

<script lang="ts" setup>

import {computed} from "vue"

const props = defineProps<{
    imgSrc: string
}>()

const srcCSS = computed(() => {
    return `url("${props.imgSrc}")`
})

</script>

<style lang="scss" scoped>

:slotted(.image-background-selector > *) {
    position: relative;
    z-index: 1;
    overflow: hidden;
}

:slotted(.image-background-selector)::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: v-bind(srcCSS);
    z-index: 0;
}

</style>
