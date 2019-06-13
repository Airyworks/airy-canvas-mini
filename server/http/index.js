const Router = require('koa-router')
const boardWrapper = require('./board')

module.exports = (opt) => {
  const router = new Router({
    prefix: '/api/v1'
  })
  boardWrapper(router, opt)
  return router
}
