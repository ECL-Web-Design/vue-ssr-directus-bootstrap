<template>
    <div class="click-gallery">
        <button class="move-left" @click="moveOne('left')">
            <material-icon-symbol icon-name="keyboard_arrow_left"></material-icon-symbol>
        </button>
        <div ref="containerRef" class="panels-outer">
            <div class="panels-container">
                <div v-for="(item, index) in items"
                     ref="galleryItemRefs"
                     :class="{'item-remove' : perItem[index].remove, 'item-hide': perItem[index].hide, 'left-side' : perItem[index].distance < 0, 'right-side': perItem[index].distance > 0}"
                     :style="[perItem[index].style]"
                     class="gallery-item"
                     @click="moveToIndex(index, perItem[index].whichSide)">
                    <slot v-if="!perItem[index].remove"
                          name="item"
                          v-bind="{item: item, itemIndex: index, itemActive: index === activeIndex}"></slot>
                </div>
                <div v-if="enableIndicators" class="indicators">
                    <button v-for="(item, index) in items" :key="index"
                            :class="{'active' : index === activeIndex}"
                            class="indicator"
                            @click="moveToIndex(index, index < activeIndex ? 'left' : 'right')"></button>
                </div>
            </div>
        </div>
        <button class="move-right" @click="moveOne('right')">
            <material-icon-symbol icon-name="keyboard_arrow_right"></material-icon-symbol>
        </button>
    </div>
</template>

<script generic="ItemType" lang="ts" setup>

import {computed, ref, StyleValue} from "vue"
import {loop, sleep} from "@/helpers/helpers"
import MaterialIconSymbol from "@/components/generic/MaterialIconSymbol.vue"
import {useElementBounding} from "@vueuse/core"

const props = defineProps<{
    items: ItemType[],
    //amount items are spaced out in percent
    spacing?: number,
    //leave undefined to disable autoplay
    autoplayDelay?: number,
    autoplayDirection?: 'left' | 'right'
    taperSpacing?: boolean,
    displayEachSide: number,
    disableScaling?: boolean,
    enableIndicators?: boolean,
    disableInteraction?: boolean,
    displayNavigation?: boolean,
    //in seconds
    baseTransitionTime?: number
}>()

const activeIndex = ref(0)

const containerRef = ref<HTMLElement | null>(null)
const galleryItemRefs = ref<(HTMLElement | null)[]>([])
const {width: containerWidth} = useElementBounding(containerRef)

function generateItemStyle(centerDistance: number, maxDistance: number, itemRef: HTMLElement | null): StyleValue {

    const itemWidth = itemRef?.clientWidth ?? 0

    const maxX = ((containerWidth.value ?? 2) / 2) - (itemWidth / 2)
    const step = maxX / props.displayEachSide
    const origin = centerDistance > 0 ? '100% 50%' : '0% 50%'

    const scaleMagnitude = props.disableScaling ? 1 : 1 - (Math.abs(centerDistance) * 0.16)
    return {
        transform:       `translateX(${(step) * centerDistance}px) translateX(${0.2 *
                                                                                centerDistance}rem) scale(${scaleMagnitude})`,
        transformOrigin: origin,
        filter:          `brightness(${scaleMagnitude}) grayscale(${1 - scaleMagnitude})`,
        zIndex:          (maxDistance - Math.abs(centerDistance)) + 1
    }
}

