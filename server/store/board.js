const maxMember = 10

class Board {
  constructor(key, history, redis) {
    this.maxMember = maxMember
    this.key = key
    this.history = history || []
    this.redis = redis
    this.clients = []
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
    this.broadcastBasicInfo()
    client.emit('airy-history', this.history)
    client.on('airy-update', data => {
      this.history.push(data)
      this.broadcast(data, c => c.id !== client.id)
    })
    client.on('disconnect', () => {
      this.removeById(client.id)
      this.broadcastBasicInfo()
    })
  }

  broadcast(data, filter) {
    const storeData = {}
    storeData[data.uuid] = JSON.stringify(data)
    this.redis.hmset(this.key, storeData).then((res) => {
      if (res) {
        this.clients.filter(filter).forEach(client => {
          client.emit('airy-update', data)
        })
      }
    })
  }

  broadcastBasicInfo() {
    const basicInfo = this.basicInfo()
    this.clients.forEach(client => {
      client.emit('airy-basic-info', basicInfo)
    })
  }

  basicInfo() {
    return {
      key: this.key,
      message: this.history.length,
      member: this.clients.length,
      maxMember: this.maxMember
    }
  }
}

module.exports = Board
