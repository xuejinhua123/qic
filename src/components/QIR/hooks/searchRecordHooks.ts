// 搜索记录  2024-01-15 待测试 测试几天
import { Ref, ref, watch } from 'vue'
import { useQirPinia } from '../../../store/qir'
import { messageError } from '../../../tools/element-plus/SBMessage'
import { SelectFromForBatch2 } from '../../../tools/api/qicApi'
import { _sortQicRecord } from '../../../tools/utils/xjh_sort'
import { IQICRecord } from '../../../tools/interface/iQicData'
function _useSearchRecordHooks(isShowRecordView:Ref<boolean>, batch:Ref<string>){
  const qicStore = useQirPinia()
  // 搜索记录
  const _searchRecordList = ref<Array<IQICRecord>>([])
  const _filterSearchRecordList = ref<Array<IQICRecord>>([])

  /**
   * 搜索前判断
   * @param batch 单号
   * @returns true: 错误，false: 真诚
   */
  const _searchFrontJudge = ()=> {
    if(batch.value === '') {
      messageError('请输入batch')
      return true
    }
    if (batch.value.length !== 11) {
      messageError('batch格式错误( 11位 )')
      return true
    }
    return false
  }

  /**
   * 搜索前的初始化
   */ 
  const _searchFrontInit = ()=> {
    
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
  }

  /**
   * 获取记录
   */
  const _getRecord = ()=>{
    SelectFromForBatch2(batch.value).then((res:any)=>{
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

  /**
   * 点击搜索按钮
   */
  const _clickSearchRecord = ()=> {
    console.log('点击搜索按钮: ' + batch.value)
    // 1、去空
    batch.value = batch.value.trim()
    // 2、请求判断
    if (_searchFrontJudge()) return
    // 3、重置一些参数
    _searchFrontInit()
    // 4、获取记录
    _getRecord()
  }

  // 处理搜索记录
  const handleSerachRecord = (res:any)=>{
    // 1、赋值
    _searchRecordList.value = res

    // 3、排序
    _searchRecordList.value = _sortQicRecord(_searchRecordList.value)
    const employee = qicStore.queryForm.jobNumber.toString()
    if (employee.length !== 7) _filterSearchRecordList.value = _searchRecordList.value
    else _filterSearchRecordList.value = _searchRecordList.value.filter((v:any) => v.employee === employee)
    // console.table(_filterSearchRecordList.value)
  }

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

  /// 
  
  return {
    _clickSearchRecord,_filterSearchRecordList
  }
}
export default _useSearchRecordHooks