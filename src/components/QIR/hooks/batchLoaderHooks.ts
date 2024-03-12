import { Ref, ref } from "vue"
import { useQirPinia } from "../../../store/qir"
import { IQICOrderDByIP, IQICRecord } from "../../../tools/interface/iQicData"
import { messageError } from "../../../tools/element-plus/SBMessage"
import { GetOrderInfoByBatch } from "../../../tools/api/qicApi"
import { getTime } from "../../../tools/utils/sb_time"
// 待完善 待测试 2024-01-15
function _batchLoaderHooks (isShowRecordView:Ref<boolean>, InditexValue:Ref<string>, tableName:Ref<string>, _orderInfo:Ref<IQICOrderDByIP>, _record:Ref<IQICRecord>, batch:Ref<string>) {
  const qicStore = useQirPinia()
  let qtyMap = ref<Map<string, string>>(new Map())

  /**
   * 请求判断
   * @returns 
   */
  const _batchFrontJudge_ = ()=> {
    // 1、请求判断
    if (batch.value.length !== 11) { // 与自动加载的区别
      messageError('请输入正确的batch( 11位 )')
      return true
    }
    if (qicStore.queryForm._name === '' || qicStore.queryForm.jobNumber.toString().length !== 7) {
      messageError('请输入工号')
      return true
    }
    if (!qicStore.isIP) {
      messageError('IP信息不存在, 请联系领班添加')
      return true
    }
    if (qicStore.queryForm.procedure === '') {
      qicStore.queryForm.procedure = '印刷'
    }
    return false
  }

  /**
   * 按单加载的一些参数重置
   */
  const _batchInit =()=> {
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
  }

  /**
   * 根据按单获取订单信息
   * @returns 
   */
  const _getOrderByBatch_ = async () => {
    const res:any = await GetOrderInfoByBatch(batch.value)
    console.log(res)
    if (res.data.isSuccess === false)
    {
      console.error(res.data)
      messageError('订单异常,请联系领班')
      qicStore.isBatch = 0 // 无效单号
      return
    }
    

    // // (1)、赋值订单信息
    _orderInfo.value = res // 订单信息
    // 小bug
    _orderInfo.value.batch = batch.value
    // (2) 处理qty
    mangeqty(_orderInfo.value.qty)
    // (3) 处理表名
    tableNameHandle()
    // (4) 设置
    qicStore.isBatch = 1 // 有效单号

    // (5) 赋值pinia
    qicStore.queryForm.batch = batch.value // 与自动加载的区别
    qicStore.queryForm.DJ = _orderInfo.value.otc[0]
    qicStore.queryForm.rbo = _orderInfo.value.rbo
    qicStore.queryForm.internalItem = _orderInfo.value.internalItem
    qicStore.queryForm._date = getTime(0)

    // qty 先不设置, 因为qty的变化涉及到定时器
    // qty的设置是在监听器dj的变化才设置

    console.table(_orderInfo.value)
    console.table(qicStore.queryForm)
  }

  /**
   * 主函数 点击事件 点击按单加载按钮
   * @returns 
   */
  const _clickBatchLoader = ()=> {
    console.log('按单加载 hooks')
    // 1、请求判断
    if(_batchFrontJudge_())return

    // 2、一些参数重置
    _batchInit()

    // 3、根据单号获取订单信息
    _getOrderByBatch_()

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
    if (_orderInfo.value.smallFromName.indexOf('Thermal/default') !==-1 || _orderInfo.value.smallFromName.indexOf('default') !==-1) {
      _orderInfo.value.smallFromName = 'Thermal'
    }
    // Inditex/TexTrace
    else if (_orderInfo.value.smallFromName.indexOf('Inditex/TexTrace') !==-1){
      const arr = _orderInfo.value.smallFromName.split("/")
      _orderInfo.value.smallFromName = arr[0]
      tableName.value = arr[0]
      if (arr[1] === 'TexTrace') InditexValue.value = '1'
      else if (arr[1] === 'Overlock') InditexValue.value = '2'
      else if (arr[1] === 'Tempe') InditexValue.value = '3'
      else if (arr[1] === 'PFL') InditexValue.value = '4'
      else InditexValue.value = '0'

      console.log('InditexValue ==> ', InditexValue.value)
    }
  }


  // 重置订单信息
  const resetOrderInfo = ()=>{
    _orderInfo.value = {
      batch: '',
      rbo: '',
      typesettingMethod: '',
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

  return {
    _clickBatchLoader
  }
}

export default _batchLoaderHooks