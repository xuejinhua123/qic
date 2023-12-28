import { ref, watch } from "vue"
import { GetOrderInfoByBatch, GetOrderInfoByIp, GetSmallFromByBatchEmployeeOneLine } from "../../../tools/api/qicApi"
import { IQICRecord, IQICOrderDByIP } from "../../../tools/interface/iQicData"
import { getTime } from "../../../tools/utils/sb_time"
import { messageError } from "../../../tools/element-plus/SBMessage"
import { useQirPinia } from "../../../store/qir"
// 自动加载hooks
function _autoLoaderHooks() {
  
  let _isAutoRecord = ref<number>(-1) // 是否有自动加载QIC的记录 -1:默认值，0:无自动加载记录 1:有自动加载记录
  let _isBatchRecord = ref<number>(-1) // 是否有按单加载QIC的记录 -1:默认值，0:无记录，1：有记录
  let qtyMap = ref<Map<string, string>>(new Map())
  const qicStore = useQirPinia()
  let _record = ref<IQICRecord>({
    uuid: '',
    batch: '',
    rbo: '',
    table_Name: '',
    params: '',
    state: '',
    employee: '',
    cN_Name: '',
    create_Time: '',
    _process: ''
  }) // 记录
  let _orderInfo = ref<IQICOrderDByIP>({
    batch: '',
    rbo: '',
    internalItem: '',
    otc: [],
    smallFromName: '',
    qty: ''
  }) // 订单信息

  // 重置
  const resetOrderInfo = ()=>{
    _orderInfo.value = {
      batch: '',
      rbo: '',
      internalItem: '',
      otc: [],
      smallFromName: '',
      qty: ''
    }
  }
  const resetRecord = ()=>{
    _record.value = {
      uuid: '',
      batch: '',
      rbo: '',
      table_Name: '',
      params: '',
      state: '',
      employee: '',
      cN_Name: '',
      create_Time: '',
      _process: ''
    }
  }

  // 根据IP获取订单信息
  // const _getOrderByIP = () => {
  //   GetOrderInfoByIp().then((res:any)=>{
  //     console.table(res)
  //   }).catch((err:any) => {
  //     console.log(err)
  //   })
  // }
  

  // 获取最近加载订单 -- 按单加载
  // const _getRecentlyRecord = (batch: string, employee: string) => {
  //   GetSmallFromByBatchEmployeeOneLine(batch, employee).then((res:any) => {
  //     resetRecord() // 重置
  //     _record.value = res // 赋值
  //     _isBatchRecord.value = 1 
  //     qicStore.isRecord = 1 // 记录 1：有记录
  //     console.table(_record.value)
  //   }).catch((err:any) => {
  //     if (err.isSuccess === false) {
  //       messageError(err.msg)
  //       qicStore.isRecord = 0 // 无记录 1：有记录
  //       _getOrderInfoByBatch(batch) // 获取订单信息
  //     }
  //     console.error(err)
  //   })
  // }

  // 根据单号获取单号信息
  // const _getOrderInfoByBatch = (ordernumber: string) => {
  //   GetOrderInfoByBatch(ordernumber).then((res:any) => {
  //     console.log(res)
  //     resetOrderInfo() // 重置
  //     _isBatchRecord.value = 0
  //     if (res.data.isSuccess === true) {
  //       _orderInfo.value = res.data.data // 订单信息
  //     } else {
  //       messageError('单号异常')
  //       console.log("订单信息异常")
  //       console.error(res.data.msg)
  //     }
  //   }).catch((err:any)=> {
  //     console.error(err)
  //   })
  // }

  // 按单加载，先查单号，再请求最近记录
  const _getBatchOrder = (ordernumber: string, employee: string, _process: string) => {
    GetOrderInfoByBatch(ordernumber).then((res:any) => {
      resetOrderInfo() // 重置
      // console.log(res)
      if (res.data.isSuccess) {
        _orderInfo.value = res.data.data // 订单信息
        // 处理qty
        mangeqty(_orderInfo.value.qty)
        // 处理 Thermal/default
        qicStore.isBatch = 1 // 有效效单号
        // console.table(_orderInfo.value)
        resetRecord() // 重置
        GetSmallFromByBatchEmployeeOneLine(ordernumber, employee, _process).then((res:any) => {
          _record.value.batch = ordernumber
          _record.value = res  // 记录信息
          _isBatchRecord.value = 1
          qicStore.isRecord = 1 // 0: 无记录 1：有记录
          console.table(_record.value)
        }).catch((err:any)=>{
          console.error(err)
          if (err.isSuccess === false) {
            messageError(err.msg)
            _isBatchRecord.value = 0 // 无记录
            qicStore.isRecord = 0 // 0: 无记录 1：有记录
          }
        })
      } else {
        console.error(res.data.msg)
        messageError('单号异常')
        qicStore.isBatch = 0 // 无效单号
      }
    }).catch((err:any)=> {
      console.error(err)
      qicStore.isBatch = -1 // 无效效单号
      qicStore.isRecord = -1 // 0: 无记录 1：有记录
    })
  }

  // 获取订单信息和最近一份订单 判断是否是 当天 当单 当工号 工序是IP信息的工序 自动加载
  const _getAutoOrder = (employee: string) => {
    _isAutoRecord.value = -1 // 重置
    // 1、根据IP获取订单信息
    GetOrderInfoByIp().then((res:any)=>{
      resetOrderInfo() // 重置
      _orderInfo.value = res // 订单信息
      // 处理qty
      mangeqty(_orderInfo.value.qty)
      qicStore.isBatch = 1 // 有效效单号
      // console.table(_orderInfo.value)
      // 2、获取最近一份订单
      return GetSmallFromByBatchEmployeeOneLine(res.batch, employee, qicStore.ipData.process_selection)
    }).then((res:any) => {
      resetRecord() // 重置
      _record.value = res  // 记录信息
      // console.table(_record.value)
      // 3、判断是否有记录，判断是否是已完成该工序，判断是否是当天
      if (_record.value.state === '1') { // 已完成工序
        _isAutoRecord.value = 0 // 加载订单信息
        qicStore.isRecord = 0 // 0: 无记录 1：有记录
      } else {
        _isAutoRecord.value = 1 // 自动加载记录
        qicStore.isRecord = 1 // 0: 无记录 1：有记录

        // 判断是否是当天
        if (_record.value.create_Time.split(' ')[0] !== getTime(0)) {
          console.log(_record.value.create_Time.split(' ')[0])
          console.log(getTime(0))
          console.error('昨天的订单没做完')
        }
      }
      // 3、判断是否是当天当单当工号
      // _isAutoRecord.value = 1 // 自动加载记录
      // if (_record.value.create_Time.split('')[0] === getTime(0)) { // 如果订单记录是当天，对于当单 和 当工号的，因为是用这两个获取，故不判断
      //   _isAutoRecord.value = 1 // 自动加载记录
      //   qicStore.isRecord = 1 // 0: 无记录 1：有记录
      // } else {
      //   _isAutoRecord.value = 0 // 加载订单信息
      //   qicStore.isRecord = 0 // 0: 无记录 1：有记录
      // }
    }).catch(()=>{
      _isAutoRecord.value = 0 // 加载订单信息
      console.error(new Error('获取自动加载订单异常'))
      qicStore.isBatch = 0 // 无效效单号
      qicStore.isRecord = -1 // 0: 无记录 1：有记录
    })

    // 使用同步化
    // async function _getAutoOrderOn(employee: string) {
    //   // 1、根据IP获取订单信息
    //   const res1:any = await GetOrderInfoByIp()
    //   _orderInfo.value = res1 // 订单信息
    //   // 2、获取最近一份订单
    //   const res2:any = await GetSmallFromByBatchEmployeeOneLine(res1.batch, employee)
    //   _record.value = res2  // 记录信息
    //   // 3、判断是否是当天当单当工号
    //   if (_record.value.create_Time.split('')[0] === getTime(0)) {
    //     // // 如果订单记录是当天，对于当单 和 当工号的，因为是用这两个获取，故不判断
    //     _isAutoRecord.value = true // 自动加载记录
    //   }
    //   _isAutoRecord.value = false // 加载订单信息
    // }
  }

  // 监听dj变化，设置dj 的 QTY
  watch(()=>qicStore.queryForm.DJ, (newVal, oldVal)=>{
    if (newVal !== oldVal && newVal !== '') {
      qicStore.queryForm.qty = qtyMap.value.get(newVal) || ''
    }
  })

  // 处理qty
  const mangeqty = (qty:string) => {
    // NPA8R0:11000-NP9RTL:1600-NPA69V:250500-
    let arr = qty?.split('-')
    arr?.pop()
    let it
    arr.forEach((v)=>{
      it = v.split(':')
      qtyMap.value.set(it[0], it[1])
    })
  }

  return {
    _isAutoRecord,_isBatchRecord, _orderInfo, _record, _getAutoOrder, _getBatchOrder
  }
}

export default _autoLoaderHooks