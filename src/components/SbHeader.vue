<script setup lang="ts">
// vue
// import { ref } from 'vue'

// 变量
// const logoUrl = ref<string>('../assets/logo.png')
</script>
<template>
  <div class="sb_header">
    <!-- logo -->
    <div class="logo">
      <img alt="Vue logo" class="logo" src="../assets/logo.png" height="50" />
    </div>
  </div>
</template>

<style scoped lang="less">
.sb_header {
  display: flex;
  // width: 100%;
  width: calc(~"100% - 20px");
  height: 50px;
  padding: 0 10px;
  background-color: aqua;
}
</style>
