<template>
    <div ref="parentRef"
         :class="{'fade-edges' : fadeEdges, 'animation-reverse' : reverse, 'pause-on-hover' : pauseOnHover, 'animation-pause' : pauseAnimation, 'reel-animate' : !removeAnimation}"
         class="infinite-reel">
        <div ref="reelRef" class="reel reel-1">
            <slot v-for="(item, index) in displayItems"
                  name="item"
                  v-bind="{itemStyle: perItem[index].style, itemClass: perItem[index].class, item: item, itemIndex: index}"></slot>
        </div>
        <div aria-hidden="true" class="reel reel-2">
            <slot v-for="(item, index) in displayItems"
                  name="item"
                  v-bind="{itemStyle: perItem[index].style, itemClass: perItem[index].class, item: item, itemIndex: index}"></slot>
        </div>
    </div>
</template>

<script generic="ItemType extends any" lang="ts" setup>

import type {StyleValue} from "vue"
import {computed, ref, watch} from "vue"
import {useElementBounding} from "@vueuse/core"
import {Tween} from "@tweenjs/tween.js"

const props = defineProps<{
    //scroll speed scale factor, base speed is constant regardless of number of elements
    scrollSpeed?: number,
    pause?: boolean,
    reverse?: boolean,
    pauseOnHover?: boolean,
    pauseOnActive?: boolean,
    fadeEdges?: boolean,
    items: ItemType[]
    itemWidth: number,
    activeIndex?: number,
    jumpToIndex?: number,
    //auto fills container if children do not stretch the full width
    enableOverfill?: boolean,
}>()

const reelRef = ref<HTMLElement | null>(null)
const parentRef = ref<HTMLElement | null>(null)
const removeAnimation = ref(false)

const {width: reelWidth} = useElementBounding(reelRef)
const {width: parentWidth} = useElementBounding(parentRef)

function isValidIndex(index: number | undefined | null) {
    return index !== undefined && index !== null && index > -1 && index < displayItems.value.length
}

const overfillCount = computed(() => {
    if (props.enableOverfill &&
        props.items.length * props.itemWidth < parentWidth.value &&
        !import.meta.env.SSR) {
        let cappedWidth = parentWidth.value

        //failsafe to prevent runaway width growth if no css max width is set or available
        if (window.innerWidth * 1.5 < parentWidth.value) {
            console.warn('Infinite Reel component should have a max width set, or enableOverfill disabled if not')
            cappedWidth = window.innerWidth * 2
        }
        return Math.ceil((cappedWidth / props.itemWidth) / props.items.length)
    }

    return 1
})

const displayItems = computed(() => {
    if (overfillCount.value === 1) {
        return props.items
    }

    let itemsReturn = ([] as T[])

    for (let i = 0; i < overfillCount.value; i++) {
        itemsReturn = itemsReturn.concat(props.items)
    }

    return itemsReturn
})

const scrollSpeed = computed(() => {
    return (reelWidth.value * 15) / (props.scrollSpeed ?? 1)
})

const pauseAnimation = computed(() => {
    return props.pause ||
           isValidIndex(props.jumpToIndex) ||
           isValidIndex(props.activeIndex)
})

const scrollDelay = ref(0)

watch(() => props.jumpToIndex, (newIndex) => {
    resetAnimation()

    if (newIndex !== undefined && newIndex > -1 && newIndex < displayItems.value.length) {
        const tweenValue = (-scrollSpeed.value / displayItems.value.length) *
                           ((props.reverse ? (displayItems.value.length - newIndex) : newIndex) + 1.5)

        new Tween(scrollDelay)
            .to({
                    value: tweenValue
                }, 800)
            .start()
    }
})

const scrollSpeedCSS = computed(() => {
    return `${scrollSpeed.value}ms`
})

const scrollDelayCSS = computed(() => {
    return `${scrollDelay.value}ms`
})

const perItem = computed(() => {
    const itemData: { style: StyleValue, class: string }[] = []

    displayItems.value.forEach((val, index) => {
        let itemClass = ''

        if (isValidIndex(props.activeIndex)) {
            itemClass = index === props.activeIndex ? 'carousel-item-active' : 'carousel-item-inactive'
        }

        itemData.push(
            {
                style: {width: `${props.itemWidth}px`},
                class: itemClass
            }
        )
    })

    return itemData
})

//slightly hacky but only way I've found
function resetAnimation() {
    parentRef.value?.classList.remove('reel-animate')

    void parentRef.value?.offsetWidth

    parentRef.value?.classList.add('reel-animate')
}

//example of how to smoothly spin the reel
// onMounted(() => {
//     setTimeout(() => {
//         scrollDelay.value = 0
//
//         console.log('hello')
//         new Tween(scrollDelay)
//             .to({value: -scrollSpeed.value * 5}, 5000)
//             .easing(Easing.Sinusoidal.Out)
//             .start()
//     }, 3000)
// })

</script>

<style lang="scss" scoped>

.infinite-reel {
  --gap: 1rem;
  display: flex;
  gap: var(--gap);
  max-width: 100vw;
  overflow: hidden;
  //extracted into variable because of webstorm mismatched calc issue
  --translate-to: calc(-100% - (var(--gap)))
}

.reel-animate .reel {
  animation: scroll v-bind(scrollSpeedCSS) linear infinite;
}

.reel {
  display: flex;
  gap: var(--gap, 1rem);
  width: min-content;
  animation-delay: v-bind(scrollDelayCSS) !important;
}

.animation-pause, .pause-on-hover:hover {
  .reel {
    animation-play-state: paused;
  }
}

.animation-reverse {
  .reel {
    animation-direction: reverse;
  }
}

.fade-edges {
  --mask-1: linear-gradient(90deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 1) 14%) 0 50% / 51% no-repeat;
  --mask-2: linear-gradient(90deg, rgba(0, 0, 0, 1) 86%, rgba(0, 0, 0, 0) 100%) 100% 50% / 51% no-repeat;
  -webkit-mask: var(--mask-1), var(--mask-2);
  mask: var(--mask-1), var(--mask-2);
}

@keyframes scroll {
  100% {
    transform: translateX(var(--translate-to));
  }
}

</style>
