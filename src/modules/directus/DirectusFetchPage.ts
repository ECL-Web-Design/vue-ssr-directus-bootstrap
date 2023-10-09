import directusSdkClient, {directusFragments} from "@/modules/directus/DirectusSdkClient"
import {readItem} from "@directus/sdk"
import {Page} from "@/types/DirectusSchema.types"

export default async function fetchPage(guid: string): Promise<Partial<Page> | null> {

    if (!directusSdkClient) {
        console.warn('Directus SDK not initialised correctly')

        return Promise.resolve(null)
    }

    return await directusSdkClient.request(readItem('page', guid, {
        fields: [
            'guid',
            'meta_title',
            {
                meta_tags: [
                    'meta_title',
                    'meta_content'
                ]
            },
            'og_title',
            'og_description',
            {og_image: directusFragments.directusImage},
            {
                sections: [
                    {
                        //@ts-ignore
                        item: ['*.*.*.*']
                    }
                ]
            }
        ]
    })) as Partial<Page>
}
