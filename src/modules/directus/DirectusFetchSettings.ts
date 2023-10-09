import {readSingleton} from "@directus/sdk"
import directusSdkClient, {directusFragments} from "@/modules/directus/DirectusSdkClient"
import {SiteSettings} from "@/types/DirectusSchema.types"

export default async function fetchSiteSettings(): Promise<Partial<SiteSettings> | null> {
    if (!directusSdkClient) {
        console.warn('Directus sdk is not initialised')

        return Promise.resolve(null)
    }

    return await directusSdkClient.request(readSingleton('site_settings', {
        fields: [
            'global_meta_title',
            'site_name',
            {
                logo: directusFragments.directusImage
            },
            {
                social_links: [
                    'key',
                    'link'
                ]
            }
        ]
    })) as Partial<SiteSettings>
}
