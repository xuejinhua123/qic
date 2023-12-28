// 将base64字符串转为Blob对象
export const base64ToBlob = (base64: string, type: string) => {
  const arr = base64.split(',')
  // const mime = arr[0].match(/:(.*?);/)[1] || type
  const mime = base64.split(',')[0].split(':')[1].split(';')[0] || type
  const bstr = atob(arr[1]) // 去掉url的头,并转化为byte
  // 处理异常,将ascli码小于0的转换为大于0
  let n = bstr.length
  // 生产视图(直接针对内存): 8位无符号整数,长度1个字节
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new Blob([u8arr], { type: mime })
}


// 将Blob对象转换为file对象
export const blobToFile = (blob: Blob, fileName: string, type: string) => {
  const file = new File([blob], fileName, { type })
  return file
}


// 将base64字符串转为File对象
export const base64ToFile = (base64: string,fileName: string, type: string) => {
  const arr = base64.split(',')
  // const mime = arr[0].match(/:(.*?);/)[1] || type
  const mime = base64.split(',')[0].split(':')[1].split(';')[0] || type
  const bstr = atob(arr[1]) // 去掉url的头,并转化为byte
  // 处理异常,将ascli码小于0的转换为大于0
  let n = bstr.length
  // 生产视图(直接针对内存): 8位无符号整数,长度1个字节
  const u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], fileName, { type: mime })
}

// 将图片转为base64
