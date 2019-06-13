module.exports.generateKey = function(len = 8) {
  let k = ''
  for (let i = 0; i < len; i++) {
    k += Math.floor(Math.random() * 16).toString(16)
  }
  return k
}
