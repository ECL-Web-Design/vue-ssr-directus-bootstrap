import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import viteSSR from "vite-ssr/plugin"
import autoprefixer from "autoprefixer"
import {resolve} from 'node:path'

const htmlRemoveTitle = () => {
    return {
        name: 'html-transform',
        transformIndexHtml(html: string) {
            let newHtml = html.replace(
                /<title>(.*?)<\/title>/,
                ``,
            )

            newHtml = newHtml.replace(
                '<link rel="icon" href="/favicon.ico">',
                `<link rel="icon" href="/favicon.ico">
                            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
                            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
                            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
                            <link rel="manifest" href="/site.webmanifest">
                            <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#000000">
                            <meta name="msapplication-TileColor" content="#da532c">
                            <meta name="theme-color" content="#ffffff">`
            )

            return newHtml
        },
    }
}

// https://vitejs.dev/config/
export default defineConfig(
    {
        plugins: [
            viteSSR(),
            vue({script: {defineModel: true}}),
            htmlRemoveTitle(),
        ],
        css:     {
            postcss: {
                plugins: [
                    autoprefixer({})
                ]
            }
        },
        esbuild: {},
        //ssr:     {format: "cjs"},
        build:   {
            rollupOptions: {
                output: {
                    format: 'esm'
                }
            },
            emptyOutDir:   true
        },
        define:  {},
        resolve: {
            alias: [{find: "@", replacement: resolve(__dirname, "./src")}]
        }
    })
