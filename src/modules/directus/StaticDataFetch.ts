// export async function fetchFooter(): Promise<Omit<PageFooter, 'id'>> {
//     return await directusClient.request(readSingleton('page_footer', {
//         fields: ['sections', 'privacy_policy_route', 'copywrite_info', 'footer_button']
//     }))
// }
//
// export async function fetchPageData(guid: string): Promise<Page> {
//     return await directusClient.request(readItem('page', guid, {
//         fields: ['*'],
//     }))
// }
//
// export async function fetchContactLinks(): Promise<Contact> {
//     return await directusClient.request((readSingleton('contact', {
//         fields: ['*']
//     })))
// }

// {import {graphql} from "@/gql"
//     import request from "graphql-request"
//     import type {PageDataQuery, WorkItemFullQuery, WorkPreviewsQuery} from "@/gql/graphql"
//
//     const graphqlUrl = import.meta.env.VITE_GRAPHQL_URL
//
//     export function fetchRoutes() {
//
//         const routeQry =
//         graphql(
//             /* GraphQL */ `
//                 query GlobalRoutes {
//                     home_page {
//                         selected_page {
//                             guid,
//                             background_animation {
//                                 guid
//                             }
//                         }
//                     },
//                     routes {
//                         route_list(sort: ["sort"]) {
//                             parsed_route,
//                             active_page {
//                                 guid
//                             },
//                             route(sort : ["sort"]) {
//                                 page_id {
//                                     guid,
//                                     background_animation {
//                                         guid
//                                     },
//                                     is_dynamic,
//                                     is_home_page
//                                 },
//                             },
//                             navbar_label,
//                             show_on_navbar,
//                         },
//                         work_page_route {
//                             parsed_route
//                         }
//                     }
//                 }
//             `)
//
//         return request(graphqlUrl, routeQry)
//     }
//
//     export function fetchFooter() {
//         const routeQry =
//         graphql(
//             /* GraphQL */ `
//                 query PageFooter {
//                     page_footer {
//                         privacy_policy_route {
//                             parsed_route
//                         },
//                         footer_button {
//                             route_link {
//                                 parsed_route
//                             },
//                             button_text
//                         },
//                         copywrite_info,
//                         sections(sort: ["sort"]) {
//                             heading,
//                             links {
//                                 parsed_route,
//                                 navbar_label,
//                                 active_page {
//                                     guid
//                                 }
//                             }
//                         }
//                     }
//                     site_settings {
//                         social_links(sort: ["sort"]) {
//                             key,
//                             link
//                         }
//                     },
//                     contact {
//                         contact_links (sort: ["sort"]) {
//                             key,
//                             link,
//                             label
//                         }
//                     }
//                 }
//             `)
//
//         return request(graphqlUrl, routeQry)
//     }
//
//     export function fetchPageData(guid: string) {
//         const pageQry =
//         graphql(
//             /* GraphQL */`
//                 query PageData($guid : String!) {
//                     page(filter: {guid: {_eq: $guid}}) {
//                         guid,
//                         meta_title,
//                         meta_tags {
//                             meta_name,
//                             meta_content
//                         },
//                         og_title,
//                         og_description,
//                         og_image {
//                             ...imageData
//                         },
//                         sections {
//                             item {
//                                 __typename,
//                                 ...on home_landing {
//                                     title,
//                                     subtitle,
//                                     scroll_down_anchor,
//                                     right_heading,
//                                     contact_text,
//                                     title_highlighted_words
//                                     professions {
//                                         profession
//                                     },
//                                     links {
//                                         type,
//                                         icons {
//                                             icon
//                                         },
//                                         route_link {
//                                             parsed_route
//                                         },
//                                         button_text
//                                     }
//                                 },
//                                 ...on home_previous_work {
//                                     section_heading {
//                                         ...sectionHeading
//                                     }
//                                 },
//                                 ...on home_process_section {
//                                     section_heading {
//                                         ...sectionHeading
//                                     },
//                                     steps {
//                                         process_icon,
//                                         heading,
//                                         description,
//                                         sort
//                                     }
//                                 },
//                                 ...on home_services_section {
//                                     section_heading {
//                                         ...sectionHeading
//                                     },
//                                     section_subtext
//                                 },
//                                 ...on home_testimonials_section {
//                                     section_heading {
//                                         ...sectionHeading
//                                     },
//                                     testimonials_page_route {
//                                         parsed_route
//                                     }
//                                 },
//                                 ...on home_last_contact {
//                                     section_heading {
//                                         ...sectionHeading
//                                     }
//                                 },
//                                 ...on work_display_all {
//                                     section_heading {
//                                         ...sectionHeading
//                                     }
//                                 },
//                                 ...on testimonials_display_all {
//                                     section_heading {
//                                         ...sectionHeading
//                                     }
//                                 },
//                                 ...on contact_page_full {
//                                     section_heading {
//                                         ...sectionHeading
//                                     }
//                                 },
//                                 ...on form_section {
//                                     section_heading {
//                                         ...sectionHeading
//                                     },
//                                     form_item {
//                                         grouped,
//                                         form_name,
//                                         post_url,
//                                         submit_success_icon,
//                                         submit_error_icon,
//                                         on_submit_error,
//                                         on_submit_success,
//                                         group_list(sort: ["sort"]) {
//                                             group_label,
//                                             group_small_text,
//                                             fields(sort: ["sort"]) {
//                                                 ...formField,
//                                             }
//                                         },
//                                         field_list(sort: ["sort"]) {
//                                             ...formField
//                                         }
//                                     }
//                                 },
//                                 ...on builder_cta_section {
//                                     title,
//                                     links {
//                                         item {
//                                             ...on external_link_button {
//                                                 type,
//                                                 button_text,
//                                                 button_external_link,
//                                                 icons {
//                                                     icon
//                                                 }
//                                             },
//                                             ...on internal_link_button {
//                                                 type,
//                                                 button_text,
//                                                 route_link {
//                                                     parsed_route
//                                                 },
//                                                 icons {
//                                                     icon
//                                                 }
//                                             }
//                                         }
//                                     }
//                                 }
//                             }
//                         }
//                     }
//                 }
//
//                 fragment imageData on directus_files {
//                     id
//                     filename_download
//                     description
//                 }
//
//                 fragment formField on form_field {
//                     id,
//                     name,
//                     note,
//                     type,
//                     required,
//                     label,
//                     field_icon,
//                     placeholder,
//                     dynamic_options,
//                     static_options_list,
//                     dynamic_options_fetch_url,
//                     dynamic_option_value_field,
//                     dynamic_option_label_field,
//                     dynamic_option_icon_field,
//                     dynamic_options_data_field,
//                     autocomplete_enabled,
//                     autocomplete_value,
//                     display_conditions {
//                         name,
//                         value
//                     },
//                     validation_checks(sort: ["sort"]) {
//                         validation_fail_message,
//                         checks {
//                             condition
//                             value
//                         }
//                     },
//                     real_time_validation,
//                     autocomplete_enabled,
//                     autocomplete_value
//                 }
//
//                 fragment sectionHeading on builder_section_base {
//                     title {
//                         title,
//                         highlighted_words
//                     },
//                     header_anchor_tag,
//                     section_links {
//                         ...linkList
//                     },
//                     subtitle,
//                     content
//                 }
//
//                 fragment linkList on builder_section_base_section_links {
//                     item {
//                         ...on external_link_button {
//                             type,
//                             button_text,
//                             button_external_link,
//                             icons {
//                                 icon
//                             }
//                         },
//                         ...on internal_link_button {
//                             type,
//                             button_text,
//                             route_link {
//                                 parsed_route
//                             },
//                             icons {
//                                 icon
//                             }
//                         }
//                     }
//                 }
//             `
//         )
//
//         const vars = {
//             guid: guid
//         }
//
//         return new Promise<PageDataQuery["page"][number] | null>((resolve, reject) => {request(graphqlUrl, pageQry, vars).then(pageData => {if (pageData.page?.length > 0) {
//             resolve(pageData.page[0])} else {
//             reject("No pages")
//         }
//         })
//                                                                                                                          .catch((reason) => {
//                                                                                                                              reject(reason)
//                                                                                                                          })
//         })
//     }
//
//     export function fetchSiteSettings() {
//         const settingsQry =
//         graphql(
//             /* GraphQL */`
//                 query SiteSettings {
//                     site_settings {
//                         global_meta_title,
//                         logo {
//                             ...imageData
//                         }
//                     }
//                 }
//
//                 fragment imageData on directus_files {
//                     id
//                     filename_download
//                     description
//                 }
//             `
//         )
//
//         return request(graphqlUrl, settingsQry)
//     }
//
//     export function fetchWorkPreviews(limit = 20, excludeGuid = '-1') {
//         const workPreviewQry =
//         graphql(/* GraphQL */`
//             query WorkPreviews($limit: Int, $exclude: String) {
//                 work_item(limit: $limit, sort: ["sort"], filter: {guid: {_neq: $exclude}}) {
//                     name,
//                     sort,
//                     guid,
//                     screenshot_main {
//                         ...imageData
//                     },
//                 }
//             }
//
//
//             fragment imageData on directus_files {
//                 id
//                 filename_download
//                 description
//             }
//                 `)
//
//         const vars = {
//             limit: limit,
//             exclude: excludeGuid
//         }
//
//         return request(graphqlUrl, workPreviewQry, vars) as Promise<WorkPreviewsQuery>
//     }
//
//     export function fetchWorkItemFull(guid: string) {
//         const workFullQry =
//
//         graphql(/* GraphQL */`
//             query WorkItemFull($guid: String!) {
//                 work_item(filter: {guid: {_eq: $guid}}) {
//                     name,
//                     guid,
//                     client_info,
//                     problem,
//                     problem_tags(sort: ["sort"]) {
//                         issue_tagline,
//                         issue_icon
//                     },
//                     linked_reviews {
//                         name,
//                         review_text,
//                         headshot {
//                             ...imageData
//                         },
//                         tagline
//                     },
//                     solution,
//                     solution_tags(sort: ["sort"]) {
//                         solution_tagline,
//                         solution_icon
//                     },
//                     client_logo {
//                         ...imageData
//                     },
//                     external_url,
//                     screenshot_main {
//                         ...imageData
//                     },
//                     old_site_screenshot {
//                         ...imageData
//                     },
//                     mobile_screenshot {
//                         ...imageData
//                     },
//                     previews {
//                         directus_files_id {
//                             ...imageData
//                         }
//                     }
//
//                 }
//             }
//
//
//             fragment imageData on directus_files {
//                 id
//                 filename_download
//                 description
//             }
//                 `)
//
//         const vars = {
//             guid: guid
//         }
//
//         return request(graphqlUrl, workFullQry, vars) as Promise<WorkItemFullQuery>
//     }
//
//     export function fetchAvailableServices() {
//         const servicesQry = graphql(
//             /* GraphQL */`
//                 query AvailableServices {
//                     available_services {
//                         name,
//                         tagline,
//                         icon
//                     }
//                 }
//             `)
//
//         return request(graphqlUrl, servicesQry)
//     }
//
//     export function fetchContactLinks() {
//         const contactLinksQry = graphql(
//             /* GraphQL */`
//                 query ContactLinks {
//                     contact {
//                         contact_links {
//                             key,
//                             link,
//                             label
//                         }
//                     }
//                 }
//             `
//         )
//
//         return request(graphqlUrl, contactLinksQry)
//     }
//
//     export function fetchTestimonials(limit: number = -1) {
//         const testimonialQry = graphql(
//             /* GraphQL */`
//                 query Testimonials($limit : Int!) {
//                     customer_testimonials(limit: $limit) {
//                         name,
//                         guid,
//                         headshot {
//                             ...imageData
//                         },
//                         tagline,
//                         review_snippet,
//                         review_text,
//                         linked_site {
//                             guid,
//                             name
//                         }
//                     }
//                 }
//
//                 fragment imageData on directus_files {
//                     id
//                     filename_download
//                     description
//                 }
//             `)
//
//         const vars = {
//             limit: limit
//         }
//
//         return request(graphqlUrl, testimonialQry, vars)
//     }
