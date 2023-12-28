<!-- 上传图片 -->
<!-- type/batch/remark/employeeno -->
<!-- http://147.121.223.9:8848/FileService/UpdataImg/UpdataImg/1/1/1/1 -->
<template>
  <el-upload
    v-model:file-list="fileList"
    :action='`${ SERVER_URL_FILE }/FileService/UpdataImg/UpdataImg/${__type}/${qicStore.queryForm.batch}/${props._type}/${qicStore.queryForm.jobNumber.toString()}/${dj}`'
    list-type="picture-card"
    :before-upload="beforeAvatarUpload"
    :on-success="handleSuccess"
    :before-remove="beforeRemove"
    :on-remove="handleRemove"
    :on-preview="handlePictureCardPreview"
    
  >
  <!-- :on-remove="handleRemove" -->
    <el-icon><Plus /></el-icon>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <!-- <img w-full :src="dialogImageUrl" alt="Preview Image" /> -->
    <el-image :src="dialogImageUrl" alt="Preview Image"
      :preview-src-list="[dialogImageUrl]" fit="contain"
      :hide-on-click-modal="true"
      :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"/>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps, UploadUserFile } from 'element-plus'

import { SERVER_URL_FILE, SERVER_URL_SHOW_IMG } from '../../tools/request/qicVar'
import { useQirPinia } from '../../store/qir'
import { messageError } from '../../tools/element-plus/SBMessage'
import { deleteImgByUuid } from '../../tools/api/fileApi'
import { IQICImgReq } from '../../tools/interface/iFileData'
const qicStore = useQirPinia()

const fileList = ref<UploadUserFile[]>([])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)

const props = defineProps({
  _type: { // 1代表质量标准 2代表投诉案例
    type: String,
    default: '1'
  },
  lists: { // 图片
    type: Array<IQICImgReq>,
    default: []
  }
})


let __type = ref<string>(props._type) // 迪卡侬  + _DECA
let dj = ref<string>(props._type) // dj

import { ElMessageBox } from 'element-plus'

const _imgType = ref<Array<string>>([
  'image/jpeg','image/JPEG',
  'image/jpg','image/JPE',
  'image/png','image/PNG',
  'image/gif','image/GIF',
])


// 上传前 限制用户上传文件的格式和大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {

  console.log(props._type)

  // 如果是迪卡侬
  if (qicStore.queryForm.rbo.toUpperCase().indexOf('DECA') !== -1) {
    __type.value = props._type + '_DECA'
    dj.value = qicStore.queryForm.DJ
    console.log('迪卡侬的上传 ==> ', __type.value)
  }

  // 1、单号、工号
  if (qicStore.queryForm.batch === '') {
    messageError('请输入单号')
    return false
  }
  else if (qicStore.queryForm.jobNumber.toString() === '' || qicStore.queryForm.jobNumber === 80) {
    messageError('请输入工号')
    return false
  }
  else if (qicStore.queryForm._name === '') {
    messageError('请输入姓名')
    return false
  }

  // 如果是清线留样
  else if (props._type === '4') { // 如果是清线留样
    if (qicStore.queryForm.DJ === '') {
      messageError('请选择DJ')
      return false
    }
    if (qicStore.queryForm.rbo.toUpperCase().indexOf('DECA') === -1) {
      messageError('不是迪卡侬')
      return false
    }
  }

  // 2、图片格式
  else if (_imgType.value.indexOf(rawFile.type) === -1) {
    messageError('图片格式错误')
    return false
  }
  // 3、图片大小
  // else if (rawFile.size / 1024 / 1024 > 2) {
  //   // ElMessage.error('Avatar picture size can not exceed 2MB!')
  //   messageError('图片大小不能小于2MB')
  //   return false
  // }
  return true
}

// 上传成功时的
const handleSuccess: UploadProps['onSuccess'] = (uploadFile) =>{
  // console.table(fileList.value)
  // console.log(uploadFile)
  fileList.value[fileList.value.length - 1].name = uploadFile.data // 设置uuid，方便删除
  // console.table(fileList.value)
}

