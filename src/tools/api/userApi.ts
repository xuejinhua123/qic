// 用户API
import { messageError, messageSuccess } from "../element-plus/SBMessage"
import { GET, POST } from "../request/qicRequest"
import { createLocalStorage } from "../utils/cache"

// 根据工号获取姓名
// http://147.121.223.2:8080/QCTable/OutputData/GetStaffName?staffNo=8024940
// export const GetNameByNo = async (staffNo: number) => {
//   const resp = await GET('OutputData/GetStaffName', { staffNo })
//   console.log('resp 根据工号获取姓名 ==> ', resp)
//   if (resp.data.isSuccess === true) {
//     return resp.data
//   } else {
//     console.log('根据工号获取姓名**异常**')
//     return messageError(resp.data.msg)
//   }
// }
export const GetNameByNo = (staffNo: number) => new Promise((resolve,reject)=>
  GET('OutputData/GetStaffName',{ staffNo }).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data)
    } else {
      reject(res.data)
      messageError(res.data.msg)
    }
  }).catch((err) => {
    reject(err)
  })
)

/** 领班登录
 * http://147.121.223.2:8080/QCTable/Jwt/login?username=8024940&password=123456
 * @param username 
 * @param password 
 * @returns 
 */
export const foremanLogin = (username: string, password: string) => new Promise((resolve,reject)=>
  POST('Jwt/login',{ username, password }).then(res => {
    if (res.data.isSuccess) {
      createLocalStorage('token', res.data.data.token)
      messageSuccess("登录成功")
      resolve(res.data)
    } else {
      reject(res.data)
      messageError(res.data.msg)
    }
  }).catch((err) => {
    reject(err)
  })
)


/** 修改密码
 * 
 * @param username 
 * @param oldpwd 
 * @param newpwd 
 * @returns 
 */
export const updatePad = (username: string, oldpwd: string, newpwd: string) => new Promise((resolve,reject)=>
  POST('Jwt/Repassword',{ username, oldpwd, newpwd }).then(res => {
    if (res.data.isSuccess) {
      messageSuccess("修改密码成功")
      resolve(res.data)
    } else {
      reject(res.data)
      messageError(res.data.msg)
    }
  }).catch((err) => {
    reject(err)
  })
)