<!-- 生产EPC模块 -->
<script setup lang="ts">
import { onUnmounted, ref, watch } from 'vue'
import { messageError } from '../../tools/element-plus/SBMessage'
import { useQirPinia } from '../../store/qir'
import { startSB_Interval } from '../../tools/utils/sb_time'
import { GetLatestEpc, GetSaveAllEPC, SaveEPC } from '../../tools/api/qicApi';
const qicStore = useQirPinia()

// EPC
let EPCInterval = ref<NodeJS.Timer | null>()
let isAutoEPC = ref<boolean>(false) // 是否是自动获取EPC中，true：是，false: 否

// EPC
const EPC = ref<string>('') // 输入框的
const EPC_ARR = ref<Array<string>>([]) // 保存的EPC
// let EPC_SELECT = ref<Array<{epc:string}>>([]) // 选择的EPC
let EPC_SHOW = ref<string>('') // 显示的EPC

// 点击获取EPC
const clickGetEPC = async () => {
  // 1、判断
  if(isValue()) return

  // 2、获取
  getEPC()
  // getTenEPC()

}

// 获取EPC (API) 手动
const getEPC = () => {

  // 1、请求
  GetLatestEpc(qicStore.queryForm.batch).then((res:any)=>{
    console.log(res)
    // 2、判断是否保存过
    if (res.data.epc === EPC_ARR.value[EPC_ARR.value.length - 1]) {
      messageError('该EPC已输入过')
      console.log('该EPC已保存过')
    } else {
        // 3、赋值
        // if (EPC_ARR.value.length === 0) {
        //   EPC_SHOW.value = res.data.epc
        // } else {
        //   EPC_SHOW.value += res.data.epc + '\n'
        // }
        EPC.value = res.data.epc
    }
  }).catch((err:any)=>{
    console.error(err)
  })

// // 2、获取数据
// const results = await GetLatestEpc(qicStore.queryForm.batch)
// const epc = results.data.epc

// // 3、判断
// if (epc === EPC_ARR.value[EPC_ARR.value.length - 1]) {
//   // messageError('该EPC已输入过')
//   console.log('该EPC已保存过')
//   return
// }

// // 如果EPC异常，停止定时器
// if(results === '') {
//   if (EPCInterval.value !== null){
//     EPCInterval.value && clearInterval(EPCInterval.value)
//   }  
// }

// // 4、赋值
// if (EPC_ARR.value.length === 0) {
//   EPC_SHOW.value = epc
// } else {
//   EPC_SHOW.value += '\n' + epc
// }
// EPC_ARR.value.push(epc) 
// EPC.value = epc
}

// 保存EPC
const saveEPC = () => {
  // 1、判断
  if (isValue()) {
    return
  }
  if (EPC.value === '') {
    messageError('请输入EPC')
    return
  }

  // 判断位数 32位不好判断
  if (EPC.value.length !== 24) {
    messageError('不是24位和32位')
    return
  }

  if (EPC_ARR.value[EPC_ARR.value.length -1] === EPC.value) {
    messageError(`“${EPC.value}”已保存过`)
    return
  }

  // 2、赋值
  if (EPC_ARR.value.length === 0) {
    EPC_SHOW.value = EPC.value + '\n'
  } else {
    EPC_SHOW.value += EPC.value + '\n'
  }
  EPC_ARR.value.push(EPC.value)

  // 3、上传
  SaveEPC(qicStore.queryForm.batch, qicStore.queryForm.DJ,
      qicStore.queryForm.jobNumber.toString(), qicStore.queryForm._name, EPC.value)
  

  // 4、重置
  EPC.value = ''
}

// 点击 自动获取EPC
const clickAutoEPC = () => {
  console.log('自动获取EPC')
  // 1、判断
  if(isValue()) return
  console.log('执行2')

  // 2、执行
  isAutoEPC.value = !isAutoEPC.value
  if (isAutoEPC.value) { // 如果是自动获取中,开启定时器
    EPCInterval.value = startSB_Interval(getAutoEPC,30*60,true) // -1：99999999秒    
  } else { // 关闭定时器
    EPCInterval.value && clearInterval(EPCInterval.value)
  }

  // 待...
  // 在定时器里添加一个pinia 如果EPC异常（没有IP），停止定时器
  // 或者再getEPC里添加
}

