<!-- 特殊要求 -->
<script setup lang="ts">
import { ref, watch } from 'vue'
import { useQirPinia } from '../../store/qir'
import { GetSpecialFormatText } from '../../tools/api/qicApi'
const qicStore = useQirPinia()
let condition = ref<string>('') // 注意核对DIT\n注意核对Format\n注意核对可变信息\n
// 获取特殊要求，测试：5-602741-BWH-00
const getSpecial = () => {
  if (qicStore.queryForm.internalItem === '') {
    return
  }
  GetSpecialFormatText(qicStore.queryForm.internalItem, qicStore.queryForm.rbo).then((res:any)=>{
    // console.log(res)
    // .split('[默认]')[1]
    condition.value = res.data.rbo + res.data.item
  }).catch((err:any)=>{
    console.error(err)
    condition.value = ''
  })
}

// 修改特殊要求(鼠标离开输入框)
// const updateAsk = () => {
  
//   if (qicStore.queryForm.internalItem === '') {
//     messageError('产品为空')
//     return
//   }
//   if (condition.value === '') {
//     messageError('特殊要求内容不能为空')
//     return
//   }
//   if (qicStore.qicUser.employeeNo === '') {
//     messageError('请登录')
//     return
//   }
  
//   updateSpecialByItem(qicStore.queryForm.internalItem, condition.value, qicStore.qicUser.employeeNo).then((res:any)=> {
//     console.log(res)
//   }).catch((err:any)=>{
//     console.error(err)
//   })
// }

watch(()=>qicStore.queryForm.internalItem, (newVal, oldVal)=>{
  if (newVal !== oldVal && newVal !== '') {
    getSpecial()
  }
})
</script>

<template>
  <el-input
    v-model="condition"
    placeholder="Please enter special requirements."
    show-word-limit
    :rows=4
    disabled
    type="textarea"
  />
  <!-- 
    :disabled="!qicStore.isForemanLogin"
    @blur="updateAsk" -->
</template>

<style scoped lang="less">

</style>