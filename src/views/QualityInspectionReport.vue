<script setup lang="ts">

// 模块
import SbHeader from '../components/SbHeader.vue'
import QIRTable from './QIC/QIRTable.vue'
import QIRMiddle from './QIC/QIRMiddle.vue'
import QIRShow from './QIC/QIRShow.vue'

// import { SIP } from '../assets/js/variable'
// import { ref } from 'vue'


// const pdfUrl = ref<string>(`http://147.121.223.2:8080/pdf/ADNLNPAC01_1UPS_LOA_Docs.pdf`)

</script>

<template>
  <div class="qir">
    <!-- 头部 -->
    <SbHeader />
    <!-- 内容区 -->
    <div class="qir-box">
      <!-- 表 -->
      <div class="qir-table"><QIRTable /></div>
      <!-- 要求 -->
      <div class="qir-ask xj-scoll"><QIRMiddle /></div>
      <!-- 展示 -->
      <div class="qir-show xj-scoll"><QIRShow /></div>
    </div>
  </div>
</template>

<style scoped lang="less">
// 打包出现
// [WARNING] The "-" operator only works if there is whitespace on both sides [invalid-calc]
// <stdin>:320:19:
//       320 │   height: calc(100%-50px);
/**
.test{
  width: calc(~"100% - @{diss}")
}
 */
.qir {
  // display: flex;
  // width: calc(~"100% - 20px");
  width: 100%;
  height: 100%;
  // margin: 0 10px;
  // padding: 10px;
  background-color: #f0f0f0;
}
.qir-box {
  display: flex;
  width: 100%;
  height: calc(100vh - 50px);
  // padding: 5px;
  // background-color: pink;
}

.qir-table {
  width: 700px;
  margin-right: 10px;
}
.qir-ask {
  flex: 1;
  margin-right: 10px;
}
.qir-show {
  flex: 1;
}

</style>