// 自动获取EPC 和保存EPC
const getAutoEPC = ()=>{
  GetLatestEpc(qicStore.queryForm.batch).then((res:any)=>{
    // 2、判断是否保存过
    if (res.data.epc === EPC_ARR.value[EPC_ARR.value.length - 1]) {
      messageError('该EPC已输入过')
      console.log('该EPC已保存过')
    } else {
        // 3、赋值
        if (EPC_ARR.value.length === 0) {
          EPC_SHOW.value = res.data.epc
        } else {
          EPC_SHOW.value += res.data.epc + '\n'
        }
        EPC.value = res.data.epc

        if (EPC_ARR.value[EPC_ARR.value.length -1] === EPC.value) {
          messageError(`“${EPC.value}”已保存过`)
          return
        }

        EPC_ARR.value.push(EPC.value)

        // 保存EPC
        SaveEPC(qicStore.queryForm.batch, qicStore.queryForm.DJ, qicStore.queryForm.jobNumber.toString(), qicStore.queryForm._name, EPC.value)
        EPC.value = ''

    }
  }).catch((err:any)=>{
    console.error(err)
    if (EPCInterval.value !== null){ // 4、判断 停止定时器
      EPCInterval.value && clearInterval(EPCInterval.value)
    }
  })
}



// 获取已保存的EPC
const getSaveEpc = () => {
  console.log('获取已保存的EPC')

  // 1、置空
  resetEPC()

  // 2、获取
  GetSaveAllEPC(qicStore.queryForm.batch, qicStore.queryForm.DJ, qicStore.queryForm.jobNumber.toString()).then((res:any)=>{
    // 3、判断
    // console.log(res)
    if (res.data.length !== 0) {
      res.data.forEach((v:any)=>{
        EPC_ARR.value.push(v.epc)
        EPC_SHOW.value += v.epc + '\n'
      })

      // 去掉最后的换行
      EPC_SHOW.value.substring(0, EPC_SHOW.value.length - 1)
    }
  }).catch((err:any)=>{
    console.error(err)
  })

  // 1、判断
  // if (!isValue()) {
  //   return
  // }

  // console.log('执行2')
  // console.table(qicStore.queryForm)
  
  // // 2、获取
  // const results = await GetSaveAllEPC(qicStore.queryForm.batch, qicStore.queryForm.DJ, qicStore.queryForm.jobNumber.toString())
  // console.log('获取已保存的EPC results ==> ', results)

  // EPC_SHOW.value = ''
  // EPC_ARR.value = []
  // EPC.value = ''

  // if (results === '') {
  //   return
  // }

  // console.log('执行3')

  // // 待测 
  // results.data.forEach((v:any) => {
  //   EPC_ARR.value.push(v.epc)
  //   EPC_SHOW.value += v.epc + '\n'
  // })
}

// 获取最新10条数据
// const getTenEPC = () => {
//   GetLatestTenEpc(qicStore.queryForm.batch).then((res:any)=> {
//     console.log('最新10条数据 ==> ', res)
//     if (res.data.length === 0) {
//       messageError('没有最新10条数据')
//     } else {
//       EPC_SELECT.value = []
//       EPC_SELECT.value = [...res.data]
//       EPC.value = '请选择EPC'
//     }
//   }).catch((err:any)=>{
//     console.error(err)
//   })
// }

/**
 * 判断单号 姓名，DJ，ip 是否有值
*/
const isValue = () => {
  if (qicStore.queryForm.batch === '') {
    messageError('请输入单号')
    return true
  }

  if(qicStore.queryForm.DJ === '' || qicStore.queryForm.DJ === undefined) {
    messageError('没有DJ, 请加载单号')
    return true
  }

  if (qicStore.queryForm._name === '') {
    messageError('请输入工号')
    return true
  }
  if (qicStore.queryForm.jobNumber.toString().length !== 7) {
    messageError('请输入工号')
    return true
  }

  if (qicStore.ipData.ip === '' || qicStore.ipData.ip === undefined) {
    messageError('IP信息无效')
    return true
  }
  return false
}

// 重置EPC
const resetEPC = ()=>{
  EPC_SHOW.value = ''
  EPC_ARR.value = []
  EPC.value = ''
}

onUnmounted(() => {
  isAutoEPC.value = false
  EPCInterval.value && clearInterval(EPCInterval.value)
})

