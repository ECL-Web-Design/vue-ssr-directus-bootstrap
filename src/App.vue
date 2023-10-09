<template>
    <!--Suspense is needed to support top level await in components-->
    <!--You can remove this if you use onServerPrefetch instead but this can increase code complexity -->
    <suspense>
        <main id="main" ref="pageMainRef">
            <page-navbar :nav-routes="navRoutes"></page-navbar>
            <div class="page">
                <router-view v-slot="{ Component }">
                    <keep-alive>
                        <component :is="Component"
                                   :key="$route.path"
                                   class="router-page"/>
                    </keep-alive>
                </router-view>
            </div>
            <page-footer></page-footer>
        </main>
    </suspense>
</template>

<script lang="ts" setup>

import PageFooter from "@/components/page/PageFooter.vue"
import PageNavbar from "@/components/page/PageNavbar.vue"
import {computed} from "vue"
import siteSettingsStore from "@/stores/SiteSettingsStore"

const navRoutes = computed(() => {

    const routes: { route: string, label: string }[] = [
        {route: '/', label: 'home'}
    ]

    if (!siteSettingsStore.routes || !siteSettingsStore.routes?.route_list) {
        return [] as { route: string, label: string }[]
    }

    siteSettingsStore.routes.route_list.forEach(route => {
        if (route && route.show_on_navbar && !route.route?.at(-1)?.page_id?.is_home_page) {
            routes.push({
                            route: route.parsed_route ?? '',
                            // @ts-ignore
                            label: route.navbar_label ?? (route.active_page?.guid ?? 'INVALID')
                        })
        }
    })

    return routes
})

</script>


<style lang="scss" scoped>

.page {
  margin-top: var(--header-offset);
  padding: 0 var(--content-padding);
}

</style>
