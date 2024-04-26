<!-- 操作QIC 特殊要求 质量标准 投诉案例 -->
<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { IQualityStandardRes } from '../../tools/interface/iFileData'
import { useQirPinia } from '../../store/qir'
import _getImageHooks from './hooks/getImgHooks'
import { deleteTemplateByUuid } from '../../tools/api/fileApi'
import { GetSpecialFormatText } from '../../tools/api/qicApi'
const { _qualityStandardList, _complainCaseList, _getImgByItem, _resetImg1 } = _getImageHooks()
const qicStore = useQirPinia()
// const formInline = reactive({
//   batch: '',
//   rbo: '',
//   item: '',
// })
const condition = ref<string>('注意核对DIT\n注意核对Format\n注意核对可变信息\n')

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

// 获取特殊要求，测试：5-602741-BWH-00
const getSpecial = () => {
  if (qicStore.queryForm.internalItem === '') {
    return
  }
  GetSpecialFormatText(qicStore.queryForm.internalItem, qicStore.queryForm.rbo).then((res:any)=>{
    // console.log(res)
    // .split('[默认]')[1]
    condition.value = res.special
  }).catch((err:any)=>{
    console.error(err)
    condition.value = ''
  })
}

// 根据 产品 更新
watch(()=> qicStore.queryForm.internalItem,(newVal, oldVal)=>{
  if(newVal !== oldVal && newVal !== '') {
    condition.value = ''
    _resetImg1()
    _getImgByItem(newVal, qicStore.queryForm.rbo)
    getSpecial()
  }
})

onMounted(()=>{
  console.log('mounted')
  condition.value = ''
  _resetImg1()
  _getImgByItem(qicStore.queryForm.internalItem, qicStore.queryForm.rbo)
  getSpecial()
})




</script>

<template>
  <div>
    <!-- 输入框 -->
    <el-form :inline="true" :model="qicStore.queryForm" class="demo-form-inline" status-icon>
      <el-form-item label="工号" prop="工号">
        <el-input v-model="qicStore.qicUser.employeeNo" placeholder="工号" clearable disabled />
      </el-form-item>
      <el-form-item label="RBO" prop="rbo">
        <el-input v-model="qicStore.queryForm.rbo" placeholder="RBO" clearable disabled />
      </el-form-item>
      <el-form-item label="Item" prop="item">
        <el-input v-model="qicStore.queryForm.internalItem" placeholder="Item" clearable disabled />
      </el-form-item>
      <el-form-item>
        <el-button type="primary">RESET</el-button>
      </el-form-item>
    </el-form>

    <!-- 特殊要求 -->
    <div class="qir-title">特殊要求</div>
    <div class="uqicm-item">
      <div class="scoll qirm-box condition">
        <el-input
          v-model="condition"
          placeholder="Please handover info"
          show-word-limit
          :rows=4
          disabled
          type="textarea"
        />
      </div>

      <div class="scoll qirm-box condition">
        <el-input
          v-model="condition"
          placeholder="Please handover info"
          show-word-limit
          :rows=4
          type="textarea"
        />
      </div>
    </div>
    <!-- 质量标准 -->
    <div class="qir-title qicm-title">
      <div><div>质量标准</div><div @click="()=>{_getImgByItem(qicStore.queryForm.internalItem, qicStore.queryForm.rbo);isReset = -1}" class="sb_hand">刷新</div></div>
      <div><div>上传信息</div><div class="sb_hand" @click="isReset = 1">重置</div></div>
    </div>
    <div class="quality-box">
      <div class="box-left jh_grid_100 scoll sb-h-90">
        <div class="img-item sb_hand" v-for="(v, i) in _qualityStandardList" :key="i" @click="showImgDialog(v, i, 1)">
            <el-image :src="v.path"
            style="width: 90px;" fit="contain" /><div class="img-title">{{v.remark}}</div></div>
      </div>
      <div class="box-right">
        <UploadImageHand2 _type="1" ref="Updata_IMG_Ref" :isReset="isReset" :rbo="qicStore.queryForm.rbo" :item="qicStore.queryForm.internalItem" />
      </div>
    </div>
    <!-- 投诉案例 -->
    <div class="qir-title qicm-title">
      <div><div>投诉案例</div><div @click="()=>{_getImgByItem(qicStore.queryForm.internalItem, qicStore.queryForm.rbo);isReset = -1}" class="sb_hand">刷新</div></div>
      <div><div>上传信息</div><div class="sb_hand" @click="isReset = 2">重置</div></div>
    </div>
    <div class="complaint-box">
      <div class="box-left jh_grid_100 scoll sb-h-90">
        <div class="img-item sb_hand" v-for="(v, i) in _complainCaseList" :key="i" @click="showImgDialog(v, i, 2)">
            <el-image :src="v.path"
            style="width: 90px;" fit="contain" /><div class="img-title">{{v.remark}}</div></div>
      </div>
      <div class="box-right">
        <UploadImageHand2 _type="2" :isReset="isReset" :rbo="qicStore.queryForm.rbo" :item="qicStore.queryForm.internalItem"  />
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
</style>