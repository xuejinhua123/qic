<!-- 需要添加工号 + 标题（remark） -->
<template>
  <el-upload
    class="avatar-uploader"
    :action='`${ SERVER_URL_FILE }/FileService/UpdataImg/UpdataImg/${props._type}/${batch}`'
    :show-file-list="false"
    :auto-upload="true"
    :on-success="handleAvatarSuccess"
    :before-upload="beforeAvatarUpload"
  >
    <el-icon class="add"><Plus /></el-icon>
  </el-upload>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus } from '@element-plus/icons-vue'

import type { UploadProps } from 'element-plus'
// import { UPDATE_IMG } from '../../assets/js/variable'
import { SERVER_URL_FILE } from '../../tools/request/qicVar'

// ************ 变量  **************
const _imgType = ref<Array<string>>([
  'image/jpeg','image/jpg','image/png','image/gif'
])


const imageUrl = ref('')

const batch = ref('NSL123456789') //必须携带batch上传图片
// const type = ref('1') // 1代表质量标准 2代表投诉案例

const props = defineProps({
  _type: { // 1代表质量标准 2代表投诉案例
    type: String,
    default: '1'
  }
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  console.log(response)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (_imgType.value.indexOf(rawFile.type) === -1) {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  }
  else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}
</script>

<style scoped lang="less">
.avatar-uploader {
  display: flex;
  justify-content: center;
}
.add {
  font-size: 20px;
  width: 80px;
  height: 80px;
  border: 1px dotted #999;
  background-color: #fafafa;
}
</style>
