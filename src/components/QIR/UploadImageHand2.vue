<!-- 上传图片 -->
<!-- type/batch/remark/employeeno -->
<!-- http://147.121.223.9:8848/FileService/UpdataImg/UpdataImg/1/1/1/1 -->
<template>
  <el-upload
    v-model:file-list="fileList"
    :action='`${ SERVER_URL_FILE }/FileService/UpdataImg2ReNewAisle/UpdataImg/` + 
    `${props.rbo}/${_item_}/${props._type}/${input}/${qicStore.qicUser.employeeNo.toString()}`'
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

  <el-input v-model="input" placeholder="请输入图片标题" />

  <el-dialog v-model="dialogVisible">
    <!-- <h3>{{ dialogImageUrl }}</h3> -->
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

import { SERVER_URL_FILE } from '../../tools/request/qicVar'
import { useQirPinia } from '../../store/qir'
import { messageError } from '../../tools/element-plus/SBMessage'
import { deleteTemplateByUuid } from '../../tools/api/fileApi'
const qicStore = useQirPinia()

const input = ref('')

const fileList = ref<UploadUserFile[]>([])

const dialogImageUrl = ref('')
// const diaTitle = ref('')
const dialogVisible = ref(false)

const props = defineProps({
  _type: { // 1代表质量标准 2代表投诉案例
    type: String,
    default: '1'
  },
  isReset: {
    type: Number,
    defalut: -1
  },
  rbo: {
    type: String,
    default: ''
  },
  item: {
    type: String,
    default: ''
  },
  isRBO: {
    type: Boolean,
    default: false 
  }
  // formInline: {
  //   type: Object,
  //   default: {
  //     batch: '',
  //     rbo: '',
  //     item: '',
  //   }
  // }
})

const _item_ = ref<string>()

import { ElMessageBox } from 'element-plus'

const _imgType = ref<Array<string>>([
  'image/jpeg','image/JPEG',
  'image/jpg','image/JPE',
  'image/png','image/PNG',
  'image/gif','image/GIF',
])


// 上传前 限制用户上传文件的格式和大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {

  // if (qicStore.queryForm.batch === '') {
  //   messageError('请输入单号')
  //   return false
  // }

  console.log(props.isRBO)
  if (props.isRBO) _item_.value = 'default'
  else _item_.value = props.item

  if (props.rbo === '') {
    messageError('请输入RBO')
    return false
  }

  if (!props.isRBO && _item_.value === '') {
    messageError('请输入Item')
    return false
  }

  if (input.value === '') {
    messageError('请输入图片标题')
    return false
  }
  // 2、图片格式
  else if (_imgType.value.indexOf(rawFile.type) === -1) {
    messageError('图片格式错误')
    return false
  }
  console.log('item ==> ', _item_.value)
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
  console.table(fileList.value)
  console.log(uploadFile)
  fileList.value[fileList.value.length - 1].name = uploadFile.data // 设置uuid，方便删除
  console.table(fileList.value)

  // 清除输入框
  input.value = ''
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
  deleteTemplateByUuid(uploadFile.name)
}

// 显示图片 - 弹框
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

// 重置列表 父组件调用子组件方法
const resetImgList = () => {
  fileList.value = []
  dialogImageUrl.value = ''
  dialogVisible.value = false
}
// 暴露方法给父组件
// defineExpose({resetImgList})
watch(()=>props.isReset, (newVal, oldVal)=>{
  if (newVal !== oldVal && newVal !== -1) {
    if (newVal === 1 && props._type === '1') {
      resetImgList()
    } else if (newVal === 2 && props._type === '2') {
      resetImgList()
    } else if (props.isReset === 3) { // 重置全部
      resetImgList()
    }
  }
})

watch(()=>props.item,(newVal, oldVal)=>{
  if(newVal !== '' && newVal !== oldVal) {
    resetImgList()
  }
})
</script>

<style scoped lang="less">
/deep/.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 90px !important;
}
/deep/.el-upload--picture-card {
  --el-upload-picture-card-size: 90px;
}
</style>