// 删除图片前
const beforeRemove: UploadProps['beforeRemove'] = (uploadFile) => {
  console.log('删除图片')
  if (uploadFile.status === 'ready' && uploadFile.percentage === 0) {
    // 如果返回的是true：不执行下面的弹框，但是会执行一次删除图片请求
    // 如果返回的是false，自己必须手动移除最后一个blob
    fileList.value.pop()
    return false
  }
  return ElMessageBox.confirm(
    '请确任是否删除图片',
    '删除图片',
    {
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancel',
      type: 'warning',
    }
  ).then(
    () => true,
    () => false
  )
}
// 删除图片
const handleRemove: UploadProps['onRemove'] = (uploadFile) => {
  deleteImgByUuid(uploadFile.name)
}

// 显示图片 - 弹框
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}


// 根据单号获取图片
// const getImgByBatch = (_batch: string)=>{
//   console.log('根据单号获取图片')
//   GetImgByBatch(_batch).then((res:any)=>{
//     console.log(res)
//     res.forEach((v:IQICImgReq) => {
//       if (v.img_Type === props._type) {
//         fileList.value.push({
//           url: SERVER_URL_SHOW_IMG + v.path,
//           name: v.uuid //先将uuid传给名字再说
//         })
//       }
//     })
//     console.table(fileList.value)
//   }).catch((err:any)=>{
//     console.error(err)
//   })
// }
// const updateList =()=>{
//   props.lists?.forEach(v=>{
//     fileList.value.push({})
//   })
// }
// console.log(props.lists)
// props.lists?.forEach((v:IQICImgReq)=>{
//   fileList.value.push({
//     url: SERVER_URL_SHOW_IMG + v.path,
//     name: v.uuid //先将uuid传给名字再说
//   })
// })
watch(()=>props.lists as [], ()=>{
  // console.log('props.lists')
  mangeList(props.lists)
  // if (newVal !== oldVal && newVal?.length !== 0) {
  //   // console.log(newVal)
  //   mangeList(newVal)
  // }
  // if (newVal?.length === 0 || newVal === undefined) {
  //   fileList.value = []
  // }
}, { deep: true })

// 处理数据
const mangeList = (arr:Array<IQICImgReq>)=>{
  fileList.value = []
  arr?.forEach((v:IQICImgReq)=>{
  fileList.value.push({
    url: SERVER_URL_SHOW_IMG + v.path,
    name: v.uuid //先将uuid传给名字再说
  })
  // console.table(fileList.value)
})
}
// 当单号变化时，获取生产留样图片 - 判断不是迪卡侬
// watch(()=>qicStore.queryForm.batch,(newVal, oldVal)=>{
//   // 单号有效，有QIC记录
//   console.log('当单号变化时，获取生产留样图片')
//   console.log(newVal, oldVal)
//   console.log(qicStore.isBatch, qicStore.isRecord)
//   if(newVal !== oldVal && newVal !=='' && qicStore.isBatch === 1 && qicStore.isRecord === 1) {
//     getImgByBatch(newVal)
//   }
// })

// 如果是迪卡侬的话，当DJ变化时，获取清线留样图片
// watch(()=>qicStore.queryForm.DJ,(newVal, oldVal)=>{
//   console.log('当单号变化时，获取迪卡侬的清线留样图片')
//   console.log(newVal, oldVal)
//   console.log(qicStore.isBatch, qicStore.isRecord)
//   if(newVal !== oldVal && newVal !=='' && qicStore.isBatch === 1 && qicStore.isRecord === 1) {
//     if (qicStore.queryForm.rbo.toUpperCase().indexOf('DECA') !== -1) {
//       // 如果是迪卡侬的
//       getImgByBatch(newVal)
//     }
//   }
// })


</script>

<style scoped lang="less">
/deep/.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 80px !important;
}
/deep/.el-upload--picture-card {
  --el-upload-picture-card-size: 90px;
}
</style>
