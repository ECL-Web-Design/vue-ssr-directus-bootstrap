<template>
    <div class="tiled-images">
        <popin-image v-for="index in gridTotal"
                     :class="[`preview-small-${index + 1}`, {'alternate-row' : (Math.ceil((index) / gridX)) % 2 !== 0}]"
                     :src="imgSrc"
                     alt="tiled image"
                     aria-hidden="true"
                     class="image-tile"></popin-image>
    </div>
</template>

<script lang="ts" setup>

import PopinImage from "@/components/generic/PopinImage.vue"
import {computed} from "vue"

const props = defineProps<{
    imgSrc: string,
    gridX: number,
    gridY: number,
    rowHeight?: string,
    columnWidth?: string,
    disableAlternateOffset?: boolean
}>()

const gridTotal = computed(() => {
    return props.gridX * props.gridY
})

const gridColumnCSS = computed(() => {
    return `repeat(${props.gridX}, ${props.columnWidth ?? '1fr'})`
})

const gridRowCSS = computed(() => {
    return `repeat(${props.gridY}, ${props.rowHeight ?? 'auto'})`
})

</script>

<style lang="scss" scoped>

.tiled-images {
    display: grid;
    grid-template-columns: v-bind(gridColumnCSS);
    grid-template-rows: v-bind(gridRowCSS);
    padding: 1rem;
    box-sizing: border-box;

    column-gap: 4%;
    row-gap: 5%;

    transform: skew(60deg, -30deg);
    z-index: 0;
}

.image-tile {
    position: relative;
    object-fit: cover;
    object-position: 50% 0;
    width: 100%;
    min-width: 0;
    border-radius: 1px;
    box-shadow: -20px 6px 10px 3px rgba(0, 0, 0, 0.5);
}

.alternate-row {
    translate: -30% 0;
}

</style>
