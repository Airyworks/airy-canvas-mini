const Redis = require('./redis')
const generateKey = require('../utils').generateKey
const Board = require('./board')

class Store {
  constructor(redis) {
    this.keys = []
    this.boards = {}
    this.redis = new Redis(redis)
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
    this.boards[key] = new Board(key, history, this.redis)
    return {
      key
    }
  }
}

module.exports = Store
