// 消息提示

import { ElNotification } from "element-plus"

// 默认左上角
export const NotificationSuccess = (message:string, title:string = 'Success') =>{
  ElNotification({
    title,
    message,
    type: 'success',
  })
}

export const NotificationWarning = (message:string, title:string = 'Warning') =>{
  ElNotification({
    title,
    message,
    type: 'warning',
  })
}

export const NotificationInfo = (message:string, title:string = 'Info') =>{
  ElNotification({
    title,
    message,
    type: 'info',
  })
}

export const NotificationError = (message:string, title:string = 'Error') =>{
  ElNotification({
    title,
    message,
    type: 'error',
  })
}
