const Board = require('./board')

class Store {
  constructor() {
    this.keys = []
    this.boards = {}
  }

  join(id, key, client) {
    if (!this.boards[key]) {
      this.boards[key] = new Board()
    }
    const board = this.boards[key]
    board.join(id, client)
  }
}

module.exports = Store