const perItem = computed(() => {
    const {items: itemsOrig, displayEachSide} = props
    const halfLength = Math.floor(itemsOrig.length / 2)
    const perItemArr: {
        style: StyleValue,
        remove: boolean,
        distance: number,
        hide: boolean,
        whichSide: 'left' | 'right' | 'center'
    }[] = new Array(
        itemsOrig.length)

    let centerDistance = -halfLength
    for (let i = activeIndex.value - halfLength; i <= activeIndex.value + halfLength; i++) {
        let realIndex = i

        if (realIndex >= itemsOrig.length) {
            realIndex = (realIndex - itemsOrig.length)
        } else if (realIndex < 0) {
            realIndex = itemsOrig.length + realIndex
        }

        const hidePanel = Math.abs(centerDistance) > displayEachSide
        const removePanel = Math.abs(centerDistance) - displayEachSide > 1

        perItemArr[realIndex] = {
            style:     (generateItemStyle(centerDistance, halfLength, galleryItemRefs.value?.[realIndex] ?? null)),
            hide:      hidePanel,
            distance:  centerDistance,
            whichSide: centerDistance < 0 ? 'left' : centerDistance > 0 ? 'right' : 'center',
            remove:    removePanel
        }

        centerDistance++
    }

    return perItemArr
})

const disableClick = ref(false)

function findDiff(newIndex: number, direction: number) {
    let activeCopy = activeIndex.value
    let count = 0

    while (activeCopy !== newIndex) {
        activeCopy = loop(activeCopy + direction, 0, props.items.length - 1)
        count++
    }

    return count
}

async function moveToIndex(index: number, side: 'left' | 'right' | 'center') {
    if (!props.disableInteraction && !disableClick.value && index !== activeIndex.value) {
        disableClick.value = true

        const direction = side === 'left' ? -1 : 1
        let diff = findDiff(index, direction)

        transitionTime.value = Math.max((props.baseTransitionTime ?? 0.5) / diff, 0.2)
        transitionTimingFunction.value = 'ease-in-out'

        if (diff > 1) {
            transitionTimingFunction.value = 'ease-out'
        }

        while (activeIndex.value !== index) {
            activeIndex.value = loop(activeIndex.value + direction, 0, props.items.length - 1)
            await sleep(transitionTime.value * 800)
        }

        disableClick.value = false
    }
}

const transitionTime = ref(0.5)
const transitionTimeCSS = computed(() => {
    return transitionTime.value + 's'
})

const transitionTimingFunction = ref('ease-in-out')

function moveOne(direction: 'left' | 'right' = 'right') {
    moveToIndex(loop(activeIndex.value + (direction === 'left' ? -1 : 1), 0, props.items.length - 1), direction)
}

</script>

<style scoped>

.click-gallery {
    position: relative;
    display: grid;
    grid-template-columns: min-content 1fr min-content;
}

.panels-outer {
    padding: 0 1.5rem;
    margin: 0 1.5rem;

    @media screen and (max-width: 500px) {
        padding: 0 0.5rem;
        margin: 0 0.5rem;
    }
}

.panels-container {
    display: grid;
    position: relative;
    grid-template-columns: auto;
    justify-content: center;
    align-items: center;
}

.gallery-item {
    cursor: pointer;
    position: relative;
    grid-area: 1/1/2/2;
    transition-timing-function: v-bind(transitionTimingFunction);
    transition: all v-bind(transitionTimeCSS);
    font-size: 4rem;
    font-weight: 700;
    color: white;
    height: 100%;
    display: flex;
    justify-content: center;
    align-self: center;
    box-shadow: 0 0 6px 2px rgba(0, 0, 0, 0.5);
}

.item-remove {
    display: none;
}

.item-hide {
    opacity: 0;
    pointer-events: none;
}

.indicators {
    position: absolute;
    bottom: -1.8rem;
    display: flex;
    gap: 0.5rem;
    padding: 0 1rem;
    width: 100%;
    margin-top: 1rem;
    justify-content: center;
}

.indicator {
    height: 0.5rem;
    opacity: 0.5;
    min-width: 1rem;
    transition: opacity 0.4s, background-color 0.3s;
    background-color: var(--text-less-subtle);

    &:hover {
        opacity: 0.8;
    }
}

.indicator.active {
    background-color: var(--strong-bg);
    pointer-events: none;
    opacity: 1;
}

.move-right, .move-left {
    background-color: transparent;
    font-size: var(--font-large);
}

.move-right {

}

.move-left {

}

</style>
