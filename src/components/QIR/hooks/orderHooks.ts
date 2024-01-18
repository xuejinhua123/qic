import { Ref, ref, watch } from 'vue'
import { useQirPinia } from '../../../store/qir'
import { GetOrderInfoByBatch2, GetOrderInfoByIp, GetSmallFromByBatchEmployeeOneLine, SelectFromForBatch2 } from '../../../tools/api/qicApi'
import { IQICOrderDByIP, IQICRecord } from '../../../tools/interface/iQicData'
import { getTime } from '../../../tools/utils/sb_time'
import { messageError, messageWarning, messageSuccess } from '../../../tools/element-plus/SBMessage'
import { _sortQicRecord } from '../../../tools/utils/xjh_sort'
// import { messageSuccess } from '../../../utils/element-plus/SBMessage'


/** 自动加载 按单加载 搜索记录
 * 
 * @returns 
 */
function _useOrderHooks (tableName:Ref<string>, InditexValue:Ref<string>, isShowRecordView:Ref<boolean>,_orderInfo:Ref<IQICOrderDByIP>, _record:Ref<IQICRecord>) {
  const qicStore = useQirPinia()
  // 搜索记录
  const _searchRecordList = ref<Array<IQICRecord>>([])
  const _filterSearchRecordList = ref<Array<IQICRecord>>([])

  // qty
  let qtyMap = ref<Map<string, string>>(new Map())

  /**自动加载
   * 
   * 1、请求判断
   * 2、重置一些参数
   * 3、根据IP请求、获取最近一份记录
   * @returns 
   */
  const _autoLoader = ()=>{
    // 1、请求判断
    if (qicStore.queryForm._name === '' || qicStore.queryForm.jobNumber.toString().length !== 7) {
      messageError('请输入工号')
      return
    }
    if (!qicStore.isIP) {
      messageError('IP信息不存在, 请联系领班添加')
      return
    }
    if (qicStore.ipData.process_selection === '') { // 可能有点问题
      // messageError('该IP信息的机台没有设置工序，请手动设置工序')
      // return
      console.error('该IP信息的机台没有设置工序，请手动设置工序')
      qicStore.ipData.process_selection = qicStore.queryForm.procedure
    }
    if (qicStore.ipData.process_selection === '') {
      qicStore.ipData.process_selection = '印刷'
      qicStore.queryForm.procedure = '印刷'
    }

    // 2、初始化一些参数
    resetOrderInfo()
    resetRecordInfo()
    // 初始化pinia
    qicStore.queryForm.batch = ''
    qicStore.queryForm.DJ = ''
    qicStore.queryForm.rbo = ''
    qicStore.queryForm.internalItem = ''
    qicStore.queryForm.qty = ''
    // 清空展示区
    qicStore.isShowView = 0
    qicStore.isBatch = -1
    qicStore.isCurrentDayRecord = -1
    qicStore.isRecord = -1
    isShowRecordView.value = true
    
    // 3、根据IP获取订单 + 获取最近一份订单
    getOrderByIp(getRecentlyRecordByIP)
  }

  /** 按单加载
   * 1、请求判断
   * 2、重置一些参数
   * 3、根据batch请求、获取最近一份记录
   * @param batch 单号
   * @returns 
   */
  const _batchLoader = (batch:string)=>{
    // 1、请求判断
    if (batch.length !== 11) { // 与自动加载的区别
      messageError('请输入正确的batch( 11位 )')
      return
    }
    if (qicStore.queryForm._name === '' || qicStore.queryForm.jobNumber.toString().length !== 7) {
      messageError('请输入工号')
      return
    }
    if (!qicStore.isIP) {
      messageError('IP信息不存在, 请联系领班添加')
      return
    }
    if (qicStore.queryForm.procedure === '') {
      qicStore.queryForm.procedure = '印刷'
    }

    // 2、初始化一些参数
    resetOrderInfo()
    resetRecordInfo()
    // 初始化pinia
    // qicStore.queryForm.batch = '' // 有效单号才赋值 与自动加载的区别
    qicStore.queryForm.DJ = ''
    qicStore.queryForm.rbo = ''
    qicStore.queryForm.internalItem = ''
    qicStore.queryForm.qty = ''
    // 清空展示区
    qicStore.isShowView = 0
    qicStore.isBatch = -1
    qicStore.isCurrentDayRecord = -1
    qicStore.isRecord = -1
    isShowRecordView.value = true

    // 3、根据batch获取订单 + 获取最近一份订单 与自动加载的区别
    getOrderByBatch(getRecentlyRecordByBatch, batch)
  }

  /** 搜索记录
   * 1、请求判断
   * 2、重置
   * 3、根据batch请求记录
   * @param batch 
   * @returns 
   */
  const _searchRecord = (batch:string)=>{
    // 1、请求判断
    if(batch === '') {
      messageError('请输入batch')
      return
    }
    if (batch.length !== 11) {
      messageError('batch格式错误( 11位 )')
      return
    }

    // 2、重置
    // 清空展示区
    qicStore.isShowView = 0
    qicStore.isBatch = -1
    qicStore.isCurrentDayRecord = -1
    qicStore.isRecord = -1
    isShowRecordView.value = true
    

    // 重置搜索框
    qicStore.queryForm.rbo = ''
    qicStore.queryForm.internalItem = ''
    qicStore.queryForm._date = ''
    qicStore.queryForm.DJ = ''

    // 3、请求
    getRecordList(batch)
  }

  /** 根据单号获取订单信息
   *  用途：点击搜索记录的每一项，获取一些订单参数
   * @param batch 
   */
  const _getOrderByBatch = (batch:string) =>{
    GetOrderInfoByBatch2(batch).then((res:any)=>{
      // console.log(res)
      // (1) 处理订单信息
      handleOrderBySearch(res, batch)
    }).catch((err:any)=>{
      console.error(err)
      qicStore.isBatch = 0 // 无效单号
    })
  }

  /** 根据IP获取订单信息
   * 
   * @param getRecord_  获取最近一份订单 函数
   */
  const getOrderByIp = (getRecord_: Function)=>{
    GetOrderInfoByIp().then((res:any)=>{
      // console.log(res)
      // (1) 处理订单信息
      handleOrderByIp(res)

      // (2) 获取最近一份历史记录 待写：工号 和 工序 记得放在外面，IP信息没有默认设置 印刷 工序是IP信息的工序
      getRecord_(res.batch, qicStore.queryForm.jobNumber.toString(), qicStore.ipData.process_selection)
    }).catch((err:any)=>{
      console.error(err)
      messageError('订单异常,请联系领班')
      qicStore.isBatch = 0 // 无效单号
    })
  }

  /** 根据batch获取订单信息
   * 
   * @param getRecord_ 获取最近一份订单 函数
   * @param batch 单号
   */
  const getOrderByBatch = (getRecord_:Function, batch:string) =>{
    GetOrderInfoByBatch2(batch).then((res:any)=>{
      // console.log(res)
      // (1) 处理订单信息
      handleOrderByBatch(res, batch)
      // (2) 获取最近一份历史记录 待写：工号 和 工序 记得放在外面， 工序没有记得默认设置 印刷  与自动加载的区别
      getRecord_(batch, qicStore.queryForm.jobNumber.toString(), qicStore.queryForm.procedure)
    }).catch((err:any)=>{
      console.error(err)
      messageError('订单异常,请联系领班')
      qicStore.isBatch = 0 // 无效单号
    })
  }

  /** 获取最近一份记录 IP
   * 
   * @param batch 单号
   * @param employee 工号
   * @param _process 工序
   */
  const getRecentlyRecordByIP = (batch: string, employee: string, _process: string)=>{
    GetSmallFromByBatchEmployeeOneLine(batch, employee, _process).then((res:any)=>{
      // console.log(res)
      // 处理记录
      handleRecentlyRecordByIP(res)
    }).catch((err:any)=>{
      console.error(err)
      messageWarning(err.msg)
      qicStore.isRecord = 0 // 0: 无记录 1：有记录
      console.log('(自动加载 没有记录 )是当天的记录未完成')
      qicStore.isCurrentDayRecord = 2
    })
  }

  /** 获取最近一份记录 batch
   * 
   * @param batch 单号
   * @param employee 工号
   * @param _process 工序
   */
  const getRecentlyRecordByBatch = (batch: string, employee: string, _process: string)=>{
    GetSmallFromByBatchEmployeeOneLine(batch, employee, _process).then((res:any)=>{
      // console.log(res)
      // 处理记录
      handleRecentlyRecordByBatch(res)
    }).catch((err:any)=>{
      console.error(err)
      messageWarning(err.msg)
      qicStore.isRecord = 0 // 0: 无记录 1：有记录
      console.log('(按单加载 没有记录 )是当天的记录未完成')
      qicStore.isCurrentDayRecord = 2
    })
  }

  /** 搜索记录
   * 
   * @param batch 单号
   */
  const getRecordList = (batch:string)=>{
    SelectFromForBatch2(batch).then((res:any)=>{
      // console.log(res)
      isShowRecordView.value = false
      handleSerachRecord(res)
    }).catch((err:any)=>{
      console.error(err)
      messageError(err.msg)
      isShowRecordView.value = true
      _searchRecordList.value = []
    })
  }

  // 处理订单信息(IP)
  const handleOrderByIp = (res:any)=>{
    // (1)、赋值订单信息
    _orderInfo.value = res // 订单信息
    // (2) 处理qty
    mangeqty(_orderInfo.value.qty)
    // (3) 处理表名
    tableNameHandle()
    // (4) 设置
    qicStore.isBatch = 1 // 有效单号

    // (5) 赋值pinia
    qicStore.queryForm.batch = _orderInfo.value.batch
    qicStore.queryForm.DJ = _orderInfo.value.otc[0]
    qicStore.queryForm.rbo = _orderInfo.value.rbo
    qicStore.queryForm.internalItem = _orderInfo.value.internalItem
    qicStore.queryForm._date = getTime(0)

    // qty 先不设置, 因为qty的变化涉及到定时器
    // qty的设置是在监听器dj的变化才设置

    console.table(_orderInfo.value)
    console.table(qicStore.queryForm)
  }

  // 处理订单信息(batch)
  const handleOrderByBatch = (res:any, batch:string)=> {
    // (1)、赋值订单信息
    _orderInfo.value = res // 订单信息
    // 小bug
    _orderInfo.value.batch = batch
    // (2) 处理qty
    mangeqty(_orderInfo.value.qty)
    // (3) 处理表名
    tableNameHandle()
    // (4) 设置
    qicStore.isBatch = 1 // 有效单号

    // (5) 赋值pinia
    qicStore.queryForm.batch = batch // 与自动加载的区别
    qicStore.queryForm.DJ = _orderInfo.value.otc[0]
    qicStore.queryForm.rbo = _orderInfo.value.rbo
    qicStore.queryForm.internalItem = _orderInfo.value.internalItem
    qicStore.queryForm._date = getTime(0)

    // qty 先不设置, 因为qty的变化涉及到定时器
    // qty的设置是在监听器dj的变化才设置

    console.table(_orderInfo.value)
    console.table(qicStore.queryForm)
  }

  // 处理订单信息(搜索)
  const handleOrderBySearch = (res:any, batch:string)=>{
    // (1)、赋值订单信息
    _orderInfo.value = res // 订单信息
    // 小bug
    _orderInfo.value.batch = batch
    // (2) 处理qty
    mangeqty(_orderInfo.value.qty)
    // (3) 处理表名
    tableNameHandle()
    // (4) 设置
    // qicStore.isBatch = 1 // 有效单号
    // qicStore.isRecord = 1

    // (5) 赋值pinia
    qicStore.queryForm.batch = batch // 与自动加载的区别
    qicStore.queryForm.DJ = _orderInfo.value.otc[0]
    qicStore.queryForm.rbo = _orderInfo.value.rbo
    qicStore.queryForm.internalItem = _orderInfo.value.internalItem
    // qicStore.queryForm._date = getTime(0)

    // qty 先不设置, 因为qty的变化涉及到定时器
    // qty的设置是在监听器dj的变化才设置

    // console.table(_orderInfo.value)
    // console.table(qicStore.queryForm)
  }
  
  // 处理最近一份记录(IP)
  const handleRecentlyRecordByIP = (res:any) =>{
    // (1) 赋值
    _record.value = res
    qicStore.recordObj = res
    qicStore.isRecord = 1 // 监听这个，根据isCurrentDayRecord判断有问题，故在写一个监听器(isCurrentDayRecord)

    // (2) 判断
    const day = _record.value.create_Time.split(' ')[0]
    const currentDay = getTime(0)
    console.log("*******  记录IP ************")
    console.table(_record.value)
    console.table(_orderInfo.value)
    console.table(qicStore.queryForm)
    if (_record.value.state === '1') { // 如果是已完成

      // 一单做几天的情况
      if (+qicStore.queryForm.qty > 0 && day !== currentDay){
        console.log("(自动加载) 大单 做几天, 新的一天, 开启填记录权限")
        qicStore.isCurrentDayRecord = 4 // 大单, 多天记录
        messageSuccess('请 加油')
      }

      else
      {
        messageSuccess('该batch的记录已完成, 如果想查看, 请搜索记录')
        if (day === currentDay) { // 如果是当天
          console.log('(自动加载)当天的记录已完成')
          qicStore.isCurrentDayRecord = 0
        } else {
          console.log('(自动加载)不是当天的记录已完成')
          qicStore.isCurrentDayRecord = 1
        }
      }
    } else { // 如果是未完成
      if (day === currentDay) { // 如果是当天
        console.log('(自动加载)是当天的记录未完成')
        qicStore.isCurrentDayRecord = 2
      } else {
        console.log('(自动加载)不是当天的记录未完成')
        messageError('上次的记录没做完, 请联系领班修改')
        qicStore.isCurrentDayRecord = 3
      }
    }
    // if (_record.value.state === '1') { // 已完成工序
    //   qicStore.isRecord = 1 // 0: 无记录 1：有记录
    //   qicStore.isCurrentDayRecord = 2 // 是否是当天记录 默认: -1 ,0: 不是当天，1：是当天，2：当天的已完成
    //   messageSuccess('该batch的记录已完成, 如果想查看, 请搜索记录')
    // } else {
    //   qicStore.isRecord = 1
    //   // 判断是否是当天
    //   if (_record.value.create_Time.split(' ')[0] !== getTime(0)) {
    //     console.log(_record.value.create_Time.split(' ')[0])
    //     console.log(getTime(0))
    //     console.error('昨天的订单没做完')
    //     messageError('上次质量检测表没有填完,请联系领班操作')
    //     qicStore.isCurrentDayRecord = 0
    //   } else {
    //     qicStore.isCurrentDayRecord = 1 // 当天的历史记录
    //   }
    // }

    // (3) 设置日期 2024-01-08
    if (qicStore.isCurrentDayRecord !== 4){
      qicStore.queryForm._date = _record.value.create_Time.split(' ')[0]
      // 设置工序
      qicStore.queryForm.procedure = _record.value._process
    }

    console.log('自动加载历史记录')
    console.table(_record.value)
    console.table(qicStore.queryForm)
  }

  // 处理最近一份记录(batch)
  const handleRecentlyRecordByBatch = (res:any) =>{
    // (1) 赋值
    _record.value = res
    qicStore.recordObj = res
    qicStore.isRecord = 1

    // (2) 判断
    const day = _record.value.create_Time.split(' ')[0]
    const currentDay = getTime(0)
    console.log("*******  记录按单加载 ************")
    console.table(_record.value)
    console.table(_orderInfo.value)
    console.table(qicStore.queryForm)
    if (_record.value.state === '1') { // 如果是已完成

      // 一单做几天的情况
      if (+qicStore.queryForm.qty > 0 && day !== currentDay){
        console.log("(按单加载) 大单 做几天, 新的一天, 开启填记录权限")
        qicStore.isCurrentDayRecord = 4 // 大单, 多天记录
        messageSuccess('请 加油')
      }

      else
      {
        messageSuccess('该batch的记录已完成')
        if (day === currentDay) { // 如果是当天
          console.log('(按单加载)当天的记录已完成')
          qicStore.isCurrentDayRecord = 0
        } else {
          console.log('(按单加载)不是当天的记录已完成')
          qicStore.isCurrentDayRecord = 1
        }
      }
    } else { // 如果是未完成
      if (day === currentDay) { // 如果是当天
        console.log('(按单加载)是当天的记录未完成')
        qicStore.isCurrentDayRecord = 2
      } else {
        console.log('(按单加载)不是当天的记录未完成')
        messageError('上次的记录没做完, 请联系领班修改')
        qicStore.isCurrentDayRecord = 3
      }
    }
    // if (_record.value.state === '1') { // 已完成工序
    //   qicStore.isRecord = 1 // 0: 无记录 1：有记录
      
    // } else {
    //   qicStore.isRecord = 1
    //   // 判断是否是当天
    //   if (_record.value.create_Time.split(' ')[0] !== getTime(0)) {
    //     console.log(_record.value.create_Time.split(' ')[0])
    //     console.log(getTime(0))
    //     console.error('昨天的订单没做完')
    //     messageError('上次的记录没做完, 请联系领班修改')
    //     qicStore.isCurrentDayRecord = 0
    //   } else {
    //     qicStore.isCurrentDayRecord = 1 // 当天的历史记录
    //   }
    // }

    // if (_record.value.create_Time.split(' ')[0] !== getTime(0)) { // 判断是否是当天的记录
    //   qicStore.isCurrentDayRecord = 0
    // } else {
    //   qicStore.isCurrentDayRecord = 1 // 当天的历史记录
    // }

    // (3) 设置日期 rbo item 工号 姓名 工序
    if (qicStore.isCurrentDayRecord !== 4){
      qicStore.queryForm._date = _record.value.create_Time.split(' ')[0]
    }
    // qicStore.queryForm.rbo = _record.value.rbo
    // qicStore.queryForm.internalItem = _record.value.internalItem
    // qicStore.queryForm.jobNumber = +_record.value.employee
    // qicStore.queryForm._name = _record.value.cN_Name
    // qicStore.queryForm.procedure = _record.value._process

    console.log('按单加载历史记录')
    console.table(_record.value)
    console.table(qicStore.queryForm)
    console.table(qicStore.recordObj)
  }

  // 处理搜索记录
  const handleSerachRecord = (res:any)=>{
    // 1、赋值
    _searchRecordList.value = res

    // 3、排序
    _searchRecordList.value = _sortQicRecord(_searchRecordList.value)
    const employee = qicStore.queryForm.jobNumber.toString()
    if (employee.length !== 7) _filterSearchRecordList.value = _searchRecordList.value
    else _filterSearchRecordList.value = _searchRecordList.value.filter(v => v.employee === employee)
    // console.table(_filterSearchRecordList.value)
  }

  // 处理qty
  const mangeqty = (qty:string) => {
    // NPA8R0:11000-NP9RTL:1600-NPA69V:250500-
    let arr = qty?.split('`')
    arr?.pop()
    let it
    arr.forEach((v)=>{
      it = v.split(':')
      qtyMap.value.set(it[0], it[1])
    })
  }

  // 处理表名
  const tableNameHandle = () =>{
    console.log('设置表名')
    // 基本表
    // if (_orderInfo.value.smallFromName.indexOf('Thermal/default') !==-1 || _orderInfo.value.smallFromName.indexOf('default') !==-1) {
    //   _orderInfo.value.smallFromName = 'Thermal'
    //   qicStore.tableName = 'Thermal'
    // }
    if (_orderInfo.value.smallFromName.indexOf('Inditex') !==-1){
      const arr = _orderInfo.value.smallFromName.split("/")
      qicStore.tableName = 'Inditex'
      tableName.value = arr[0]
      if (arr[1] === 'TexTrace') InditexValue.value = '1'
      else if (arr[1] === 'Overlock') InditexValue.value = '2'
      else if (arr[1] === 'Tempe') InditexValue.value = '3'
      else if (arr[1] === 'PFL') InditexValue.value = '4'
      else InditexValue.value = '0'

      console.log('InditexValue ==> ', InditexValue.value)
    }
    else if (_orderInfo.value.smallFromName.indexOf('Zebra') !== -1)
    {
      qicStore.tableName = 'Zebra'
    }
    else if (_orderInfo.value.smallFromName.indexOf('UQ') !== -1)
    {
      qicStore.tableName = 'UQ'
    }
    else if (_orderInfo.value.smallFromName.indexOf('Inkjet') !== -1)
    {
      qicStore.tableName = 'Inkjet'
    }
    else
    {
      qicStore.tableName = 'Thermal'
    }
    console.log('设置表名: ', _orderInfo.value.smallFromName, qicStore.tableName)
  }

  // 重置订单信息
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

  // 重置记录信息
  const resetRecordInfo = ()=>{
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
    qicStore.resetRecord()
  }

  // 监听dj变化，设置DJ 的 QTY
  watch(()=>qicStore.queryForm.DJ, (newVal, oldVal)=>{
    console.log('**************监听 DJ (order hooks)**************')
    console.log(newVal, oldVal, qtyMap.value.get(newVal))
    if (newVal !== oldVal && newVal !== '') {
      qicStore.queryForm.qty = qtyMap.value.get(newVal) || ''
    }
  })

  // 监听工号变化
  watch(()=>qicStore.queryForm.jobNumber, (newVal, oldVal)=>{
    if (newVal !== oldVal) {
      const em = newVal.toString()
      console.log(isShowRecordView.value)
      if (em.length === 7) {
        if (!isShowRecordView.value) {
          _filterSearchRecordList.value = _searchRecordList.value.filter(v=>v.employee === em)
        }
      } else {
        _filterSearchRecordList.value = _searchRecordList.value
      }
    }
  })

  return {
    _filterSearchRecordList, _autoLoader, _batchLoader, _searchRecord, _getOrderByBatch, resetRecordInfo
  }
}
export default _useOrderHooks