<!-- 右边，显示pdf，拍照，生产交接 -->
<script setup lang="ts">

// 导入模块
import ShowPDF from './ShowPDF.vue'
// import Photograph from './Photograph.vue'
import SelectImg from './SelectImg.vue'
import Handover from './Handover.vue'

// pina
import { useQirPinia } from '../../store/qir'
const qicStore = useQirPinia()
// isShowPDF 切换PDF和拍照 true: 显示PDF, false: 显示拍照

/*****************************变量*****************************/




/*****************************HOOK*****************************/
// watch(()=> qicStore.isShowView, (newVal, oldVal)=> {
//   console.log('isShowView', newVal, oldVal)
//   if(newVal !== oldVal) {
//     if (newVal === 0) { // 重置所有的显示视图
//       qicStore.pdf_url = ''
//       qicStore.isCameraOnFirstCheck = false // 生产留言摄像头(关闭摄像头)
//     } else if (newVal === 1) { // 显示PDF
//       // qicStore.pdf_url = ''
//       qicStore.isCameraOnFirstCheck = false // 生产留言摄像头(关闭摄像头)
//     } else if (newVal === 2) { // 开启摄像头
//       qicStore.isCameraOnFirstCheck = true // 生产留言摄像头(开启摄像头)
//     } else {}
//   }
// })

</script>

<template>
  <div class="show">
    <!-- 标题 -->
    <div class="qir-title right_title">
      <div>展示</div>
      <el-button type="primary" @click="qicStore.isShowView = 0">清空</el-button>
    </div>
    <!-- 显示 -->
    <!-- PDF -->
    <ShowPDF v-show="qicStore.isShowView === 1" />
    <!-- 拍照 -->
    <!-- <Photograph v-show="qicStore.isShowView === 2" /> -->
    <SelectImg v-show="qicStore.isShowView === 2" />
  </div>

  <!-- 生产交接 -->
  <Handover />
  
</template>

<style scoped lang="less">

.show {
  height: 740px;
}
.handover-box {
  background-color: #fff;
}

.right_title {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  >.el-button {
    font-size: 16px;
  }
}

// 生产交接
.handover .top{
  display: flex;
  // flex-wrap: wrap;
  align-content: flex-start;
  padding-top: 10px;
}
.handover .el-textarea {
  font-size: 18px;
}
.el-form--inline .el-form-item {
  margin-right: 0px;
  margin-bottom: 15px;
}
</style>