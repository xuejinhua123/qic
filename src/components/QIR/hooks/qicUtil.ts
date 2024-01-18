// QIC 的一些公共代码
// 2024-01-17

import { Ref } from "vue"
import { IQICOrderDByIP, IQICTableData } from "../../../tools/interface/iQicData"
import { getTime } from "../../../tools/utils/sb_time"

/**
 * NPA8R0:11000-NP9RTL:1600-NPA69V:250500-
 * qty 裁切
 * @param qty 
 * @returns Map
 */
export const mangeqty = (qty:string) => {
  // NPA8R0:11000-NP9RTL:1600-NPA69V:250500-
  const qtyMap:Map<string, string> = new Map()
  let arr = qty?.split('`')
  arr?.pop()
  let it
  arr.forEach((v)=>{
    it = v.split(':')
    qtyMap.set(it[0], it[1])
  })
  return qtyMap
}

/**
 * 处理表名
 * @param _orderInfo 订单信息
 * @param qicStore stroe
 * @param InditexValue 特殊表 图片
 * 2024-01-17
 */
export const tableNameHandle = (_orderInfo: IQICOrderDByIP, qicStore:any, InditexValue:string) =>{
  console.log('设置表名')
  if (_orderInfo.smallFromName.indexOf('Inditex') !==-1){
    const arr = _orderInfo.smallFromName.split("/")
    qicStore.tableName = 'Inditex'
    qicStore.tableName = arr[0]
    if (arr[1] === 'TexTrace') InditexValue = '1'
    else if (arr[1] === 'Overlock') InditexValue = '2'
    else if (arr[1] === 'Tempe') InditexValue = '3'
    else if (arr[1] === 'PFL') InditexValue = '4'
    else InditexValue = '0'

    console.log('InditexValue ==> ', InditexValue)
  }
  else if (_orderInfo.smallFromName.indexOf('Zebra') !== -1)
  {
    qicStore.tableName = 'Zebra'
  }
  else if (_orderInfo.smallFromName.indexOf('UQ') !== -1)
  {
    qicStore.tableName = 'UQ'
  }
  else if (_orderInfo.smallFromName.indexOf('Inkjet') !== -1)
  {
    qicStore.tableName = 'Inkjet'
  }
  else
  {
    qicStore.tableName = 'Thermal'
  }
  console.log('设置表名: ', _orderInfo.smallFromName, qicStore.tableName)
}

export const _resetContent = (_tableContent:Array<IQICTableData>) => {
  console.log('重置 单个表格内容')
  _tableContent?.forEach((item: any, index: number) => {
    item.isDisabled = false
    item.results = ''
    item.index = index
  })


    // 设置targe
    // if(qicStore.tableName.indexOf('Thermal') !== -1) { // target
    //   if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
    //     if (qicStore.queryForm.procedure === '印刷') {
    //       _tableContent.value![9].results = ''
    //       _tableContent.value![9].isDisabled = true
    //     }
    //   }
    // }
}

/**
 * 渲染表
 * 2024-01-17
 * @param record 
 * @param _tableContent 
 */
export const _renderingTable = (_tableContent:Array<IQICTableData>, InditexValue:Ref<string>, qicStore:any) => {
  console.log('渲染表')

  // (1) 裁切params
  let arr = qicStore.recordObj.params.split('-')
  arr.pop() // 去掉最后一个

  // (2) 特殊情况 Inditex Inditex
  if (qicStore.recordObj.table_Name === 'Inditex') {
    console.log('特殊项 ==> ', qicStore.recordObj.table_Name)
    InditexValue.value = arr[0].split(':')[1]
    arr.shift() // 删除第一个
  }

  // (3) 如果是领班登录
  let it:Array<string> = []
  if (qicStore.isForemanLogin) {
    console.log('领班登录')
    _tableContent?.forEach((item:IQICTableData, index: number)=>{
      it = arr[index].split(':')
      item.isDisabled = false
      if (it[1] === '0') item.results = ''
      else item.results = it[1]
    })
  }
  else { // (4) 修改OK-不是领班登录
    if (qicStore.recordObj.state === '1') { // 如果是已完成
      console.log('已完成')
      _tableContent?.forEach((item:IQICTableData, index: number)=>{
        it = arr[index].split(':')
        item.isDisabled = true
        if (it[1] === '0') item.results = ''
        else item.results = it[1]
      })
    }
    else { // 如果是未完成
      console.log('未完成')
      _tableContent?.forEach((item:IQICTableData, index: number)=>{
        // console.log(arr[0])
        // console.log(item)
        it = arr[index].split(':')
        item.isDisabled = true
        if (it[1] === '0') item.results = ''
        else item.results = it[1]
      })
    }
  }

  // (5) 如果是当天
  if (qicStore.queryForm._date === getTime(0)) {
    console.log('渲染 当天')
    _tableContent?.forEach((item:IQICTableData)=>{
      item.isDisabled = false
    })
  }

  // (6) targe
  if(qicStore.tableName === 'Thermal') { // target
    if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
      console.log('渲染 不是TARG')
      _tableContent![9].results = ''
      _tableContent![9].isDisabled = true
    }
  }
  // console.table(_tableContent)
}