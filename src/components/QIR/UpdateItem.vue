<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import { useQirPinia } from '../../store/qir'
import { messageError, messageSuccess } from '../../tools/element-plus/SBMessage'
import { GetSpecialFormatText, updateSpecialByItem, UpdateSpecialByRBO } from '../../tools/api/qicApi'
import { GetRboByItem } from '../../tools/api/fileApi'
const qicStore = useQirPinia()

const GetData = ref({
  rbo: '',
  item: ''
})

const formInline = reactive({
  RBO: '',
  Item: ''
})
// let Item = ref<string>('')
// let RBO = ref<string>('')
let condition = ref<string>('') // 注意核对DIT\n注意核对Format\n注意核对可变信息\n
let isRBO = ref<boolean>(false) // 是否是RBO上传 true: 是 false:item上传

// 获取特殊要求，测试：5-602741-BWH-00
const getSpecial = () => {
  if (formInline.Item === '') {
    messageError('产品为空')
    return
  }
  GetSpecialFormatText(formInline.Item, formInline.RBO).then((res:any)=>{
    // .split('[默认]')[1]
    GetData.value = res.data
    messageSuccess('查询成功')
  }).catch((err:any)=>{
    console.error(err)
    condition.value = ''
  })
}


// 修改特殊要求(鼠标离开输入框)
const updateAsk = () => {
  
  if (formInline.Item === '') {
    messageError('产品为空')
    return
  }
  if (condition.value === '') {
    messageError('特殊要求内容不能为空')
    return
  }
  if (qicStore.qicUser.employeeNo === '') {
    messageError('请登录')
    return
  }

  if (isRBO.value)
  {
    UpdateSpecialByRBO(formInline.RBO, condition.value, qicStore.qicUser.employeeNo).then((res:any)=> {
      console.log(res)
      messageSuccess('修改RBO特殊要求成功')
    }).catch((err:any)=>{
      console.error(err)
    })
  }
  else
  {
    updateSpecialByItem(formInline.Item, condition.value, qicStore.qicUser.employeeNo).then((res:any)=> {
      console.log(res)
      messageSuccess('修改Item特殊要求成功')
    }).catch((err:any)=>{
      console.error(err)
    })
  }
  
  
}

// 根据item 获取rbo
const getRBO =(item:string)=>{

  if (isRBO.value)
  {
    messageError('错误RBO不能获取，请输入一个item')
    return
  }


  if (formInline.Item === '') {
    messageError('请输入Item')
    return
  }

  GetRboByItem(item).then((res:any)=>{
    console.log(res)
    formInline.RBO = res.data

    getSpecial()

  }).catch((err:any)=>{
    console.error(err)
    messageError(err.msg)
  })
}

// const resetFrom = ()=>{
//   // 重置输入框
//   formInline.Item = ''
//   formInline.RBO = ''
// }

watch(isRBO,()=>{
  console.log(isRBO.value)
  if (isRBO.value)
  {
    condition.value = GetData.value.rbo
  }
  else
  {
    condition.value = GetData.value.item
  }
})


</script>

<template>
    <div>
        <div class="title">修改特殊要求 - {{isRBO ? 'RBO' : 'Item'}} - 修改</div>
        <div>
          <el-form :inline="true" :model="formInline" size="larger" class="demo-form-inline" status-icon>
            <el-form-item label="RBO" prop="RBO">
              <el-input v-model="formInline.RBO" placeholder="RBO" clearable :disabled="!isRBO"/>
            </el-form-item>
            <el-form-item label="Item" prop="item">
              <el-input v-model="formInline.Item" placeholder="Item" clearable :disabled="isRBO"/>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="()=>getRBO(formInline.Item)">获取</el-button>
              <el-button type="warning" @click="updateAsk">修改</el-button>
              <!-- <el-button type="primary" @click="resetFrom">RESET</el-button> -->

              <el-button type="success" v-show="!isRBO" @click="isRBO = true">RBO</el-button>
              <el-button type="warning" v-show="isRBO" @click="isRBO = false">ITEM</el-button>
            </el-form-item>
          </el-form>

        </div>
        <!-- <div>
            <el-input disabled v-model="RBO" placeholder="RBO" clearable />
            <el-input v-model="Item" placeholder="item" clearable />
            <el-button type="primary" @click="getSpecial">获取</el-button>
            <el-button type="success" @click="updateAsk">修改</el-button>
        </div> -->
        <div>
            <el-input
                v-model="condition"
                placeholder="Please enter special requirements."
                show-word-limit
                :rows=4
                :disabled="!qicStore.isForemanLogin"
                type="textarea"
            />
        </div>
    </div>
</template>


<style scoped lang="less">
.title {
  margin-bottom: 30px;
  text-align: center;
  font-size: 18px;
  color: chocolate;
}
</style>