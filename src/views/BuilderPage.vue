<template>
    <div class="builder-page">
        <template v-if="pageSections.length > 0">
            <component :is="builderComponentMap[item?.__typename ?? 'notFound']"
                       v-for="({item}, index) in pageSections"
                       :key="index"
                       :builder-data="item"
                       :class="{'page-top-section': index === 0}"
                       :dynamic-guid="dynamicGuid ?? undefined"
                       :guid="pageGuid"
                       class="builder-section">
            </component>
        </template>
        <template v-else>
            <default-builder-section></default-builder-section>
        </template>
    </div>
</template>

<script lang="ts" setup>
import {usePageMeta} from "@/modules/PageMeta"
import type {Component} from "vue"
import {computed} from "vue"
import BuilderFormSection from "@/components/builder-sections/BuilderFormSection.vue"
import BuilderCtaSection from "@/components/builder-sections/BuilderCtaSection.vue"
import {PageSections} from "@/types/DirectusSchema.types"
import {ssrCachedFetchAsync} from "@/modules/ssrCachedFetch"
import fetchPage from "@/modules/directus/DirectusFetchPage"
import DefaultBuilderSection from "@/components/builder-sections/DefaultBuilderSection.vue"
import BuilderGenericContentSection from "@/components/builder-sections/BuilderGenericContentSection.vue"

const props = defineProps<{
    notFound: 'div',
    pageGuid: string,
    dynamicGuid?: string,
}>()

const pageData = await ssrCachedFetchAsync(`page-${props.pageGuid}`, () => fetchPage(props.pageGuid))

const builderComponentMap: { [key: string]: Component } = {
    notFound:                DefaultBuilderSection,
    form_section:            BuilderFormSection,
    builder_cta_section:     BuilderCtaSection,
    generic_content_section: BuilderGenericContentSection
}

const pageSections = computed<PageSections[]>(() => {
    return (pageData?.sections ?? []) as PageSections[]
})

usePageMeta(pageData)

</script>

<style lang="scss" scoped>

.builder-page {
  width: 100%;
  display: grid;
  gap: 8rem;
  box-sizing: border-box;
  max-width: var(--content-max-width);
}

</style>
