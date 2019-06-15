const bluebird = require('bluebird')
const redis = require('redis')
bluebird.promisifyAll(redis)

class Redis {
  constructor(config) {
    if (config) {
      this.config = config
      this.initClient()
      // this.test()
    }
  }

  initClient() {
    let [ host, port ] = this.config.split(':')
    if (port) {
      port = parseInt(port)
      this.client = redis.createClient(port, host)
    } else {
      this.client = redis.createClient(6379, host)
    }
    this.client.on('error', (err) => {
      console.log('[Redis Client Error]', err);
    })
    console.log(`connect to redis server: ${host}:${port || 6379}`)
  }

  async hmset(k, obj) {
    if (this.client) {
      if (Object.entries(obj).length) {
        await this.client.hmsetAsync(k, obj)
      } else {
        return true
      }
    }
    return true
  }

  async hgetall(k) {
    if (this.client) {
      return (await this.client.hgetallAsync(k)) || {}
    } else {
      return {}
    }
  }
}

module.exports = Redis
