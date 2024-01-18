// 文件api

// import axios from "axios"
import { messageSuccess } from "../element-plus/SBMessage"
import { IUploadBase64ImgReq } from "../interface/iFileData"
import { GET, GET_FILE, POST, POST_FILE } from "../request/qicRequest"

/** 根据单号获取图片
 * http://147.121.223.2:8080/QCTable/OrderData/GetImgByBatch?batch=NSL10925031
 * @param batch 
 * @returns 
 */
export const GetImgByBatch = (batch: string) => new Promise((resolve,reject)=>
  GET('OrderData/GetImgByBatch',{batch}).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)


/** 获取迪卡侬图片
 * http://147.121.223.2:8080/QCTable/OrderData/GetImgByBatchDj?batch=NSL10876015&dj=eu
 * @param batch 
 * @param dj 
 * @returns 
 */
export const GetProduceImgByBarchOrDJ = (batch: string, dj: string) => new Promise((resolve,reject)=>
  GET('OrderData/GetImgByBatchDj',{batch, dj}).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)

// 删除图片
export const deleteImgByUuid = (uuid: string) => new Promise((resolve,reject)=>
  POST_FILE(`deleteImgByUuid?uuid=${uuid}`).then(res => {
    if (res.data.isSuccess) {
      messageSuccess('删除成功')
      resolve(1)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)



/** 根据item 获取图片 质量标准 投诉案例
 * http://147.121.223.2:8848/FileService/GetTemplateImages?item=1
 * @param item 
 * @param rbo 
 * @returns 
 */
export const GetImgByItem = (item: string, rbo: string) => new Promise((resolve,reject)=>
  GET_FILE('GetTemplateImages',{item, rbo}).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)

/** 根据item 获取图片 质量标准 投诉案例
 * http://10.160.25.103:8848/FileService/GetTemplateImagesByItemDefault?item=default&rbo=WLAN
 * @param item 
 * @param rbo 
 * @returns 
 */
export const GetImgByItemDefault = (item: string, rbo: string) => new Promise((resolve,reject)=>
  GET_FILE('GetTemplateImagesByItemDefault',{item, rbo}).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)

// 删除图片 质量标准 投诉案例
// http://147.121.223.2:8848/FileService/deleteTemplateByUuid?uuid=ef495282a8134184af7de6298b891b04
export const deleteTemplateByUuid = (uuid: string) => new Promise((resolve,reject)=>
  POST_FILE(`deleteTemplateByUuid?uuid=${uuid}`).then(res => {
    if (res.data.isSuccess) {
      messageSuccess('删除成功')
      resolve(1)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)

/** 根据item获取RBO
 * http://147.121.223.2:8848/FileService/GetRboByItem?item=4-236054-000-00
 * @param item 
 * @returns 
 */
// http://147.121.223.2:8848/FileService/GetRboByItem?item=4-236054-000-00
export const GetRboByItem = (item: string) => new Promise((resolve,reject)=>
  // axios.get(`http://147.121.223.2:8848/FileService/GetRboByItem?item=${item}`).then(res => {
    GET_FILE(`GetRboByItem?item=${item}`).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)


// 上传拍照图片 public Result UpdataImgBase(string type, string batch, string dj, string base64)
// http://147.121.223.2:8848/FileService/UpdataImgBase/UpdataImg/Base64?_type=1&batch=1&dj=1&base64=2
export const UploadPicture = (data: IUploadBase64ImgReq) => {
  return POST_FILE(`/UpdataImgBase/UpdataImg/Base64?`, {
    _type: data.type,
    batch: data.batch,
    dj: data.dj,
    base64: data.base64,
    employeeno: data.employeeno
  })

  // return new Promise((resolve, reject) => {
  //   resolve(
  //     POST_FILE_TEXT(`/UpdataImgBase/UpdataImg/Base64?`, {
  //       _type: '3',
  //       batch: data.batch,
  //       dj: data.dj,
  //       base64: data.base64
  //     }, false)
  //   ),
  //   reject(new Error('上传图片异常'))
  // })

  // const resp = await POST_FILE(`/UpdataImgBase/UpdataImg/Base64?`, {
  //   _type: '3',
  //   batch: data.batch,
  //   dj: data.dj,
  //   base64: data.base64
  // })
  // console.log('上传拍照图片 resp ==> ', resp)
  // if (resp.data.isSuccess === true) {
  //   return resp.data
  // } else {
  //   console.error('上传拍照图片异常')
  //   return ''
  // }
}

// **********************  静态文件  **********************************

/** 获取生产留样 照片，迪卡侬的
 * http://147.121.223.2:8080/QCTable/FileService/GetDecathlonImgsByFist
 * @param _type 机台
 * @param machine_no 工号
 * @param today 日期
 * @param djorOther dj
 * @returns 生产留样图片
 */
export const GetDecathlonImgsByFist = (_type: string, machine_no: string, today:string, djorOther: string) => new Promise((resolve, reject) => 
  POST('/FileService/GetDecathlonImgsByFist', {_type,machine_no, today, djorOther}).then(res=>{
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(new Error('获取生产留样 照片，迪卡侬的异常'))
    }
  }).catch(() => {
    reject(new Error('获取生产留样 照片，迪卡侬的异常'))
  })
)


/** 获取清线留样 照片，迪卡侬的
 * http://147.121.223.2:8080/QCTable/FileService/GetDecathlonImgsByQinxian
 * @param _type 机台
 * @param machine_no 工号
 * @param today 日期
 * @param djorOther dj
 * @returns 生产留样图片
 */
export const GetDecathlonImgsByQinxian = (_type: string, machine_no: string, today:string, djorOther: string) => new Promise((resolve, reject) => 
  POST('/FileService/GetDecathlonImgsByQinxian', {_type,machine_no, today, djorOther}).then(res=>{
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(new Error('获取清线留样 照片，迪卡侬的异常'))
    }
  }).catch(() => {
    reject(new Error('获取清线留样 照片，迪卡侬的异常'))
  })
)


// 提交静态图片 迪卡侬的
// http://147.121.223.2:8848/FileService/SavaDecathImag
export const SavaDecathImag = (batch: string, dj: string, path:Array<string>, img_type: string, employeeno: string) => new Promise((resolve, reject) => 
  POST_FILE('/SavaDecathImag', {batch,dj, path, img_type, employeeno}).then(res=>{
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(new Error('保存图片（迪卡侬）的异常'))
    }
  }).catch(() => {
    reject(new Error('保存图片（迪卡侬）的异常'))
  })
)


/** 获取生产留样 其它图片 查询
 * http://147.121.223.2:8080/QCTable/FileService/GetOtherImgsByFist
 * @param _type 机台
 * @param machine_no 工号
 * @param today 日期
 * @param djorOther dj
 * @returns 生产留样图片
 */
export const GetOtherImgsByFist = (_type: string, machine_no: string, today:string, djorOther: string) => new Promise((resolve, reject) => 
  POST('/FileService/GetOtherImgsByFist', {_type,machine_no, today, djorOther}).then(res=>{
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(new Error('获取生产留样 照片，其它图片的异常'))
    }
  }).catch(() => {
    reject(new Error('获取生产留样 照片，其它图片的异常'))
  })
)

// 其它图片保存
// http://147.121.223.2:8848/FileService/SavaOtherImag
export const SavaOtherImag = (batch: string, dj: string, path:Array<string>, img_type: string, employeeno: string) => new Promise((resolve, reject) => 
  POST_FILE('/SavaOtherImag', {batch,dj, path, img_type, employeeno}).then(res=>{
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(new Error('其它图片保存的异常'))
    }
  }).catch(() => {
    reject(new Error('其它图片保存的异常'))
  })
)