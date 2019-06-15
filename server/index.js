const Koa = require('koa')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const program = require('commander')
const Store = require('./store')

const app = new Koa()
app.use(require('koa-bodyparser')())
const server = require('http').createServer(app.callback())
const io = require('socket.io')(server)
const ioWrapper = require('./socket')

// Import and Set Nuxt.js options
const config = require('../nuxt.config.js')
config.dev = !(app.env === 'production')

// commander configuration
program
  .version(require('../package.json').version)
  .option('-r, --redis [type]', 'Redis host and port')
  .parse(process.argv)

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || '127.0.0.1',
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  const store = new Store(program.redis)
  const router = require('./http/')({ store })

  app
    .use(router.routes())
    .use(router.allowedMethods())
  app.use((ctx) => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  ioWrapper(io, { store })

  server.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
