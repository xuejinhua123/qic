// QIC API

import { messageError, messageSuccess } from "../element-plus/SBMessage"
import { IQICDataReq, IQICHandoverReq } from "../interface/iQicData"
import _axios from "../request/qicInterceptor"
import { GET, POST, POST_TOKEN } from "../request/qicRequest"
// import { readLocalStorage } from "../utils/cache"

 /**
 * 获取IP信息
 * @returns IP信息
 */
export const GetIP = () => new Promise((resolve,reject)=>
  GET('IpMachine/GetLocaltionDetail', {}, 10000).then(res =>{
    console.log(res)
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => {
    reject(err)
  })
)

// http://147.121.171.249:8080/QCTable/IpMachine/UpdateLocaltionDetail
/** 添加机台信息 或 修改机台信息
 * 
 * @param _group 组别
 * @param machine 机台号
 * @returns 
 */
export const SaveIp = (_group: string, machine: string)=>new Promise((resolve,reject)=>
  POST('IpMachine/UpdateLocaltionDetail', {_group, machine}).then(res => {
    if (res.data.isSuccess) {
      messageSuccess(res.data.data)
      resolve(res.data)
    } else{
      messageError(res.data.data)
    }
  }).catch(err=>reject(err))
)

/** 获取5条历史记录
 * 
 * @returns 5条记录
 */
export const GetQICFiveRecord = () => new Promise((resolve,reject)=>
  GET('SmallFrom/GetLatestOrderNumbers', {}).then(res =>{
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => {
    reject(err)
  })
)

/** 根据IP获取单号信息
 * http://147.121.223.2:8080/QCTable/OrderData/GetLatestBatch
 * @returns 单号信息
 */
export const GetOrderInfoByIp = () => new Promise((resolve,reject)=>
  GET('OrderData/GetLatestBatch', {}).then(res =>{
    if (res.data.isSuccess === true) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => {
    reject(err)
  })
)

/** 根据batch获取订单信息
 * http://147.121.223.2:8080/QCTable/OrderData/GetOrderInfoForNumber?ordernumber=NSB10865171
 * @param ordernumber 单号
 * @returns 单号信息
 */
export const GetOrderInfoByBatch = (ordernumber: string) => new Promise((resolve,reject)=>
  GET('OrderData/GetOrderInfoForNumber', { ordernumber }).then(res => {
    resolve(res)
  }).catch(err => {
    reject(err)
  })
)
export const GetOrderInfoByBatch2 = (ordernumber: string) => new Promise((resolve,reject)=>
  GET('OrderData/GetOrderInfoForNumber', { ordernumber }).then(res => {
    if (res.data.isSuccess === true) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch(err => {
    reject(err)
  })
)


/** 获取最近一份订单
 *  http://147.121.223.2:8080/QCTable/SmallFrom/GetSmallFromByBatchEmployeeOneLine?batch=NSL10876015&employee=8019551&_process=%E5%8C%85%E8%A3%85
 * @param batch 
 * @param employee 
 * @param _process 
 * @returns 
 */
export const GetSmallFromByBatchEmployeeOneLine = (batch: string, employee: string, _process: string) => new Promise((resolve,reject)=>
  GET('SmallFrom/GetSmallFromByBatchEmployeeOneLine',{ batch, employee, _process }).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch((err) => {
    reject(err)
  })
)


// 根据batch获取QIC历史记录
// http://147.121.223.2:8080/QCTable/SmallFrom/SelectFromForBatch?batch=nsl10876015
export const SelectFromForBatch = (batch: string) => new Promise((resolve,reject)=>
  GET('SmallFrom/SelectFromForBatch', { batch }).then(res => {
    // console.log(res)
    resolve(res.data)
  }).catch((err:any) => {
    reject(err)
  })
)
export const SelectFromForBatch2 = (batch: string) => new Promise((resolve,reject)=>
  GET('SmallFrom/SelectFromForBatch', { batch }).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => {
    reject(err)
  })
)


/** 创建QIC记录
 * http://147.121.223.2:8080/QCTable/SmallFrom/AddFrom
 * @param data 
 {
  "batch": "", // 单号
  "rbo": "", // 客户
  "table_Name": "", // 表名
  "params": "", // OK:格式：1-2-1-2-4...
  "state": "", 0:未完成，1：已完成
  "employee": "", // 工号
  "cN_Name": "", // 姓名
} 
 * @returns 
 */
export const createQICRecord = (data: IQICDataReq) => new Promise((resolve,reject)=>
  POST('SmallFrom/AddFrom', data).then(res => {
    resolve(res)
  }).catch(err => {
    // 提示
    console.error('创建QIC记录异常')
    reject(err)
  })
)


/** 更新一条记录（单个OK）
 * http://147.121.223.2:8080/QCTable/SmallFrom/updateOneLine?uuid=706d80bd-5f91-4753-9c82-32e555fac8cd&keyValue=1%3A2
 * http://147.121.223.9:8080/QCTable/SmallFrom/updateOneLine?uuid=458cdc0f-baaa-4fed-9037-874790737b21&keyValue=5%3A1
 * @param uuid 
 * @param keyValue 
 * @returns 
 */
export const updateOneRecord = (uuid: string, keyValue: string, state: string) => new Promise((resolve,reject)=>
  POST(`SmallFrom/updateOneLine?uuid=${uuid}&keyValue=${keyValue}&state=${state}`).then(res => {
    resolve(res)
  }).catch(err => {
    // 提示
    console.error(err)
    reject(err)
  })
)


/** 获取特殊要求
 * http://147.121.223.2:8080/QCTable/SpecialFormat/GetSpecialFormatText?item=5-602741-BWH-00
 * @param item 产品
 * @returns 特殊要求信息
 */
export const GetSpecialFormatText = (item: string) => new Promise((resolve,reject)=>
  GET('SpecialFormat/GetSpecialFormatText', { item }).then(res => {
    if (res.data.isSuccess){
      resolve(res.data.data)
    } else {
      reject(res.data)
    }
  }).catch(err => {
    reject(err)
  })
)


/** 修改特殊要求
 * http://147.121.223.2:8080/QCTable/SpecialFormat/UpdataSpecial?batch=5-602741-BWH-00&newspecial=%E6%8C%89%E7%85%A7%E8%A6%81%E6%B1%82%E6%9D%A5
 * @param batch 
 * @param newspecial 
 * @returns 
 */
export const UpdateSpecial = (item: string, newspecial: string, employeeNo: string) => new Promise((resolve,reject)=>
  {
    // console.log(_axios)
    // _axios.defaults.headers.common['Authorization'] = 'Bearer '+ readLocalStorage('token')
    return POST_TOKEN('SpecialFormat/UpdataSpecial', { item, newspecial,employeeNo }).then(res => {
      if (res.data.isSuccess) {
        resolve(res.data)
        messageSuccess('修改特殊要求成功')
      } else {
        reject(res.data)
      }
    }).catch((err:any) => { 
      reject(err)
    })

    // 可能会出现跨域, 点击次数(自动加载、按单加载、搜索记录)太快
  }
)

/** 获取PDF
 * 
 * @param orderNumber 
 * @returns 
 */
export const GetPDF = (orderNumber: string) => new Promise((resolve,reject)=>
  GET('OrderData/GetPdfPaths', { orderNumber }).then(res => {
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => { 
    reject(err)
  })
)

/** 获取最新一条EPC
 *  http://147.121.223.2:8080/QCTable/OrderData/GetLatestEpcOneLine?batch=nsl10876015
 * @param batch 
 * @returns 
 */
export const GetLatestEpc = (batch: string) => new Promise((resolve,reject)=>
  GET('OrderData/GetLatestEpcOneLine', { batch }).then(res => {
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => { 
    reject(err)
  })
)


/** 获取最新10条EPC
 *  http://147.121.223.2:8080/QCTable/OrderData/GetLatestEpc?batch=nsl10876015
 * @param batch 
 * @returns 
 */
export const GetLatestTenEpc = (batch: string) => new Promise((resolve,reject)=>
  GET('OrderData/GetLatestEpc', { batch }).then(res => {
    if (res.data.isSuccess === true) {
      resolve(res)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => { 
    reject(err)
  })
)



/**
 * 保存EPC QcTableEpc
 * http://147.121.223.2:8080/QcTable/QcTableEpc/savaEpc
 * const resp = await POST('QcTableEpc/savaEpc', { batch, dj, employeeNo, employeeName, epc })
 * @param batch 单号 
 * @param dj dj
 * @param employeeNo 工号
 * @param employeeName 单号
 * @param epc EPC
 * @returns 
 */
export const SaveEPC = (batch: string, dj: string, employeeNo: string, employeeName: string, epc: string) => new Promise((resolve,reject)=>
  POST('QcTableEpc/savaEpc', { batch, dj, employeeNo, employeeName, epc }).then(res => {
    console.log(res)
    if (res.data.isSuccess) {
      messageSuccess('保存EPC成功')
      resolve(res)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => { 
    reject(err)
  })
)


/** 获取已保存的EPC
 *  http://147.121.223.2:8080/QCTable/QcTableEpc/selectAllByBatchDjEmp?batch=nsl10876015&dj=NPA69V&empNo=8019551
 * @param batch 
 * @param dj 
 * @param empNo 
 * @returns 
 */
export const GetSaveAllEPC = (batch: string, dj: string, empNo: string) => new Promise((resolve,reject)=>
  GET('QcTableEpc/selectAllByBatchDjEmp', { batch, dj, empNo }).then(res => {
    if (res.data.isSuccess === true) {
      resolve(res.data)
    } else {
      reject(res.data)
    }
  }).catch((err:any) => { 
    reject(err)
  })
)

/** 添加交接记录
 *  http://147.121.223.2:8080/QCTable/ProduceHandover/insertOneLine
 *  http://147.121.223.9:8080/QCTable/ProduceHandover/insertOneLine
 * @param data 
 * @returns 
 */
export const AddHandoverRecord = (data:IQICHandoverReq) => new Promise((resolve,reject)=>
  POST('ProduceHandover/insertOneLine', data).then(res => {
    console.log(res)
    if (res.data.isSuccess) {
      messageSuccess('添加交接记录成功')
      resolve(res)
    }
  }).catch((err:any) => { 
    reject(err)
  })
)

/** 获取交接记录
 * http://147.121.223.2:8080/QCTable/ProduceHandover/selectAllByBatchDj?batch=nsl10876015&dj=NPA69V&EmployeeNo=8019551
 * @param batch 单号 
 * @param dj DJ
 * @param employeeNo 工号
 * @returns 
 */
export const SelectAllByBatchDj = (batch: string, dj: string, employeeNo: string) => new Promise((resolve,reject)=>
  GET('ProduceHandover/selectAllByBatchDj', { batch, dj, employeeNo }).then(res => {
    if (res.data.isSuccess) {
      resolve(res.data)
    }
  }).catch((err:any) => { 
    reject(err)
  })
)