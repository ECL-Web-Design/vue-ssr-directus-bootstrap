import Fastify from 'fastify'
import cors from '@fastify/cors'
import {fileURLToPath} from 'url'
import * as path from 'path'
import {dirname} from 'path'
import {default as pageRender} from '../build/server/main.js'
import pkg from '../build/server/package.json' assert {type: 'json'}
import manifest from '../build/client/ssr-manifest.json' assert {type: 'json'}
import fastifyStatic from "@fastify/static"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const ssrStatic = pkg.ssr

const timestamp = new Date()

const fastify = Fastify()

await fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST'],
    credentials: true
})

fastify.setErrorHandler(function (error, request, reply) {
    const statusCode = error.statusCode ?? 500
    if (statusCode >= 500) {
        this.log.error(error)
    } else if (statusCode >= 400) {
        this.log.info(error)
    } else {
        this.log.error(error)
    }

    console.log('error', error.statusCode ?? 'N/A', error.message)
    reply.status(statusCode).send('Error: ' + error.message)
})


// for (const asset of ssrStatic.assets || []) {
//   // await fastify.register(fastifyStatic, {
//   //   root: path.join(__dirname, `../build/client/${asset}`),
//   //   prefix: `/${asset}`,
//   // })
//
//   console.log(path.join(__dirname, `../build/client/${asset}`), `/${asset}`)

await fastify.register(fastifyStatic, {
    root: path.join(__dirname, `../build/client`),
    wildcard: false,
    allowedPath: (pathName, root, request) => {
        return pathName !== '/ssr-manifest.json'
    }
})

fastify.get('*', async function (request, reply) {

    const url =
        request.protocol + '://' + request.hostname + request.url

    const {html, status, statusText, headers} = await pageRender(url, {
        manifest,
        preload: true,
        request,
        reply,
    })

    // html.replace(/<title>(.*?)<\/title>/, '')

    reply.type('html')
    reply.send(html)

    await reply
})

fastify.listen({host: '0.0.0.0', port: 5080}, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
})

console.log('started', timestamp.toString())
