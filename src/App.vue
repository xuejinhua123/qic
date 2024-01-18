<script setup lang="ts">
import { onBeforeMount } from 'vue';
import { _devicePixeRatio } from './tools/utils/xj_zoom';

onBeforeMount(()=>{
  // _devicePixeRatio()
})
</script>

<template>
  <RouterView />
</template>

<style scoped lang="less">
@import url(./assets/less/xj-deep-scroll.less);
</style>
