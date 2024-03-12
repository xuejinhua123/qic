// 点击搜索出来的每一项记录

import { Ref, watch } from "vue"
import { useQirPinia } from '../../../store/qir'
import { IQICOrderDByIP, IQICRecord, IQICTableData } from "../../../tools/interface/iQicData"
import { GetOrderInfoByBatch2 } from "../../../tools/api/qicApi"
import { _renderingTable, mangeqty } from "./qicUtil"

// 2024-01-17
function _useItemRecordHooks(isShowQIR:Ref<boolean>, _record:Ref<IQICRecord>, tbUuid:Ref<string>, _orderInfo:Ref<IQICOrderDByIP>, InditexValue:Ref<string>, _tableContent:Ref<Array<IQICTableData>>){
  const qicStore = useQirPinia()

  // 初始化
  const _init_ = (record:IQICRecord) => {

    // 赋值
    isShowQIR.value = true // 隐藏列表

    qicStore.tableName = record.table_Name // 设置表名，监听 更新表内容 这里要测试渲染表内容是否更新了,目前测更新了(渲染表方法里面)
    qicStore.recordObj = record // 保存记录刀pinia中

    // 搜索框
    qicStore.queryForm.batch = _record.value.batch
    qicStore.queryForm.jobNumber = +record.employee
    qicStore.queryForm._name = record.cN_Name
    qicStore.queryForm._date = record.create_Time.split(' ')[0]
    qicStore.queryForm.procedure = record._process

    // uuid
    tbUuid.value = record.uuid

    // console.table(_tableContent.value)

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

  // 处理订单信息(搜索)
  const handleOrderBySearch = (res:any, batch:string)=>{
    // (1)、赋值订单信息
    _orderInfo.value = res // 订单信息
    // 小bug
    _orderInfo.value.batch = batch

    //
    qicStore.isBatch = 1
    qicStore.isRecord = 1

    // (2) 处理qty
    qicStore.qtyMap = mangeqty(_orderInfo.value.qty)

    // (3) 赋值pinia
    qicStore.queryForm.batch = batch // 2024-01-24 解决 搜索记录点击记录 修改OK 没有batch的提升信息
    qicStore.queryForm.DJ = _orderInfo.value.otc[0]
    qicStore.queryForm.rbo = _orderInfo.value.rbo
    qicStore.queryForm.internalItem = _orderInfo.value.internalItem
    qicStore.DJArr = _orderInfo.value.otc

    // 订单信息
    qicStore.orderInfo = res
    qicStore.orderInfo.batch = batch

    // (5) 渲染表
    _renderingTable(_tableContent.value, InditexValue, qicStore)

  }

  const _clickItemRecord = (record:IQICRecord) => {
    console.log('hooks 点击每一项记录')
    // console.table(record)
    // 1、设置一些
    _init_(record)

    // 2、根据单号获取一些客户信息
    _getOrderByBatch(record.batch)

  }
  // 监听dj变化，设置DJ 的 QTY 点击每一项记录 先用着，自动加载 按单加载没用pinia的qtyMap
  watch(()=>qicStore.queryForm.DJ, (newVal, oldVal)=>{
    console.log('**************item record (hooks)**************')
    console.log(newVal, oldVal, qicStore.qtyMap.get(newVal))
    if (newVal !== oldVal && newVal !== '') {
      qicStore.queryForm.qty = qicStore.qtyMap.get(newVal) || ''
    }
  })
  return {
    _clickItemRecord
  }
}
export default _useItemRecordHooks