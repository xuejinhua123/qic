<!-- 质量标准 投诉案例  上传图片 item上传 -->
<!-- 操作QIC 特殊要求 质量标准 投诉案例 -->
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { IQualityStandardRes } from '../../tools/interface/iFileData'
import { useQirPinia } from '../../store/qir'
import _getImageHooks from './hooks/getImgHooks'
import { GetRboByItem, deleteTemplateByUuid } from '../../tools/api/fileApi';
import { messageError } from '../../tools/element-plus/SBMessage';
import { GetOrderInfoByBatch } from '../../tools/api/qicApi';
// import { messageError } from '../../tools/element-plus/SBMessage';
const { _qualityStandardList, _complainCaseList, _getImgByItem, _resetImg1, _getImgByItemDefault } = _getImageHooks()
const qicStore = useQirPinia()
const formInline = reactive({
  jobNumber: '',
  RBO: '',
  internalItem: '',
  batch: ''
})

// 重置输入框
// const resetInput = () => {
//   formInline.batch = ''
//   formInline.rbo = ''
//   formInline.item = ''
// }

const dialogImageUrl = ref<any>({ 
  uuid: '',
  path: '',
  remark: '',
  img_Type: '',
  index: 0,
  type: 0
 })
const dialogVisible = ref(false)
let isReset = ref<number>(-1)
const isRBO = ref<boolean>(false) // 是否是RBO上传 true: 是 false:item上传

// 获取图片
// const getImg = ()=>{
//   console.log(formInline.item)
//   if (formInline.item === '') {
//     console.log('请输入item')
//     return
//   }
//   GetImgByItem(formInline.item).then((res:any)=>{
//     console.log(res)
//   }).catch((err:any)=>{
//     console.error(err)
//   })
// }

// 图片弹框
const showImgDialog = (v: IQualityStandardRes, index: number, type: number) => {
  dialogVisible.value = true
  dialogImageUrl.value = v
  dialogImageUrl.value.index = index
  dialogImageUrl.value.type = type

}

// 删除图片
const clickDeleteImg = (data:any)=>{
  deleteTemplateByUuid(data.uuid)
  dialogVisible.value = false

  if (data.type === 1) {
    _qualityStandardList.value.splice(data.index, 1)
  } else if (data.type === 2) {
    _complainCaseList.value.splice(data.index, 1)
  }
}

// // 重置上传列表 父组件调用子组件的方法
// const Updata_IMG_Ref = ref(null)
// const resetUploadImgList =()=>{
//   Updata_IMG_Ref?.value.resetList()
// }

// const getR = ()=>{
//   if (formInline.internalItem === '') return
//   console.log(formInline.internalItem)
//   if (formInline.internalItem.toString().length === 15) {
//     getRBO(formInline.internalItem)
//   } else {
//     messageError('item必须是15位')
//   }
// }
const win:any = window
const { ITEM_SIZE } = win
let currentItem = ref<string>('')
let isBatch = ref<boolean>(false) // 是否是batch请求数据


// item操作
const blurR = () => {
  console.log('执行item', ITEM_SIZE)

  // 如果batch请求数据了，不用item请求
  if (isBatch.value) return

  // 1、去空 再判断
  formInline.internalItem = formInline.internalItem.trim()
  if (formInline.internalItem === '') return

  // 2、去掉上次请求的
  if (currentItem.value === formInline.internalItem) return
  // 赋值 后 判断
  currentItem.value = formInline.internalItem

  // 3、如果人为删除了item 大小判断, 默认大于10开始
  const len = formInline.internalItem.toString().length
  if (ITEM_SIZE.length === 0) {
    if (len >= 6) {
      // 获取RBO
      getRBO(formInline.internalItem)
      isReset.value = 3
    }
    return
  }

  // 4、正常清空下判断
  if (ITEM_SIZE.indexOf(len) !== -1) {
    // 获取RBO
    getRBO(formInline.internalItem)
    isReset.value = 3
    return
  }

  // 5、其它情况
  if (len >= 6) {
    // 获取RBO
    getRBO(formInline.internalItem)
    isReset.value = 3
  }

  // 后面再防抖 不用
  

  // if (formInline.internalItem.toString().length === 12) {
  //   // 获取RBO
  //   getRBO(formInline.internalItem)
  // }

  // if (formInline.internalItem.toString().length === 15) {
  //   // 获取RBO
  //   getRBO(formInline.internalItem)
  // }

  // // 判断是否为15位，再获取图片 重置 质量标准 投诉案例 图片+上传的图片
  // if (formInline.internalItem.toString().length === 15) {
  //   console.log('15')
  //   _getImgByItem(formInline.internalItem)
  //   isReset.value = 3
  // }
}

// batch操作
const blurBatch = ()=>{
  formInline.batch = formInline.batch.trim()
  if (formInline.batch === '') return
  if (formInline.batch.length !== 11) {
    messageError('请输入11位batch')
    return
  }

  // 
  
  console.log(formInline.batch)
  getItemRBO(formInline.batch)
}

// 根据batch 获取 item rbo
const getItemRBO = (_batch: string)=>{
  GetOrderInfoByBatch(_batch).then((res:any)=>{
    console.log(res)
    if (res.data.isSuccess) {
      isBatch.value = true
      formInline.RBO = res.data.data.rbo
      formInline.internalItem = res.data.data.internalItem
      // 获取图片
      _getImgByItem(formInline.internalItem, formInline.RBO)
      isReset.value = 3
    } else {
      messageError(res.data.msg)
      isBatch.value = false
      formInline.RBO = ''
      _resetImg1()
      isReset.value = 3
    }
  }).catch((err:any)=>{
    console.log(err)
    isBatch.value = false
    formInline.RBO = ''
    _resetImg1()
    isReset.value = 3
  })
}

