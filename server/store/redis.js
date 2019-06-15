const redis = require('redis')

class Redis {
  constructor(config) {
    this.config = config
    try {
      if (config) {
        let [ host, port ] = config.split(':')
        if (port) {
          port = parseInt(port)
          this.client = redis.createClient(port, host)
        } else {
          this.client = redis.createClient(6379, host)
        }
      }
    } catch {
      throw Error('redis connect failed')
    }
  }
}

module.exports = Redis
