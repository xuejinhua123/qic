// QIC 静态拦截器 用不到
import axios from 'axios'
// import { SERVEURL } from '../../assets/js/variable'

// 状态码
// import { _401 } from '../../utils/request/statusCode'


// element-plus
// import { showLoading, hideLoading } from '../utils/element-plus/JHLoading'
import { readLocalStorage } from '../utils/cache'
import { hideLoading, showLoading } from '../element-plus/JHLoading'
// import { readLocalStorage } from '../../utils/cache'


// axios.defaults.baseURL = SERVEURL
// axios.defaults.timeout = 4000

// axios.defaults.headers.post['Content-Type'] = postContentType
// axios.defaults.headers["Content-Type"] = "application/x-www-form-urlencoded;charset=UTF-8"


// axios.defaults.withCredentials = true

// 创建axios
const _axios = axios.create({ // 必须要创建拦截器，不然，有很多个axios，都是一起请求拦截的
  baseURL: '',
  // timeout: 10000,
  // headers: {
  //   'Content-Type': 'application/json;charset=UTF-8'
  // }
})

// 添加请求拦截器
const interReq = _axios.interceptors.request.use((config:any) => {

  // 添加token
  if(config.url.indexOf('SpecialFormat/UpdataSpecial') !== -1) {
    config.headers.Authorization = 'Bearer '+ readLocalStorage('token')
  }

  console.log('请求 config ==> ', config)
  // 加载中
  showLoading()

  return config;
}, async error => {

  // 401
  // _401(error)

  console.error('请求 error ==> ', error)
  hideLoading()
  return Promise.reject(error)
})

// 添加响应拦截器
const interRes = _axios.interceptors.response.use(config =>  {
  console.log('响应 config ==> ', config)

  // 关闭加载
  hideLoading()
  return config;
}, error => {
  console.log('响应 error ==> ', error)
  if(error.code === 'ERR_NETWORK') {
    console.error('服务器没开启')
  }

  // 关闭加载
  hideLoading()

  return Promise.reject(error)
})

export default _axios
// 用来取消拦截器
export const _interReq = interReq
export const _interRes = interRes
