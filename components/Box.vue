<template>
  <div class="box-container">
    <slot />
  </div>
</template>

<style>
.box-container {
  height: 40px;
  line-height: 40px;
  padding: 0 10px;
  background: #fff;
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.12);
}
</style>
