import directusSdkClient from "@/modules/directus/DirectusSdkClient"
import {readSingleton} from "@directus/sdk"
import {Contact} from "@/types/DirectusSchema.types"

export default async function fetchContacts(): Promise<Partial<Contact> | null> {

    if (!directusSdkClient) {
        console.warn('Directus SDK not initialised correctly')

        return Promise.resolve(null)
    }

    return await directusSdkClient.request(readSingleton('contact', {
        fields: [
            {contact_links: ['key', 'link', 'label']}
        ],
        //@ts-ignore
        sort: ['contact_links.sort']
    })) as Partial<Contact>
}
