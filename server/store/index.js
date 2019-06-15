const Redis = require('./redis')
const generateKey = require('../utils').generateKey
const Board = require('./board')

const boardKey = 'boards'

class Store {
  constructor(redis) {
    this.keys = []
    this.boards = {}
    this.redis = new Redis(redis)
    this.initHistory()
  }

  async initHistory() {
    const boards = await this.redis.hgetall(boardKey)
    for (const k in boards) {
      this.restoreBoard(boards[k])
    }
  }

  async restoreBoard(key) {
    if ((await this.redis.hgetall(boardKey))[key]) {
      const historyDict = await this.redis.hgetall(key)
      const history = []
      for (const k in historyDict) {
        history.push(JSON.parse(historyDict[k]))
      }
      this.boards[key] = new Board(key, history, this.redis)
      return true
    } else {
      return false
    }
  }

  async createBoard(history) {
    let key = generateKey()
    while (this.boards[key] || (await this.redis.hgetall(boardKey))[key]) {
      key = generateKey()
    }
    // make dict storage for easy query, despite odd
    const d = {}
    d[key] = key
    await this.redis.hmset(boardKey, d)
    // store data
    const storeData = {}
    for (const data of history) {
      storeData[data.uuid] = JSON.stringify(data)
    }
    this.redis.hmset(this.key, storeData)
    this.boards[key] = new Board(key, history, this.redis)
    return {
      key
    }
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
}

module.exports = Store
