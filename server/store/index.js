const generateKey = require('../utils').generateKey
const Board = require('./board')

class Store {
  constructor() {
    this.keys = []
    this.boards = {}
    this.boards['test-key'] = new Board()
  }

  join(id, key, client) {
    if (this.boards[key]) {
      this.boards[key].join(id, client)
      return true
    } else {
      return false
    }
  }

  findBoardByKey(key) {
    const board = this.boards[key]
    if (board) {
      return {
        key,
        message: board.history.length,
        member: board.clients.length
      }
    } else {
      return null
    }
  }

  createBoard(history) {
    let key = generateKey()
    while (this.boards[key]) {
      key = generateKey()
    }
    this.boards[key] = new Board(history)
    return {
      key
    }
  }
}

module.exports = Store