// 当batch更新时,重新获取EPC getSaveEpc()
watch(()=>qicStore.queryForm.batch,(newVal, oldVal)=> {
  if(newVal !== oldVal) {
    // 1、关闭定时器
    isAutoEPC.value = false
    EPCInterval.value && clearInterval(EPCInterval.value)
  }
})

// 当dj更新时,重新获取EPC getSaveEpc()
// watch(()=>qicStore.queryForm.DJ,(newVal, oldVal)=> {
//   console.log('****************** DJ更新 EPC  **************************')
//   console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
//   if(newVal !== oldVal && newVal !== '' && qicStore.isBatch === 1 && qicStore.isRecord === 1) {

//     // 1、关闭定时器
//     isAutoEPC.value = false
//     EPCInterval.value && clearInterval(EPCInterval.value)

//     getSaveEpc() // 重获EPC
//   }
// })

// 必须用两个监听器
watch(()=>[qicStore.queryForm.DJ, qicStore.isRecord],([djNewVal, reNewVal], [djOldVal, crOldVal])=> {
  console.log('****************** 监听dj isRecord 获取 EPC **************************')
  console.log(djNewVal, djOldVal, reNewVal, crOldVal, qicStore.isBatch, qicStore.queryForm.rbo)
  if (djNewVal !== '' && qicStore.isBatch === 1) {
    if (reNewVal === 1) {
      // 1、关闭定时器
      isAutoEPC.value = false
      EPCInterval.value && clearInterval(EPCInterval.value)
      getSaveEpc() // 重获EPC
    }
  }
})

// 当单号无效时 好像没有效果
watch(()=>qicStore.isBatch, (newVal, oldVal) =>{
  console.log('*********** isBatch EPC 单号无效清空EPC ***************')
  console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
  if (newVal !== oldVal) {
    if (newVal === 0 || newVal === -1) {

      // 1、关闭定时器
      isAutoEPC.value = false
      EPCInterval.value && clearInterval(EPCInterval.value)

      // 2、置空
      resetEPC()
    }
  }
})

</script>

<template>
  <!-- 标题 -->
  <div class="qir-title right_title epc-title">
    <div>生产EPC</div>
    <div v-show="isAutoEPC">自动获取EPC中</div>
    <el-button-group>
      <el-button type="primary" @click="clickAutoEPC">{{isAutoEPC ? '关闭自动获取' : '自动获取'}}</el-button>
      <el-button type="primary" @click="clickGetEPC">获取EPC</el-button>
    </el-button-group>
  </div>
  <!-- 内容 -->
  <div class="qirm-box EPC">
    <div class="top">
      <div>EPC</div>
      <el-input v-model="EPC" placeholder="请注意填写正确,若有错误,请联系领班" clearable />
      <!-- <el-select v-model="EPC" placeholder="请注意填写正确,若有错误,请联系领班" style="width: 400px;" clearable>
          <el-option
            v-for="item in EPC_SELECT"
            :key="item.epc"
            :label="item.epc"
            :value="item.epc"
          />
      </el-select> -->
      <el-button type="primary" @click="saveEPC">保存EPC</el-button>
    </div>
    <div class="EPC-list xj-scoll">
      <el-input
        v-model="EPC_SHOW"
        placeholder="Please epc info"
        show-word-limit
        :rows=3
        disabled
        type="textarea"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.qirm-box {
  background-color: #fff !important;
  margin-bottom: 10px;
}
.right_title {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  >.el-button {
    font-size: 16px;
  }
}

.epc-title {
  .el-button {
    font-size: 16px;
  }
}
.qirm-box.EPC {
  margin-bottom: 0px;
}
.EPC .top {
  display: flex;
  margin-top: 10px;
  >div {
    margin: 0 10px;
  }
}
.EPC-list .el-textarea{
  font-size: 18px;
}

// 滚动条颜色
// .el-textarea__inner::-webkit-scrollbar{
//   width: 6px ;
//   height: 6px ;
// }
// .el-textarea__inner::-webkit-scrollbar-thumb {
//   border-radius: 3px ;
//   -moz-border-radius: 3px ;
//   -webkit-border-radius: 3px ;
//   background-color: #c3c3c3 ;
// }
// .el-textarea__inner::-webkit-scrollbar-track {
//   background-color: transparent ;
// }
</style>