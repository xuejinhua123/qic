// 静态文件API

import axios from "axios"
// import { hideLoading, showLoading } from "../element-plus/JHLoading"
// import _axios, { _interReq, _interRes } from "../request/qicInterceptor"
import { _getUrl } from "../utils/getUrl"
const _axios = axios.create()
/** JSON(静态数据)
 * 获取表内容 http://localhost/js/Thermal.json
 * @param tableName 表名
 * @returns 
 */
export const GetTableJson = (tableName: string) => new Promise((resolve,reject)=>
  _axios.get(`${_getUrl()}/js/${tableName}.json`).then(res => {
    resolve(res)
    // if (res.status === 200) {
    //   hideLoading()
    // }
  }).catch( () => {
    reject(new Error('JSON(静态数据)异常'))
    // hideLoading()
  })

  // // 取消拦截器
  // {
  //   _axios.interceptors.request.eject(_interReq)
  //   _axios.interceptors.response.eject(_interRes)
  //   showLoading()

  //   return _axios.get(`${_getUrl()}/js/${tableName}.json`).then(res => {
  //     resolve(res)
  //     // if (res.status === 200) {
  //     //   hideLoading()
  //     // }
  //   }).catch( () => {
  //     reject(new Error('JSON(静态数据)异常'))
  //     // hideLoading()
  //   })
  // }
)

