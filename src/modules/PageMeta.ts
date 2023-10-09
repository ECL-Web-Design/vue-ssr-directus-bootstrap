import siteSettingsStore from "@/stores/SiteSettingsStore"
import srcConstruct from "@/modules/directus/DirectusSrcConstruct"
import {useHead} from "@vueuse/head"
import {Page} from "@/types/DirectusSchema.types"

export function usePageMeta(pageData: Partial<Page>) {

    if (pageData) {
        let constructedTitle = siteSettingsStore.settings?.global_meta_title ?? ''

        if (pageData.meta_title) {
            constructedTitle += ` | ${pageData.meta_title}`
        }

        const tags: { name: string, property: string, content: string }[] = []

        for (const tag of pageData.meta_tags ?? []) {
            tags.push({
                          name:     tag?.meta_name ?? '',
                          property: tag?.meta_name ?? '',
                          content:  tag?.meta_content ?? ''
                      })
        }

        tags.push({
                      name:     "og:title",
                      property: "og:title",
                      content:  pageData?.og_title ?? ''
                  })

        tags.push({
                      name:     "og:description",
                      property: "og:description",
                      content:  pageData?.og_description ?? ''
                  })

        tags.push({
                      name:     "og:image",
                      property: "og:image",
                      content:  srcConstruct(pageData.og_image)?.src
                  })

        useHead({
                    title: constructedTitle,
                    meta:  tags,
                })
    }
}
