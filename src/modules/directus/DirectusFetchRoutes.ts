import {readSingleton} from "@directus/sdk"
import directusSdkClient from "@/modules/directus/DirectusSdkClient"
import {HomePage, Routes} from "@/types/DirectusSchema.types"

export default async function fetchRoutes(): Promise<{
    routes: Partial<Routes>,
    home_page: Partial<HomePage> | null
}> {
    if (!directusSdkClient) {
        console.warn('Directus SDK not initialised correctly')

        return Promise.resolve({routes: {route_list: []}, home_page: null})
    }

    const routes = await directusSdkClient.request(readSingleton('routes', {
        fields: [
            {
                route_list: [
                    'active_page.guid',
                    'parsed_route',
                    {route: ['page_id.guid', 'page_id.is_dynamic', 'page_id.is_home_page']},
                    'navbar_label',
                    'show_on_navbar',
                ]
            }
        ],
        sort:   ['route_list.sort'] as any
    }))

    const homePage = await directusSdkClient.request(readSingleton('home_page', {
        fields: [
            {
                selected_page: [
                    'guid'
                ]
            }
        ]
    }))

    return {
        routes:    routes as Partial<Routes>,
        home_page: homePage as Partial<HomePage>
    }
}
