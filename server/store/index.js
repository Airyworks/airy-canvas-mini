const Board = require('./board')

class Store {
  constructor() {
    this.keys = []
    this.boards = {}
    this.initTestBoard()
  }

  initTestBoard() {
    const testKeyName = 'test-key'
    this.keys.push(testKeyName)
    this.boards[testKeyName] = new Board()
  }
}

module.exports = Store
