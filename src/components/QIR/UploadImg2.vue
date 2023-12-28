<!-- 没用 -->
<template>
  <el-upload :action='`${SERVER_URL_FILE}/FileService/UpdataImg/UpdataImg/${props._type}/${batch}`'  list-type="picture-card" :auto-upload="true">
    <el-icon><Plus /></el-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail zxx" :src="file.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <el-icon><zoom-in /></el-icon>
          </span>
          
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </div>
    </template>
  </el-upload>

  <el-dialog v-model="dialogVisible">
    <img :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'

import type { UploadFile } from 'element-plus'

import { SERVER_URL_FILE } from '../../tools/request/qicVar'

const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)
const batch = ref('NSL123456789') //必须携带batch上传图片
// const type = ref('1') // 1代表质量标准 2代表投诉案例

const props = defineProps({
  _type: { // 1代表质量标准 2代表投诉案例
    type: String,
    default: '1'
  }
})

//当前为自动上传

const handleRemove = (file: UploadFile) => {
  //TODO
  console.log(file)
}

const handlePictureCardPreview = (file: UploadFile) => {
  console.log('上传')
  dialogImageUrl.value = file.url!
  dialogVisible.value = true
}


</script>


<style scoped lang="less">
/deep/.el-upload-list--picture-card {
  --el-upload-list-picture-card-size: 100px !important;
}
/deep/.el-upload--picture-card {
  --el-upload-picture-card-size: 100px;
}
</style>
