module.exports = function(router, { store }) {
  router.get('/board/:key', async (ctx, next) => {
    const board = store.findBoardByKey(ctx.params.key)
    if (board) {
      ctx.body = board
    } else {
      ctx.throw(404)
    }
  })

  router.post('/board', async (ctx, next) => {
    let history = ctx.request.body.history
    if (!Array.isArray(history)) {
      history = []
    }
    ctx.body = store.createBoard(history)
  })
}
