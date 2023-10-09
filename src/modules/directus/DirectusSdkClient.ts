import {createDirectus, DirectusClient, rest, RestClient, staticToken} from "@directus/sdk"
import {CustomDirectusTypes} from "@/types/DirectusSchema.types"

let directusSdkClient: null | (DirectusClient<CustomDirectusTypes> & RestClient<CustomDirectusTypes>) = null
try {
    directusSdkClient = createDirectus<CustomDirectusTypes>('Directus Api Url')
        .with(rest())
        .with(staticToken('put static access token here'))

} catch {
    console.warn('INVALID URl - Make sure the Directus SDK Url has being replaced')
}
const linkListFragment = []
export const directusFragments = {
    directusImage:  ['id', 'filename_download', 'description'] as ['id', 'filename_download', 'description'],
    linkList:       linkListFragment,
    builderHeading: [
        {title: ['title', 'highlighted_word']},
        'header_anchor',
        'subtitle',
        'content',
        {section_links: linkListFragment}
    ]
}

export default directusSdkClient
