import { Ref } from "vue"
import { useQirPinia } from "../../../store/qir"
import { messageError } from "../../../tools/element-plus/SBMessage"
import { IQICOrderDByIP, IQICRecord } from "../../../tools/interface/iQicData"
import { GetOrderInfoByIp } from "../../../tools/api/qicApi"
function _autoLoaderHooks(isShowRecordView:Ref<boolean>, _orderInfo:Ref<IQICOrderDByIP>, _record:Ref<IQICRecord>) {
  const qicStore = useQirPinia()

  /**
   * 请求判断
   * @returns 
   */
  const _autoFrontJudge_ = ()=> {
    // 1、请求判断
    if (qicStore.queryForm._name === '' || qicStore.queryForm.jobNumber.toString().length !== 7) {
      messageError('请输入工号')
      return true
    }
    if (!qicStore.isIP) {
      messageError('IP信息不存在, 请联系领班添加')
      return true
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
    return false
  }

  /**
   * 初始化 自动加载的一些参数
   */
  const _autoInit_ = ()=> {
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
  }

  const _getOrderByIP_ = async ()=> {
    const res = await GetOrderInfoByIp()
    console.log(res)
  }


  const _clickAuto = ()=> {
    console.log('hooks 自动加载')
    // 1、请求判断
    if(_autoFrontJudge_())return
    // 2、初始化一些参数
    _autoInit_()
    // 3、根据IP获取订单信息
    _getOrderByIP_()
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

  return {
    _clickAuto
  }
}

export default _autoLoaderHooks