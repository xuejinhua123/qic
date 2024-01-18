<!-- 上传图片 手动 质量标准 投诉案例 -->
<script setup lang="ts">
import { ref } from 'vue'
import type { UploadInstance } from 'element-plus'
import type { UploadProps, UploadUserFile } from 'element-plus'
import { SERVER_URL_FILE } from '../../tools/request/qicVar'
import { useQirPinia } from '../../store/qir'
import { messageError } from '../../tools/element-plus/SBMessage'
const qicStore = useQirPinia()

const fileList = ref<UploadUserFile[]>([])
const uploadRef = ref<UploadInstance>()
const props = defineProps({
  _type: { // 1代表质量标准 2代表投诉案例
    type: String,
    default: '1'
  },
  formInline: {
    type: Object,
    default: {
      batch: '',
      rbo: '',
      item: '',
    }
  }
})
const input = ref('')
const _imgType = ref<Array<string>>([
  'image/jpeg','image/JPEG',
  'image/jpg','image/JPE',
  'image/png','image/PNG',
  'image/gif','image/GIF',
])

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
// 显示图片 - 弹框
const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
  console.table(fileList.value)
}
// 提交保存
const submitUpload = () => {
  console.log(props.formInline)
  uploadRef.value!.submit()
}
// 上传前 限制用户上传文件的格式和大小
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  console.log(rawFile)

  if (props.formInline.batch === '') {
    messageError('请输入单号')
    return false
  }

  if (props.formInline.rbo === '') {
    messageError('请输入RBO')
    return false
  }

  if (props.formInline.item === '') {
    messageError('请输入Item')
    return false
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
// 上传状态改变时 添加文件、上传成功和上传失败
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  console.log(uploadFile)
  console.log(uploadFiles)
  if (input.value === '') {
    messageError('请输入图片标题')
    uploadFiles.pop()
    return
  }
  if (uploadFile.status === 'ready' && uploadFile.percentage === 0) {
    uploadFiles[uploadFiles.length -1].name = input.value
    input.value = ''
  } else if (uploadFile.status === 'success') {
    uploadFiles = []
    fileList.value = []
  }
}
</script>

<template>
  <div class="jh_grid_100 scoll sb-h-108">
    <div class="img-item" v-for="(v, i) in fileList" :key="i">
    <el-image :src="v.url"
      style="width: 80px; height: 80px;" fit="contain" /><div class="img-title">{{v.name}}</div></div>
  </div>
  <!-- v-model:file-list="fileList" -->
  <div>
    <!-- http://147.121.223.2:8848/FileService/UpdataImg2ReNewAisle/UpdataImg/1/1/1/1/1/1 -->
    <!-- batch rbo item imgtype remark employeeno -->
    <el-upload
      v-model:file-list="fileList"
      :show-file-list="false"
      list-type="picture-card"
      ref="uploadRef"
      :action='`${ SERVER_URL_FILE }/FileService/UpdataImg2ReNewAisle/UpdataImg/` + 
      `${props.formInline.batch}/${props.formInline.rbo}/${props.formInline.item}/${props._type}/11/${qicStore.queryForm.jobNumber.toString()}`'
      :auto-upload="false"
      :before-upload="beforeAvatarUpload"
      :on-change="handleChange"
      :on-preview="handlePictureCardPreview"
    >
      <el-icon><Plus /></el-icon>
    </el-upload>
    <el-input v-model="input" placeholder="请输入图片标题" />
    <el-button type="success" @click="submitUpload">
        确认上传
    </el-button>
    <el-button type="info">
        重置
    </el-button>
    <el-dialog v-model="dialogVisible">
      <img w-full :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
  </div>
</template>

<style scoped lang="less">
/deep/.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 90px !important;
}
/deep/.el-upload--picture-card {
  --el-upload-picture-card-size: 90px;
}
.jh_grid_100 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
.img-item {
  margin-top: 5px;
  text-align: center;
}
.img-title {
  padding-bottom: 3px;
  text-align: center;
  font-size: 16px;
  letter-spacing: .5em;
}
</style>