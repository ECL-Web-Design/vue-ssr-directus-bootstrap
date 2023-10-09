import {computed, ComputedRef, reactive, UnwrapNestedRefs} from "vue"
import srcConstruct from "@/modules/directus/DirectusSrcConstruct"
import {Contact, HomePage, Routes, SiteSettings} from "@/types/DirectusSchema.types"

const constructedLogo = computed(() => {
    if (!siteSettingsStore.settings?.logo) {
        return {src: '', alt: ''}
    }
    return srcConstruct(siteSettingsStore.settings?.logo)
})

const siteSettingsStore: UnwrapNestedRefs<{
    settings?: Partial<SiteSettings>,
    contacts?: Partial<Contact>,
    routes?: Partial<Routes>,
    home_page?: Partial<HomePage>,
    constructedLogo: ComputedRef<{
        src: string,
        alt: string
    }>
}> = reactive({constructedLogo: constructedLogo})

export default siteSettingsStore
