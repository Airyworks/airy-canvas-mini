<template>
  <section class="container">
    <no-ssr>
      <airy-canvas
        ref="airy-canvas"
        :data="airyCanvasData"
        :options="airyCanvasOptions"
        @commit="commit"
      />
    </no-ssr>
  </section>
</template>

<script>
import io from 'socket.io-client'

export default {
  components: {},
  data() {
    return {
      airyCanvasData: [],
      airyCanvasOptions: {
        fluid: true
      }
    }
  },
  mounted() {
    const socket = io(`${location.protocol}//${location.host}`)
    this.socket = socket
    socket.on('connect', () => {
      socket.emit('airy-hello', {
        key: 'test-key'
      })
      socket.on('airy-history', (data) => {
        this.airyCanvasData = data
      })
      socket.on('airy-update', (data) => {
        this.$refs['airy-canvas'].updateNode(data)
      })
    })
  },
  methods: {
    commit(element) {
      this.socket.emit('airy-update', element)
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
}
</style>
