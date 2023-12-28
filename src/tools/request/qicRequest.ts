// QIC 请求
import axios from 'axios'
import { hideLoading, showLoading } from '../element-plus/JHLoading'
// import axios from './qicInterceptor' // 没有进入到拦截器里
import { SERVER_URL_FILE, SERVER_URL } from './qicVar'
import { readLocalStorage } from '../utils/cache'

const _axios = axios.create({
  // timeout: 10000,
})
// _axios.interceptors.request.use((config:any) => {
//   // 添加token
//   if(config.url.indexOf('SpecialFormat/UpdataSpecial') !== -1) {
//     config.headers.Authorization = 'Bearer '+ readLocalStorage('token')
//   }
//   console.log('请求 config ==> ', config)
//   // 加载中
//   showLoading()
//   return config;
// }, async error => {
//   // 401
//   // _401(error)
//   console.error('请求 error ==> ', error)
//   hideLoading()
//   return Promise.reject(error)
// })
// _axios.interceptors.response.use(config =>  {
//   console.log('响应 config ==> ', config)

//   // 关闭加载
//   hideLoading()
//   return config;
// }, error => {
//   console.log('响应 error ==> ', error)
//   if(error.code === 'ERR_NETWORK') {
//     console.error('服务器没开启')
//   }

//   // 关闭加载
//   hideLoading()

//   return Promise.reject(error)
// })


// ********************  qic  *****************************

/** GET 请求
 * 
 * @param url 路径 SERVER_URL + '/QCTable/' + url
 * @param data 参数(可选)
 * @param timeout 请求超时的毫秒数(0 表示无超时时间)，默认0
 * @returns _axios
 */
export const GET = (url: any, data?: any, timeout: number = 0) => {
  // _axios.defaults.baseURL = SERVER_URL + '/QCTable/'
  return _axios({
    url: url,
    method: 'get',
    baseURL: SERVER_URL + '/QCTable/',
    params: data,
    timeout
  })
}

/** POST 请求
 * 
 * @param url SERVER_URL + '/QCTable/' + url
 * @param data 参数(可选)
 * @returns _axios
 */
export const POST = (url: any, data?: any) => {
  // _axios.defaults.baseURL = SERVER_URL + '/QCTable/'
  // return _axios.post(url, data)
  return _axios({
    url,
    method: 'post',
    baseURL: SERVER_URL + '/QCTable/',
    data
  })
}

/** POST 请求 需要领班登录
 * 
 * @param url SERVER_URL + '/QCTable/' + url
 * @param data 参数(可选)
 * @returns 
 */
export const POST_TOKEN = (url: string, data?: any)=>{
  // _axios.defaults.baseURL = SERVER_URL + '/QCTable/'
  // _axios.defaults.headers.common['Authorization'] = 'Bearer '+ readLocalStorage('token')
  return _axios({
    url,
    method: 'post',
    baseURL: SERVER_URL + '/QCTable/',
    headers: {
      'Authorization': 'Bearer '+ readLocalStorage('token')
    },
    data
  })
}



// ********************  文件  *****************************
/** GET 文件请求
 * 
 * @param url SERVER_URL_FILE + '/FileService/' + url
 * @param data 参数(可选)
 * @returns _axios
 */
export const GET_FILE = (url: any, data?: any) => {
  // _axios.defaults.baseURL = SERVER_URL_FILE + '/FileService/'
  return _axios({
    url: url,
    method: 'get',
    baseURL: SERVER_URL_FILE + '/FileService/',
    params: data
  })
}

/** POST 文件请求
 * 
 * @param url SERVER_URL_FILE + '/FileService/' + url
 * @param data 参数(可选)
 * @returns _axios
 */
export const POST_FILE = (url: any, data?: any) => {
  // _axios.defaults.baseURL = SERVER_URL_FILE + '/FileService/'
  // // application/json;charset=UTF-8
  // // _axios.defaults.headers.post['Content-Type'] = 'application/json' application/x-www-form-urlencoded;charset=UTF-8
  // _axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  // return _axios.post(url, data)

  return _axios({
    url,
    method: 'post',
    baseURL: SERVER_URL_FILE + '/FileService/',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    },
    data
  })
}


// ***************** 测试promise  ****************
export const POST_FILE_TEXT = (url: any, data?: any, isLoading: boolean = true) => {
  _axios.defaults.baseURL = SERVER_URL_FILE
  _axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
  // return _axios.post(url, data)
  // _axios.post(url, data).then(res => {}) 
  return new Promise((resolve, reject) => {
    if (isLoading) {
      showLoading()
    }
    _axios.post(url, data).then(res => {
      if (isLoading) {
        hideLoading()
      }
      resolve(res)
    }).catch(err => {
      if (isLoading) {
        hideLoading()
      }
      reject(err)
    })
  })
}
