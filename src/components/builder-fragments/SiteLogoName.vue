<template>
    <component :is="componentType" class="site-logo-name" href="./">
        <img :src="siteLogoSrc" alt="Site Logo" class="site-logo">
        <span class="site-name">{{ siteName }}</span>
    </component>
</template>

<script lang="ts" setup>

import {computed} from "vue"

const props = defineProps<{
    siteName: string,
    siteLogoSrc: string,
    isHomeLink?: boolean
}>()

const componentType = computed(() => {
    return props.isHomeLink ? 'a' : 'div'
})

</script>

<style lang="scss" scoped>

.site-logo-name {
  display: flex;
  gap: 0.5rem;
}

.site-logo {
  height: 1em;
  width: auto;
}

</style>
