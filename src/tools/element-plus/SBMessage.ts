import { ElMessage } from 'element-plus'

// 成功
export const messageSuccess = (message: string) => {
  ElMessage({
    message,
    type:'success',
  })
}

// 警告
export const messageWarning = (message: string) => {
  ElMessage({
    showClose: true,
    message,
    type: 'warning',
  })
}


// 错误
export const messageError = (message: string) => {
  ElMessage.error(message)
}