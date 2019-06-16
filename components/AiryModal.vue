<template>
  <div>
    <transition name="up">
      <div v-if="open" class="modal-container">
        <div class="modal-header">
          <div class="modal-header-close" @click="closeModal">
            <font-awesome-icon
              :icon="faTimes"
              size="1x"
            />
          </div>
        </div>
        <slot />
      </div>
    </transition>
    <transition name="fade">
      <div v-if="open" class="modal-background" @click="closeModal" />
    </transition>
  </div>
</template>

<script>
import { faTimes } from '@fortawesome/free-solid-svg-icons'

export default {
  name: 'AiryModal',
  props: {
    open: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    faTimes() {
      return faTimes
    }
  },
  methods: {
    closeModal() {
      console.log('close modal')
      this.$emit('update:open', false)
    }
  }
}
</script>

<style scoped>
.modal-container {
  position: fixed;
  top: 15%;
  left: 50%;
  width: 600px;
  height: 300px;
  margin-left: -300px;
  background: #fff;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.12);
  z-index: 500;
}
.modal-header {
  padding-bottom: 20px;
  text-align: right;
}
.modal-header-close {
  cursor: pointer;
}
.modal-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
.up-enter-active, .up-leave-active {
  transition: ease-in-out .5s;
}
.up-enter, .up-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>
