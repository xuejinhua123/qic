// 获取摄像头数目 过滤 -成对象
export interface ICamera {
  id?: number,
  deviceId: string,
  kind: string,
  label: string,
  groupId: string
}


// 获取图片的接口 生产留样
export interface IQICImgReq {
  extension: string, // 后缀
  img_Type: string, // 图片状态 1：2：3：生产留样
  path: string, // 图片路径
  uuid: string, // uuid
}


// 图片接口
export interface IImage { // 显示图片的接口 生产留样 清线留样
  id: number, // 下标
  uuid: string, // uuid 用来删除图片
  small_img: string, // 小图
  large_img: string, // 大图
  status: number, // 状态 1: 质量标准 2：投诉案例，3：生产留样 4：清线留样
  isLoading?: boolean, // 是否正在加载中
}


// 质量标准 案例投诉 响应数据
export interface IQualityStandardRes {
  uuid: string, // uuid
  path: string, // 图片路径
  img_Type: string, // 图片类型 1：质量标准 2：投诉案例
  remark: string, // 标题
}


// 上传图片数据 base64
export interface IUploadBase64ImgReq {
  batch: string, // 单号
  dj: string, // dj
  type: string, // 类型1 ,2: ,3: ,4: 生产留言拍照
  base64: string, // base64
  employeeno: string, // 工号
}