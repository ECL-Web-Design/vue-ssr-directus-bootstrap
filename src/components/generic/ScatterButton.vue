<template>
    <component :is="componentType" class="scatter-button" @mouseleave="updateTransforms">
        <div class="hover-animation-container">
            <div v-for="i in cellCount" :key="i"
                 :style="{transform: transformMap[i - 1]}"
                 class="hover-animation-item"></div>
        </div>
        <slot>Button</slot>
    </component>
</template>

<script lang="ts" setup>

import {computed, ref, useAttrs, watchEffect} from "vue"
import {randomInt, randomRange} from "@/helpers/helpers"

const attrs = useAttrs()

const props = withDefaults(defineProps<{
    columns?: number,
    rows?: number,
    distanceRange?: number,
    scaleMin?: number,
    scaleMax?: number
}>(), {
                               columns: 16,
                               rows: 4,
                               distanceRange: 150,
                               scaleMin: 0.1,
                               scaleMax: 0.5
                           })

const cellCount = computed(() => props.columns * props.rows)

const transformMap = ref<string[]>([])

function updateTransforms() {

    transformMap.value = []

    for (let i = 0; i < cellCount.value; i++) {
        transformMap.value.push(`translate(${randomInt(-props.distanceRange, props.distanceRange)}px, ${randomInt(
            -props.distanceRange,
            props.distanceRange
        )}px)
        scale(${randomRange(props.scaleMin, props.scaleMax)})`)
    }
}

watchEffect(updateTransforms)

const componentType = computed(() => {
    if (attrs['to']) {
        return 'router-link'
    }

    if (attrs['href']) {
        return 'a'
    }

    return 'button'
})

const columnsCSS = computed(() => props.columns)
const rowsCSS = computed(() => props.rows)

</script>

<style lang="scss" scoped>

.scatter-button {
    box-shadow: var(--soft-shadow);
    background-color: var(--strong-bg);
    color: var(--strong-fg);
    font-size: var(--font-medium);
    padding: 0.3rem 1rem;
    position: relative;
}

.hover-animation-container {
    display: grid;
    position: absolute;
    inset: 0;
    grid-template-columns: repeat(v-bind(columnsCSS), 1fr);
    grid-template-rows: repeat(v-bind(rowsCSS), 1fr);
    z-index: -1;
}

.hover-animation-item {
    background-color: var(--strong-bg);
    box-shadow: var(--soft-shadow);
    transition: transform 0.4s, border-radius 0.3s, opacity 0.3s;
    pointer-events: none;
    opacity: 0.5;
    border-radius: 50%;
}

.scatter-button {
    background-color: transparent;
    transform: translate(0, 0);

    &:hover {
        .hover-animation-item {
            transform: translate(0, 0) scale(1) !important;
            border-radius: 0px;
            opacity: 1;
        }
    }
}

</style>
