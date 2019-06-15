class Board {
  constructor(key, history, redis) {
    this.key = key
    this.history = history || []
    this.redis = redis
    this.clients = []
    this.fetchHistory()
  }

  join(id, client) {
    this.removeById(id)
    this.clients.push(client)
    this.registerClient(client)
  }

  removeById(id) {
    const index = this.clients.findIndex(c => c.id === id)
    if (index >= 0) {
      // kick off
      this.clients.splice(index, 1)
    }
  }

  registerClient(client) {
    client.emit('airy-history', this.history)
    client.on('airy-update', data => {
      this.history.push(data)
      this.broadcast(data, c => c.id !== client.id)
    })
    client.on('disconnect', () => {
      this.removeById(client.id)
    })
  }

  broadcast(data, filter) {
    this.clients.filter(filter).forEach(client => {
      client.emit('airy-update', data)
    })
  }
}

module.exports = Board