// 根据item 获取rbo
const getRBO =(item:string)=>{
  GetRboByItem(item).then((res:any)=>{
    console.log(res)
    formInline.RBO = res.data
    // 获取图片
    _getImgByItem(formInline.internalItem, formInline.RBO)
  }).catch((err:any)=>{
    console.error(err)
    messageError(err.msg)
    formInline.RBO = ''
    _resetImg1()
  })
}

// 点击刷新
const clickRefresh = ()=> {
  isReset.value = -1

  if (isRBO.value) _getImgByItemDefault('default', formInline.RBO)
  else _getImgByItem(formInline.internalItem, formInline.RBO)
}

const resetFrom = ()=>{
  // 重置输入框
  formInline.internalItem = ''
  formInline.RBO = ''
  formInline.batch = ''
  currentItem.value = ''
  isBatch.value = false
  isReset.value = 3 // 重置上传的图片
  _resetImg1() // 重置图片列表 - 质量标准 投诉案例
}




</script>

<template>
  <div>
    <!-- 输入框 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline" status-icon>
      <el-form-item label="工号" prop="工号">
        <el-input v-model="qicStore.qicUser.employeeNo" placeholder="工号" clearable disabled />
      </el-form-item>
      <el-form-item label="RBO" prop="RBO">
        <el-input v-model="formInline.RBO" placeholder="RBO" clearable :disabled="!isRBO" />
      </el-form-item>
      <el-form-item label="Item" prop="item">
        <el-input v-model="formInline.internalItem" placeholder="Item" clearable @blur="blurR" :disabled="isRBO" />
      </el-form-item>
      <el-form-item label="batch" prop="batch">
        <el-input v-model="formInline.batch" placeholder="batch" clearable @blur="blurBatch" :disabled="isRBO" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="resetFrom">RESET</el-button>
        <el-button type="success" v-show="!isRBO" @click="isRBO = true">RBO</el-button>
        <el-button type="warning" v-show="isRBO" @click="isRBO = false">ITEM</el-button>
      </el-form-item>
    </el-form>
    <!-- 质量标准 -->
    <div class="qir-title qicm-title">
      <div><div>质量标准</div><div @click="clickRefresh" class="sb_hand">刷新</div></div>
      <div><div>上传信息</div><div class="sb_hand" @click="isReset = 1">重置</div></div>
    </div>
    <div class="quality-box">
      <div class="box-left jh_grid_100 scoll sb-h-90">
        <div class="img-item sb_hand" v-for="(v, i) in _qualityStandardList" :key="i" @click="showImgDialog(v, i, 1)">
            <el-image :src="v.path"
            style="width: 90px;" fit="contain" /><div class="img-title">{{v.remark}}</div></div>
      </div>
      <div class="box-right">
        <UploadImageHand2 _type="1" ref="Updata_IMG_Ref" :isReset="isReset" :rbo="formInline.RBO" :item="formInline.internalItem" :isRBO="isRBO" />
      </div>
    </div>
    <!-- 投诉案例 -->
    <div class="qir-title qicm-title">
      <div><div>投诉案例</div><div @click="clickRefresh" class="sb_hand">刷新</div></div>
      <div><div>上传信息</div><div class="sb_hand" @click="isReset = 2">重置</div></div>
    </div>
    <div class="complaint-box">
      <div class="box-left jh_grid_100 scoll sb-h-90">
        <div class="img-item sb_hand" v-for="(v, i) in _complainCaseList" :key="i" @click="showImgDialog(v, i, 2)">
            <el-image :src="v.path"
            style="width: 90px;" fit="contain" /><div class="img-title">{{v.remark}}</div></div>
      </div>
      <div class="box-right">
        <UploadImageHand2 _type="2" :isReset="isReset" :rbo="formInline.RBO" :item="formInline.internalItem" :isRBO="isRBO" />
      </div>
    </div>
  </div>

  <!-- 弹框显示图片 -->
  <el-dialog v-model="dialogVisible">
    <el-button size="large" class="delete-btn" type="danger" @click="clickDeleteImg(dialogImageUrl)">删 除</el-button>
    <br>
    <!-- <img w-full :src="dialogImageUrl.path" alt="Preview Image" /> -->
    <el-image :src="dialogImageUrl.path" alt="Preview Image"
      :preview-src-list="[dialogImageUrl.path]" fit="contain"
      :hide-on-click-modal="true"
      :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"/>
  </el-dialog>
  
</template>

<style lang="less" scoped>
.uqicm-item {
  display: flex;
}
// 特殊要求
.condition {
  flex: 50%;
}
.condition .el-textarea{
  font-size: 20px;
  --el-input-text-color: #f52025;
  --el-disabled-text-color: #f52025;
}
.quality-box,
.complaint-box {
  display: flex;
  >div {
    flex: 1;
  }
}
.qicm-title {
  display: flex;
  >div {
    flex: 1;
    display: flex;
    justify-content: space-between;
    >div {
      margin-right: 10px;
    }
  }
}
.box-left {
  width: 100%;
}
.img-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5px;
  text-align: center;
  >.el-image {
    flex: 1;
  }
}
.jh_grid_100 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
.el-form--inline .el-form-item {
  margin-right: 10px;
}
</style>