import { Ref } from "vue";
import { IQICRecord, IQICTableData } from "../../../tools/interface/iQicData"
import { useQirPinia } from '../../../store/qir'
import { getTime } from "../../../tools/utils/sb_time";

/** 渲染表
 * 2024-01-08
 * @param _tableContent 
 * @param _filterTableContent 
 */
function _userenderingTableHooks(_tableContent:Ref<Array<IQICTableData>>, _filterTableContent:Ref<Array<IQICTableData>>, tableName:Ref<string>, InditexValue:Ref<string>){

  const qicStore = useQirPinia()

  // 过滤表 工序

  /** 重置整个表
   * 2024-01-08
   */
  const _resetTableContent_ = () => {
    _tableContent.value.forEach((item, index)=>{
      item.isDisabled = false
      item.results = ''
      item.index = index
    })
  }

  /** 重置工序表，这个，首先得先重置整个表，index要赋值 暂时用不上
   * 2024-01-08
   */
  // const _resetProcedureTable_ =()=> {
  //   _filterTableContent.value.forEach((item)=>{
  //     item.isDisabled = false
  //     item.results = ''
  //   })
  // }

  /** 特殊情况 Inditex
   *  2024-01-08
   * @param table_Name 
   * @param arr 
   */
  const _Inditex_ = (table_Name:string, arr:Array<string>)=> {
    if (table_Name === 'Inditex') {
      console.log('特殊项 表名 ==> ', table_Name)
      InditexValue.value = arr[0].split(':')[1]
      arr.shift() // 删除第一个
    }
  }

  /** 领班登录 解禁
   * 2024-01-08
   * @param arr 
   * @param it 
   */
  const _foreManLogin_ = (arr:Array<string>, it:Array<string>) => {
    _tableContent.value?.forEach((item:IQICTableData, index: number)=>{
      it = arr[index].split(':')
      item.isDisabled = false
      if (it[1] === '0') item.results = ''
      else item.results = it[1]
    })
  }

  /** 已完成 禁用
   * 2024-01-08
   * @param arr 
   * @param it 
   */
  const _complete_ = (arr:Array<string>, it:Array<string>) => {
    _tableContent.value?.forEach((item:IQICTableData, index: number)=>{
      it = arr[index].split(':')
      item.isDisabled = true
      if (it[1] === '0') item.results = ''
      else item.results = it[1]
    })
  }

  /** 未完成 禁用
   * 2024-01-08
   * @param arr 
   * @param it 
   */
  const _notComplete_ = (arr:Array<string>, it:Array<string>) => {
    _tableContent.value?.forEach((item:IQICTableData, index: number)=>{
      it = arr[index].split(':')
      item.isDisabled = true
      if (it[1] === '0') item.results = ''
      else item.results = it[1]
    })
  }

  /** 当天记录 解禁
   * 2024-01-08
   */
  const _currentRecord_ = ()=> {
    _tableContent.value?.forEach((item:IQICTableData)=>{
      item.isDisabled = false
    })
  }

  /** tage 禁用
   * 2024-01-08
   */
  const _tage_ = ()=> {
    if(tableName.value === 'Thermal') { // target
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
        console.log('渲染 不是TARG')
        _tableContent.value[9].results = ''
        _tableContent.value[9].isDisabled = true
      }
    }
  }

  /** 自动加载 待用
   * 2024-01-08
   * @param record 
   */
  const _autoRendringTable =(record:IQICRecord)=>{
    console.log('自动加载 ---渲染表---')

    // (1)、设置表名
    tableName.value = record.table_Name

    // (2) 裁切params
    let arr = record.params.split('-')
    arr.pop() // 去掉最后一个

    // (3) 特殊项
    _Inditex_(tableName.value, arr)

    // (4) 领班是否登录
    let it:Array<string> = []
    if (qicStore.isForemanLogin){
      _foreManLogin_(arr, it)
    }

    // (5) 是否禁用
    _complete_(arr, it)
    _notComplete_(arr, it)

    // (6) 是否是当天
    if(qicStore.queryForm._date === getTime(0)){
      _currentRecord_()
    }

    // (7) tage
    _tage_()
  }


  return {
    _resetTableContent_, _autoRendringTable
  }
}
export default _userenderingTableHooks