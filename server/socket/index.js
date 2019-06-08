module.exports = (io, { store }) => {
  const connections = []
  io.on('connection', client => {
    connections.push(client)
    client.on('airy-hello', (data) => {
      store.join(client.id, data.key, client)
    })
    client.on('disconnect', () => {
      const index = connections.indexOf(client)
      connections.splice(index, 1)
    })
  })
  return io
}
