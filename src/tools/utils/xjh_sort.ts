// import { IQICSearchData } from "../../utils/interface/Iqic"

import { IQICRecord } from "../interface/iQicData"

// 对象数组排序 字符串
export const _sort_str = (arr: any, key: string) => {
  function _sort (a:any, b:any) {
    if (a[key] < b[key]) return -1
    if (a[key] > b[key]) return 1
    return 0
  }
  return arr.sort(_sort)
}

// 对记录排序
// 根据'印刷', '剪纸', 'QC', '贴标', '包装'
export const _sortQicRecord = (data:Array<IQICRecord>):Array<IQICRecord> =>{
  let arr:Array<IQICRecord> = []
  let yinshua:Array<IQICRecord> = []
  let jianzhi:Array<IQICRecord> = []
  let QC:Array<IQICRecord> = []
  let tiebiao:Array<IQICRecord> = []
  let baozhuang:Array<IQICRecord> = []
  let chuhuo:Array<IQICRecord> = []

  data.forEach((v:IQICRecord) =>{
    if (v._process === '印刷') yinshua.push(v)
    else if (v._process === '剪纸') jianzhi.push(v)
    else if (v._process === 'QC') QC.push(v)
    else if (v._process === '贴标') tiebiao.push(v)
    else if (v._process === '包装') baozhuang.push(v)
    else if (v._process === '出货') chuhuo.push(v)
  })

  arr.push(...yinshua, ...jianzhi, ...QC, ...tiebiao, ...baozhuang, ...chuhuo)

  return arr
}