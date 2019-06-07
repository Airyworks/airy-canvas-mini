<template>
  <section class="container">
    <no-ssr>
      <airy-canvas
        :data="airyCanvasData"
        :options="airyCanvasOptions"
        @commit="commit"
      />
    </no-ssr>
  </section>
</template>

<script>
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
  methods: {
    commit(element) {
      console.log('commit event', element)
    }
  }
}
</script>

<style scoped>
.container {
  height: 100vh;
}
</style>
