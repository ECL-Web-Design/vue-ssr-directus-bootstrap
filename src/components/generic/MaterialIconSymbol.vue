<template :key="parsedIconName">
    <span class="material-icon-symbol">
        <transition-fade-in-out>
            <icon v-if="iconData"
                  :class="[`icon-${parsedIconName}`]"
                  :icon="iconData"
                  inline></icon>
        </transition-fade-in-out>
    </span>
</template>

<script lang="ts" setup>

import {Icon, IconifyIcon} from "@iconify/vue"
import {computed, onMounted, ref, watch} from "vue"
import {ssrCachedFetchAsync} from "@/modules/ssrCachedFetch"
import TransitionFadeInOut from "@/components/generic/TransitionFadeInOut.vue"

const props = defineProps<{
    iconName?: string,
    rounded?: boolean,
    sharp?: boolean,
    filled?: boolean
}>()

const parsedIconName = computed(() => {
    if (!props.iconName) {
        return ''
    }

    const styleAdd = props.rounded ? '-rounded' : props.sharp ? '-sharp' : ''
    const filledAdd = !props.filled ? '-outline' : ''

    return props.iconName.replace(/_/g, '-').toLowerCase() + filledAdd + styleAdd
})

async function fetchIcon(name: string): Promise<null | IconifyIcon> {
    return (await fetch(`https://icons.eclwebdesign.co.uk/material-symbols/${name}`)).json()
}

const iconData = ref<IconifyIcon | null>(null)

onMounted(async () => {
    iconData.value = await ssrCachedFetchAsync(
        parsedIconName.value,
        () => fetchIcon(parsedIconName.value)
    )

    watch(parsedIconName, async () => {
        iconData.value = await ssrCachedFetchAsync(
            parsedIconName.value,
            () => fetchIcon(parsedIconName.value)
        )
    })
})

</script>

<style lang="scss" scoped>

.material-icon-symbol {
    display: flex;
    justify-content: center;
    align-items: center;
}

.icon {
    width: 1em;
    height: 1em;
}

</style>
