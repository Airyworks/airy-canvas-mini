<template>
  <div class="button-container" @click="clickEvent">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'AiryButton',
  methods: {
    clickEvent(e) {
      this.$emit('click', e)
    }
  }
}
</script>

<style scoped>
.button-container {
  cursor: pointer;
}
</style>
