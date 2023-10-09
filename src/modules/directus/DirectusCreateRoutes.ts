import type {RouteRecordRaw} from "vue-router"
import BuilderPage from "@/views/BuilderPage.vue"
import fetchRoutes from "@/modules/directus/DirectusFetchRoutes"
import PageNotFound from "@/views/PageNotFound.vue"

export function directusCreateRoutes(routeData: Awaited<ReturnType<typeof fetchRoutes>>) {
    const {routes, home_page} = routeData

    const routesOut: RouteRecordRaw[] = []

    if (home_page?.selected_page?.guid) {
        routesOut.push(
            {
                path:      '/',
                name:      'home',
                component: BuilderPage,
                props:     {
                    pageGuid: home_page.selected_page.guid ?? 'home'
                }
            })
    }

    if (routes?.route_list) {
        routes.route_list.forEach(route => {

            const routeResolvedPage = route?.route?.at(-1)

            if (!routeResolvedPage) {
                return
            }

            if (routeResolvedPage.page_id?.is_dynamic) {
                routesOut.push({
                                   path:      route?.parsed_route ?? '',
                                   component: BuilderPage,
                                   props:     route => ({
                                       pageGuid:    routeResolvedPage?.page_id?.guid ?? '',
                                       dynamicGuid: route.params.dynamicGuid
                                   })
                               })
            } else {
                routesOut.push({
                                   path:      route?.parsed_route ?? '',
                                   component: BuilderPage,
                                   props:     {
                                       pageGuid: routeResolvedPage.page_id?.guid ?? ''
                                   }
                               })
            }
        })
    }

    routesOut.push(
        {
            path:      '/:pathMatch(.*)*',
            component: PageNotFound
        })

    return routesOut
}
