import App from '@/App.vue'

import viteSSR, {ClientOnly} from "vite-ssr"
import {createHead} from "@vueuse/head"
import siteSettingsStore from "@/stores/SiteSettingsStore"
import {directusCreateRoutes} from "@/modules/directus/DirectusCreateRoutes"
import {ssrCachedFetchAsync} from "@/modules/ssrCachedFetch"
import PrimeVue from 'primevue/config'
import "primevue/resources/themes/arya-blue/theme.css"
import "@/assets/primvue-overrides.scss"
import '@/assets/base.css'
import fetchRoutes from "@/modules/directus/DirectusFetchRoutes"
import fetchSiteSettings from "@/modules/directus/DirectusFetchSettings"
import fetchContacts from "@/modules/directus/DirectusFetchContact"

export default viteSSR(
    App,
    {
        routes: [], routerOptions: {
            scrollBehavior: (to: any, from: any, savedPosition: any) => {
                if (!to.hash) {
                    return {
                        top: 0
                    }
                }

                if (savedPosition) {
                    return {
                        top:      savedPosition.top,
                        behavior: 'instant'
                    }
                } else if (to.hash) {
                    return {el: to.hash}
                } else {
                    return {
                        top:      0,
                        left:     0,
                        behavior: 'instant'
                    }
                }
            }
        }
    },
    ({app, router, initialState}) => {

        return new Promise<any>(resolve => {

            const head = createHead()

            app.use(head)
            app.component(ClientOnly.name, ClientOnly)

            fetchRoutes().then(routesDirectus => {

                const routes = directusCreateRoutes(routesDirectus)

                routes.forEach(router.addRoute)

                app.use(router)
                app.use(PrimeVue)

                siteSettingsStore.routes = routesDirectus.routes
                siteSettingsStore.home_page = routesDirectus.home_page
                fetchContacts().then(contacts => siteSettingsStore.contacts = contacts)

                return ssrCachedFetchAsync('site-settings', fetchSiteSettings, initialState)
            }).then(settings => {
                siteSettingsStore.settings = settings
            }).finally(() => {
                resolve({
                            head
                        })
            })

        })
    }
)
