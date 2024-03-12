<!-- 质量检测表模块 -->
<script setup lang="ts">
// VUE3
import { ref, watch,onBeforeMount, onMounted } from 'vue'
import ExportPdf2 from '../../components/QIR/ExportPdf2.vue'
// 组件（element）
import { ElMessageBox } from 'element-plus'
// 图标
import { Search } from '@element-plus/icons-vue'
// element-plus
import { messageError } from '../../tools/element-plus/SBMessage'
//hooks
import tableHooks from '../../components/QIR/hooks/tableHooks'

import _useInitQICHooks from '../../components/QIR/hooks/initQICHooks'
import _useOrderHooks from '../../components/QIR/hooks/orderHooks'
import _useHandleOkHooks from '../../components/QIR/hooks/handleOkHooks'
import _userenderingTableHooks from '../../components/QIR/hooks/renderingTableHooks'
import _useItemRecordHooks from '../../components/QIR/hooks/itemRecordHooks'


import _autoLoaderHooks from '../../components/QIR/hooks/autoLoaderHooks'
import _batchLoaderHooks from '../../components/QIR/hooks/batchLoaderHooks'
import _useSearchRecordHooks from '../../components/QIR/hooks/searchRecordHooks'



// import { getTime } from '../../tools/utils/sb_time'
// 接口
import type { IQICOrderDByIP, IQICRecord, IQICTableData } from '../../tools/interface/iQicData'
import { _getUrl } from '../../tools/utils/getUrl'
import { GetNameByNo } from '../../tools/api/userApi'
import { _sortQicRecord } from '../../tools/utils/xjh_sort'
import { getTime } from '../../tools/utils/sb_time'
import { useQirPinia } from '../../store/qir'
const qicStore = useQirPinia()

let tbUuid = ref<string>('') // 表的uuid，如果没有，保存在localsession中（无用）
// 是否质量检测表 true: 显示, false: 显示搜索列表
let isShowQIR = ref<boolean>(true)
const InditexProduct = ref<Array<{index: string, title: string, url: string}>>([
  {
    index: '1',
    title: 'TexTrace',
    url: new URL('../../assets/img/TexTrace.PNG',import.meta.url).href
    // url: TexTrace
  },
  {
    index: '2',
    title: 'Overlock',
    url: new URL('../../assets/img/Overlock.PNG',import.meta.url).href
    // url: Overlock
  },
  {
    index: '3',
    title: 'Tempe',
    url: new URL('../../assets/img/Tempe.PNG',import.meta.url).href
    // url: Tempe
  },
  {
    index: '4',
    title: 'PFL',
    url: new URL('../../assets/img/PFL.PNG',import.meta.url).href
    // url: PFL
  }
])
let InditexValue = ref<string>('2') // 特殊的表，Inditex
// 订单信息
const _orderInfo = ref<IQICOrderDByIP>({
  batch: '',
  rbo: '',
  typesettingMethod: '',
  internalItem: '',
  otc: [],
  smallFromName: '',
  qty: ''
})
// 记录信息(一份)
const _record = ref<IQICRecord>({
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
})

let tableName = ref<string>('Thermal')
let batch = ref<string>('') // 必须在输入框中使用本batch，不然其它组件监听这个，有问题，多次请求的问题（输入框的问题）
// const _filterSearchRecordList = ref<Array<IQICRecord>>([])
// hooks
const { _tableData, _getTContent, _initOneTable, _resetContent, _disabledOneContent, _filterTableContent, _tableContent, _renderingTable } = tableHooks(tableName, InditexValue)
const { _init, _fiveData } = _useInitQICHooks()
const {_autoLoader, _batchLoader, _getOrderByBatch, resetRecordInfo } = _useOrderHooks(tableName, InditexValue, isShowQIR, _orderInfo, _record)
const { _createOK, _updateOK } = _useHandleOkHooks(tbUuid)
const {  } = _userenderingTableHooks(_tableContent, _filterTableContent, InditexValue, tableName)
const {_clickSearchRecord, _filterSearchRecordList } = _useSearchRecordHooks(isShowQIR, batch)
const { _clickItemRecord } = _useItemRecordHooks(isShowQIR, _record, tbUuid, _orderInfo, InditexValue, _tableContent)

// const { _clickAuto } = _autoLoaderHooks(isShowQIR, _orderInfo, _record)
// const { _clickBatchLoader } = _batchLoaderHooks(isShowQIR, InditexValue, tableName, _orderInfo, _record, batch)

// ***************** 请求的数据 **************************

let isAuto = ref<number>(-1) // 是否是自动加载：-1：默认，0：自动加载，1：按单加载


// let qicRecordArr = ref<Array<IQICSearchData>>([]) // 原来的数据

// 表数据
let okData = ref<Map<string, string>>(new Map()) // 存放OK数据

// let procedure = ref<Array<string>>([
//   '印刷', '剪纸', 'QC', '贴标', '包装'
// ]) // 工序


// 选择框数据
const options = [
  {
    value: '1',
    label: 'OK',
  },
  {
    value: '2',
    label: 'NOT OK',
  },
  {
    value: '3',
    label: 'N/A',
  }
]

// 是否显示pdf导出模块
const isPdf = ref<boolean>(false)



// *************************方 法*************************************

// 压力测试
// const test1 = async () => {
//   console.log('测试1')
//   for(let i = 0; i < 1000000; i++) {
//     // qicStore.getIpS()
//     const results1 = await GetBacthByIp('10.160.24.175')
//     console.log('results ==> ', results1)
//     const results2 = await GetOrderByBatch('NSB10865171')
//     console.log('results ==> ', results2)
//     const results3 = await GetPDF('NSB10865171')
//     console.log('results ==> ', results3)
//     const results4 = updatePad('8024940', '123456', i.toString())
//     console.log('results ==> ', results4)
//   }
// }
// test1()

// （2）自动加载(记得要改测试数据)
const autoLoader = () => {
  console.log('自动加载!')
  qicStore.BatchRefresh++ // 测试 累计 后面用batch监听 重置一些参数
  // _clickAuto()
  isAuto.value = -1
  isAuto.value = 0
  tbUuid.value = ''
  // 1、特殊的inditexSet
  // _inditexSet_()
    // 2、重置表
  _resetContent()
  _autoLoader()
  return
}

// （3）按单加载
const orderLoader = () => { 
  console.log('按单加载!!')
  qicStore.BatchRefresh++ // 测试 累计 后面用batch监听 重置一些参数
  // _clickBatchLoader()
  // return
  isAuto.value = -1
  isAuto.value = 1
  tbUuid.value = ''
  // 1、特殊的inditexSet
  // _inditexSet_()
    // 2、重置表
  _resetContent()
  // 去空
  batch.value = batch.value.trim()
  _batchLoader(batch.value)
  return
}
// （4）搜索记录
// const searchQIRC = () => {
//   console.log('搜索记录')
//   tbUuid.value = ''
//   // 1、特殊的inditexSet
//   // _inditexSet_()
//     // 2、重置表
//   _resetContent()
//   // 去空
//   batch.value = batch.value.trim()
//   _searchRecord(batch.value)
// }

// （5）输入工号获取姓名
const out_job_to_name = (job_number: number) => {
  GetNameByNo(job_number).then((res:any)=>{
    console.log(res)
    qicStore.queryForm._name = ''
    qicStore.queryForm._name = res.data
    qicStore.queryForm.jobNumber = job_number
  }).catch((err:any)=>{
    console.error(err)
    qicStore.queryForm._name = ''
  })
}

// （6）手动添加一条记录，当我们搜索历史记录，在最下面里有一个添加记录按钮
const clickOneRecord = () => {

  // 1、判断
  if (qicStore.queryForm._name === '') {
    messageError('请输入工号')
    return
  }

  // 2、重置工号、姓名
  // qicStore.queryForm.jobNumber = 80
  // qicStore.queryForm._name = ''
  qicStore.queryForm.batch = ''
  qicStore.queryForm.rbo = ''
  qicStore.queryForm.DJ = ''
  qicStore.queryForm.rbo = ''
  tbUuid.value = ''

  // 3、关闭列表
  isShowQIR.value = true

  // 4、重置表格数据
  _resetContent()

  // 5、重置记录
  resetRecordInfo()
  tbUuid.value = ''

  // console.table(_record.value)
  // console.table(qicStore.queryForm)
  // console.table(qicStore.ipData)
  // console.table(_orderInfo.value)

  // 5、请求
  _getOrderByBatch(batch.value.trim())

  qicStore.queryForm._date = getTime(0)

}

// 7为工号
const inputJob = (value: number) => {
  const val = value
  if (val.toString().length === 7) {
    console.log(value)
    out_job_to_name(value)
  } else {
    console.error('工号长度不对')
    qicStore.queryForm._name = ''
  }
}

// 点击最近5条记录
const clickFiveRecord = (_batch: string) => {
  batch.value = _batch
  _clickSearchRecord()
}

// 根据每一项的报表，点击
const itemQIC = (record: IQICRecord) => {

  qicStore.BatchRefresh++ // 测试 累计 后面用batch监听 重置一些参数
  _clickItemRecord(record)
  return

  console.log('根据每一项的报表，点击')
  console.table(record)

  // 1、赋值
  // 隐藏列表
  isShowQIR.value = true
  // 先赋值单号, 不然后面监听有问题
  qicStore.queryForm.batch = batch.value
  // // pinia
  qicStore.isBatch = 1
  qicStore.isRecord = 1

  _record.value = record // 领班登录用到
  qicStore.recordObj = record // 添加中,半小时解禁用到,领班也可能用到

  qicStore.queryForm.procedure = record._process
  // qicStore.queryForm.rbo = record.rbo
  tbUuid.value = record.uuid

  if (record.create_Time.split(' ')[0] === getTime(0)) {
    if (record.state === '0') {
      qicStore.isCurrentDayRecord = 2 // 当天的记录未完成
    } else {
      qicStore.isCurrentDayRecord = 0 // 当天的记录已完成
    }
  }

  // 有问题,先不执行搜索框的当天记录判断了
  // if (record.create_Time.split(' ')[0] === getTime(0)) {
  //   if (record.state === '1') {
  //     qicStore.isCurrentDayRecord = 0 // 当天的记录已完成
  //   } else {
  //     qicStore.isCurrentDayRecord = 2 // 当天的记录未完成
  //   }
  // } else {
  //   if (record.state === '1') qicStore.isCurrentDayRecord = 1 // 不是当天的已完成
  //   else qicStore.isCurrentDayRecord = 3 // 不是当天的未完成
  // }
  

  // 获取订单信息
  _getOrderByBatch(record.batch)

  qicStore.queryForm._date = record.create_Time.split(' ')[0]

  // 2、重置表格数据
  _resetContent()

  qicStore.queryForm.jobNumber = +record.employee
  qicStore.queryForm._name = record.cN_Name

  // 3、渲染表
  _renderingTable(record)
}

// 检查结果(选中后)
const changeResults = (index: number,value: string) => {
  console.log('选择ok')
  console.log(index)
  console.log(value)
  console.log('uuid ==> ', tbUuid.value)
  if (index === undefined) return
  // console.log('results ==> ', tableData.value.get(tableName.value)[index-1].results)
  // 判断是否是该工序的操作
  console.log(qicStore.queryForm.procedure)
  console.log(qicStore.ipData.process_selection)
  // if (qicStore.queryForm._date === getTime(0)) { // 是否是当天的记录
  //   qicStore.isCurrentDayRecord = 1
  // } else {
  //   qicStore.isCurrentDayRecord = 0
  // }
  if (qicStore.queryForm.procedure !== qicStore.ipData.process_selection) {
    // messageError('本机台操作工序与记录工序不一致')
    console.error('本机台操作工序与记录工序不一致')
  }

  // 特殊项
  console.log(qicStore.tableName)
  if (qicStore.tableName === 'Inditex') index +=1
  console.log('Inditex ==> ', index)

  // 1、判断
  if (value === '2') { // 如果是NOT OK弹框
    showResultsBox(index) // 有点问题
  }
  // 否则
  else if (value === '1' || value === '3'){
    if (tbUuid.value === '') {
      // createQICData(index, value)
      _createOK(index, value, qicStore.tableName, InditexValue.value, _tableContent.value, _filterTableContent.value)

      // const day = qicStore.queryForm._date
      // const currentDay = getTime(0)
      // if (day === currentDay) { // 如果是当天的
      //   qicStore.isCurrentDayRecord = 2
      // }

      // 2024-01-08 注释了两行记录 待测
      // qicStore.isRecord = 1 // 有记录
      // qicStore.isCurrentDayRecord = 2 // 当天的记录未完成

    } else {
      // updateOneQICData(index, value)
      _updateOK(index, value, _filterTableContent.value) 
    }
  }
}

// 弹框
const showResultsBox = (index: number) => {
  ElMessageBox.alert('检查结果不能选择NOT OK', '警告', {
    confirmButtonText: 'OK',
    callback: () => {
      console.log('index ==> ', index)
      _tableData.value.get(qicStore.tableName)![index].results = okData.value.get((index).toString()) || '' // 无效（有点问题，不见之前的值）
    },
  })
}

// 领班登录，修改权限
const formanLoginUpdateQIC_OK = () => {
  console.log('领班登录，修改权限')
  // console.table(filterQicRecordArrByEmployee.value)
  // console.table(selectRecordIndex.value)
  if (_record.value.uuid === '') {
    return
  }

  _renderingTable(_record.value)

  return
}

// Inditex 的特殊设置 无效
// const _inditexSet_ = ()=>{
//   console.log('的特殊设置')
//   console.log(_orderInfo.value.smallFromName)
//   if (_orderInfo.value.smallFromName.indexOf('Inditex') !== -1) {
//     const arr = _orderInfo.value.smallFromName.split('/')
//     tableName.value = arr[0]
//     if (arr[1] === 'TexTrace') InditexValue.value = '0'
//     else if (arr[1] === 'Overlock') InditexValue.value = '1'
//     else if (arr[1] === 'Tempe') InditexValue.value = '2'
//     else if (arr[1] === 'PFL') InditexValue.value = '3'
//     else InditexValue.value = '0'
//   }
// }

// ***************** 监听器 **************************

// 监听 是否有记录
// watch(()=>qicStore.isRecord, (newVal, oldVal)=>{
//   console.log('************ isRecord (table)  *********************')
//   console.log(newVal, oldVal)
//   if (newVal !== oldVal && newVal !== -1) {
//     // 1、特殊的inditexSet
//     // _inditexSet_()
//     // 2、重置表
//     // _resetContent()
//     // if (newVal === 1) { // 有最近一份记录
//     //   console.log('有记录')
//     //   console.log(isAuto.value, qicStore.isCurrentDayRecord)
//     //   // 1、特殊的inditexSet
//     //   _inditexSet_()
//     //   // 2、重置表
//     //   _resetContent()
//     //   // 3、渲染表
//     //   if (isAuto.value === 0 && qicStore.isCurrentDayRecord !== 2) { // 如果是自动加载的，不是当天的未完成 不渲染
//     //     console.log('自动加载的，不是当天的未完成 不渲染')
//     //     if (qicStore.isCurrentDayRecord === 0 || qicStore.isCurrentDayRecord === 1) {
//     //       console.log('自动加载的，已完成 禁用')
//     //       _disabledOneContent()
//     //     }
//     //     return
//     //   }
//     //   // 渲染表
//     //   _renderingTable(_record.value)
//     //   // 4、uuid
//     //   tbUuid.value = _record.value.uuid
//     //   // 5、禁用
//     //   console.log(isAuto.value, qicStore.isCurrentDayRecord, isAuto.value === 1, qicStore.isCurrentDayRecord !== 2)
//     //   if (isAuto.value === 1 && qicStore.isCurrentDayRecord !== 2) { // 如果是按单加载，不是当天的未完成，禁用
//     //     console.log('按单加载，不是当天的禁用')
//     //     _disabledOneContent()
//     //   }
//     // } else { // 没有记录
//     //   console.log('没有记录')
//     //   // 1、特殊的inditexSet
//     //   _inditexSet_()
//     //   // 2、重置表
//     //   _resetContent()

//     //   // 3、开启当天记录，开启定时器
//     //   // qicStore.isCurrentDayRecord = 1 // 当天的历史记录
//     //   // qicStore.isRecord = 1
//     // }
//   }
// })

// 监听 是否是当天 (用这个监听自动加载和按单加载，用record有问题) 监听器不建议用，好烦，因为要两个判断, 顺序
watch(()=>qicStore.isCurrentDayRecord, (newVal, oldVal) => {
  console.log('****** 监听 isCurrentDayRecord (table) ***********')
  console.log(newVal, oldVal, qicStore.isRecord, isAuto.value)
  if (newVal !== oldVal && newVal !== -1) {
    // 3、判断 是否渲染表，是否禁用，是否不渲染
    if (qicStore.isRecord === 1) { // 有记录的
      // (1) 自动加载的特殊判断
      // if (isAuto.value === 0 && newVal !== 2) { // 如果是自动加载的，不是当天的未完成 不渲染
      //   console.log('自动加载的，不是当天的未完成 不渲染')
      //   if (newVal === 0 || newVal === 1) {
      //     console.log('自动加载的，已完成 禁用')
      //     _disabledOneContent()
      //   }
      //   return
      // }

      // 大单，有记录判断 新的一天
      if (newVal === 4){
        // 2、重置表格数据
        _resetContent()
        // 重置记录
        resetRecordInfo()
        tbUuid.value = ''
        // console.table(_record.value)
        // console.table(qicStore.queryForm)
        // console.table(qicStore.ipData)
        // console.table(_orderInfo.value)
        return
      }

      // 赋值uuid
      tbUuid.value = _record.value.uuid
      if (isAuto.value === 0) { // 自动加载
        if (newVal === 0 || newVal === 1) { // 自动加载 已完成，禁用 不渲染
          console.log('自动加载的，已完成 禁用 不渲染 ')
          _disabledOneContent()
          return
        } else if (newVal === 3) { // 自动加载 不是当天 未完成 禁用渲染
          console.log('自动加载的，未完成 不是当天 禁用 渲染 ')
          if (!qicStore.isForemanLogin) { // 如果不登录才禁用
            _disabledOneContent()
          }
        } // 当天的不禁用
      }
      // (2) 渲染表
      _renderingTable(_record.value)
      // (3) 按单加载的特殊判断
      if (isAuto.value === 1 && qicStore.isCurrentDayRecord !== 2) { // 如果是按单加载，不是当天的未完成，禁用
        console.log('按单加载，不是当天的禁用')
        if (!qicStore.isForemanLogin) { // 如果不登录才禁用
          _disabledOneContent()
        }
      }
    }
  }
})


// 监听pinia batch变化，更新订单数据
watch(()=>qicStore.queryForm.batch, (newVal, oldVal) => {
  console.log('pinia batch ==> ', newVal, oldVal)
  qicStore.isShowView = 0
  if(newVal !== oldVal && newVal !== '') {
    if (newVal !== '' && newVal !== batch.value) {
      batch.value = newVal
      // getOrderByBatch(qicStore.queryForm.batch)
    }
  }
})
// 监听表名称，更新表数据
// watch(()=>tableName.value, (newVal, oldVal) => {
//   if(newVal !== oldVal) { // 获取表格数据
//     _getTContent()
//   } else if (newVal === oldVal) { // 重置表格数据
//     _tableData.value.get(tableName.value)!.forEach((item: any) => {
//       item.isDisabled = false
//       item.results = ''
//   })
//   }
// })
// 监听是否领班登录
watch(()=> qicStore.isForemanLogin, (newVal, oldVal) => {
  if (newVal !== oldVal) {
    if (newVal) { // 如果登录了
      console.log('登录')
      formanLoginUpdateQIC_OK()
    } else { // 如果取消了
      console.log('退出')
      formanLoginUpdateQIC_OK()
    }
  }
})

// 监听工序，禁用OK
watch(()=>qicStore.queryForm.procedure, (newVal, oldVal)=>{
  if (newVal !== oldVal) {
    // tbUuid.value = '' // 重置uuid
    console.log('uuid ==> ', tbUuid.value)
    // console.table(_record.value)
    if (tbUuid.value !== '') {
      if (newVal !== _record.value._process) {
        _filterTableContent.value?.forEach(v=>{ // 禁用工序(其它工序)
          v.isDisabled = true
        })
      }
    }
  }
})


onBeforeMount(()=> {
  console.log('table onBeforeMount')
  // 首次启动
  _init()
  _initOneTable() // 初始化第一个表格内容
  qicStore.isShowView = 0
})
onMounted(() => {
  console.log('table onMounted')
  _getTContent() // 获取所有表格内容
})

// *******************************样  式*********************************
// 修改表头的行 text-align: center;
const headerRowStyle = () => {
  return {
    // textAlign: 'center', // 无效
    fontWeight: 'bold',
    color: '#fff',
    // backgroundColor: 'red'
  }
}
// 修改行的样式 -- start
// const tableContetnStyle = () => {
//   // 1、判断表内容 Inkjet Thermal Inditex Zebra UQ
//   switch(tableName.value) {
//     case 'Inkjet':
//       arrStyle.value = []
//       arrStyle.value.push(12, 14, 17, 19, 22, 24)
//       break;
//     case 'Thermal':
//       arrStyle.value = []
//       arrStyle.value.push(12, 14, 17, 19, 22, 24)
//       break;
//     case 'Inditex':
//       arrStyle.value = []
//       arrStyle.value.push(12, 14, 17, 19, 22, 24)
//       break;
//     case 'Zebra':
//       arrStyle.value = []
//       arrStyle.value.push(12, 14, 17, 19, 22, 24)
//       break;
//     case 'UQ':
//       arrStyle.value = []
//       arrStyle.value.push(12, 14, 17, 19, 22, 24)
//       break;
//     default:
//       arrStyle.value = []
//       arrStyle.value.push(5, 10, 15, 20, 25, 30)
//       break;
//   }
// }
// tableContetnStyle()
// const rowStyle = ({row,rowIndex}: {
//   row: IQICTableData
//   rowIndex: number
// }) => {
//   // 设计样式
//   let style
//   switch (true) {
//     case (rowIndex <= arrStyle.value[0]): // rowIndex >= 0 && rowIndex <= 12
//       style = {
//         color: '#ff0',
//         backgroundColor: '#f00'
//       }
//       break;
//     case (rowIndex <= arrStyle.value[1]):
//       style = {
//         color: '#000',
//         backgroundColor: '#ff0'
//       }
//       break;
//     case (rowIndex <= arrStyle.value[2]):
//       style = {
//         color: '#000',
//         backgroundColor: '#f0f'
//       }
//       break;
//     case (rowIndex <= arrStyle.value[3]):
//       style = {
//         color: '#000',
//         backgroundColor: '#f0f'
//       }
//       break;
//     case (rowIndex <= arrStyle.value[4]):
//       style = {
//         color: '#000',
//         backgroundColor: '#fcf354'
//       }
//       break;
//     case (rowIndex <= arrStyle.value[5]):
//       style = {
//         color: '#000',
//         backgroundColor: '#0979f3'
//       }
//       break;
//     default:
//       style = {
//         color: '#000',
//         backgroundColor: '#fff'
//       }
//       break;
//   }
//   return style
// }
// const rowStyle = () => {
//   return {
//     color: '#000',
//     backgroundColor: '#fff'
//   }
// }
// 修改行的样式 -- end
const rowStyle = ({row,rowIndex}: {
  row: IQICTableData
  rowIndex: number
}) => {
  let style = {
    color: '#000',
    backgroundColor: '#fff'
  }
  if (rowIndex === 9) {
    console.log(row)
    if (qicStore.tableName.indexOf('Thermal') !== -1) {
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) { // 不是tage
        style = {
          color: '#fff',
          backgroundColor: '#f52025' // cad5e1
        }
      } else { // 是tage
        style = {
          color: '#333',
          backgroundColor: '#67c23a'
        }
      }
    }
  }
  return style
}



// 行的颜色
// :row-class-name="tableRowClassName"
// 
// const tableRowClassName = ({
//   row,
//   rowIndex,
// }: {
//   row: IQICTableData
//   rowIndex: number
// }) => {
//   if (rowIndex === 9) {
//     console.log(row)
//     if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) { // 不是tage
//       return 'NOT-TAGE'
//     } else { // 是tage
//       return 'TAGE'
//     }
//   }
//   return ''
// }

</script>

<template>
  <!-- 标题 -->
  <div class="qir-title sb-pl-5">质量检查表</div>
  <!-- 搜索框 -->
  <div class="qir-search-box">
    <el-form :inline="true" :model="qicStore.queryForm" class="demo-form-inline sb-pl-5" style="background-color: #fff;">

      <!-- 最近几条单号 -->
      <div class="qir-ON_list">
        <div class="qir-ON_item one-ellipsis sb_hand" :class="qicStore.isDisabledLeft === 1 ? 'not-click' : ''" v-for="(v, i) in _fiveData" :key="i" @click="clickFiveRecord(v.batch)">{{v.batch}}</div>
      </div>

      <!-- 输入 qicStore.queryForm.batch -->
      <el-form-item label="单号"><el-input v-model="batch" placeholder="请输入单号" clearable :disabled="qicStore.isDisabledLeft === 1" /></el-form-item>
      <el-form-item label="DJ">
        <el-select v-model="qicStore.queryForm.DJ" placeholder="DJ" style="width: 100px;" :disabled="qicStore.isDisabledLeft === 1">
          <el-option
            v-for="item in _orderInfo.otc"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="工号"><el-input v-model.number="qicStore.queryForm.jobNumber" placeholder="工号" clearable @input="inputJob" :disabled="qicStore.isDisabledLeft === 1" /></el-form-item>
      <el-form-item>
        <el-button-group>
          <el-button round type="primary" @click="autoLoader" :disabled="qicStore.isDisabledLeft === 1">自动加载</el-button>
          <el-button round type="success" @click="orderLoader" :disabled="qicStore.isDisabledLeft === 1">按单加载</el-button>
        </el-button-group>
      </el-form-item>

      <el-form-item label="客户"><el-input disabled v-model="qicStore.queryForm.rbo" placeholder="客户" clearable /></el-form-item>
      <el-form-item label="产品"><el-input disabled v-model="qicStore.queryForm.internalItem" placeholder="产品" clearable /></el-form-item>
      <el-form-item label="姓名"><el-input disabled v-model="qicStore.queryForm._name" placeholder="姓名" clearable /></el-form-item>
      <el-form-item>
        <el-button round type="primary" @click="_clickSearchRecord" :icon="Search" :disabled="qicStore.isDisabledLeft === 1">搜索记录</el-button>
      </el-form-item>

      <el-form-item>
        <el-button round type="primary" v-if="qicStore.isDisabledLeft === 0 || qicStore.isDisabledLeft === -1" @click="qicStore.isDisabledLeft = 1">锁定</el-button>
        <el-button round type="success" v-if="qicStore.isDisabledLeft === 1" @click="qicStore.isDisabledLeft = 0">解锁</el-button>
      </el-form-item>

      <el-form-item label="组别"><el-input disabled v-model="qicStore.queryForm.type" placeholder="组别" clearable /></el-form-item>
      <el-form-item label="机台"><el-input disabled v-model="qicStore.queryForm.machineNo" placeholder="机台" clearable /></el-form-item>
      <el-form-item label="日期"><el-input disabled v-model="qicStore.queryForm._date" placeholder="日期" clearable /></el-form-item>
      <el-form-item>
        <!-- procedure -->
        <el-select v-model="qicStore.queryForm.procedure" placeholder="工序" style="width: 100px;" :disabled="qicStore.isDisabledLeft === 1">
          <el-option
            v-for="item in qicStore.processArr"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
        <!-- 导出按钮 -->
        <!-- <el-button roud type="primary" @click="isPdf = true" >导出</el-button> -->
      </el-form-item>

    </el-form>
  </div>
  <!-- 表格 -->
  <div class="qir-table-content xj-scoll xj-not-select" v-show="isShowQIR">
    <!-- Indeitex 表头 -->
    <div v-show="qicStore.tableName === 'Inditex'" class="Inditex-header">
      <el-radio-group v-model="InditexValue">
        <el-radio :label="v.index" v-for="(v, i) in InditexProduct" :key="i" disabled>
          <span>{{v.title}}</span>
          <el-image style="width: 50px;" :src="v.url"
            :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :preview-src-list="[v.url]" :initial-index="4"
            fit="contain" />
        </el-radio>
      </el-radio-group> 
      <!-- <el-radio-group v-model="InditexValue" class="ml-4">
        <el-radio label="1" size="large">Option 1</el-radio>
        <el-radio label="2" size="large">Option 2</el-radio>
      </el-radio-group> -->
    </div>
    <!-- 表内容 v-loading="_tableContent.length === 0 ? false : true" -->
    <el-table
      :data="_filterTableContent" :border="true" size="small" style="width: 100%" :highlight-current-row="true"
      :header-row-style="headerRowStyle" :row-style="rowStyle">
      <el-table-column prop="process" label="过程" width="80" />
      <el-table-column prop="number" label="编号" width="51" align="center" />>
      <el-table-column prop="risk_level" label="风险等级" width="51" align="center" />
      <el-table-column prop="inspection_items" label="检查项目" width="190" header-align="center" />
      <el-table-column prop="inspection_frequency" label="检查频率" width="100" header-align="center" />
      <el-table-column prop="method" label="检查方法/仪器" width="120" />
      <el-table-column prop="results" label="检查结果" width="100">
        <template #default="scope">
          <el-select :disabled="scope.row.isDisabled || qicStore.isDisabledLeft === 1" class="results" v-model="scope.row.results" placeholder="请选择" ref="select"
            @change="changeResults(scope.row.index, scope.row.results)">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
            >Edit</el-button
          >
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
            >Delete</el-button
          > -->
        </template>
      </el-table-column>
    </el-table>
  </div>

  <!-- 搜索列表 -->
  <div class="qic-search-list-box" v-show="!isShowQIR">
    <!-- 头部 -->
    <div class="qic-search-list_header">
      <div>工序</div>
      <div>编号</div>
      <div>姓名</div>
      <div>工号</div>
      <div>状态</div>
      <div>日期</div>
    </div>
    <!-- 列表 -->
    <div class="qic-search-list xj-scoll" :class="_filterSearchRecordList.length >= 23 ? 'active' : ''">
      <div class="qic-search-list-item sb_hand" :class="{active: v.state === '0'}" @click="itemQIC(v)" v-for="(v, i) in _filterSearchRecordList" :key="v.uuid">
        <div>{{v._process}}</div>
        <div>{{i + 1}}</div>
        <div>{{v.cN_Name}}</div>
        <div>{{v.employee}}</div>
        <div>{{v.state}}</div>
        <div>{{v.create_Time.split(' ')[0]}}</div>
        <!-- <el-text class="mx-1" type="info">{{i}}</el-text>
        <el-text class="mx-1" type="primary">{{v.cN_Name}}</el-text>
        <el-text class="mx-1" type="success">{{v.employee}}</el-text>
        <el-text class="mx-1" type="warning">{{v.state}}</el-text>
        <el-text class="mx-1" type="danger">{{v.create_Time.split(' ')[0]}}</el-text> -->
      </div>
    </div>
    <!-- 添加一项 -->
    <div class="qic-search-footer sb_hand" :class="_filterSearchRecordList.length >= 23 ? 'xj-fixed' : 'xj-flex'" v-show="!isShowQIR">
      <el-button type="primary" @click="clickOneRecord">添加记录</el-button>
      <el-button type="primary" @click="isPdf = true">导出</el-button>
    </div>
  </div>

  <!-- 导出PDF模块 -->
  <el-dialog v-model="isPdf">
    <!-- <ExportPdf :_tableList="_tableContent" /> -->
    <ExportPdf2 :_tableList="_filterSearchRecordList" :_tableContent="_tableContent" />
  </el-dialog>
</template>

<style scoped lang="less">
.qir-table-content {
  height: calc(100% - 20px - 156px - 30px);
}
// 表
.qir-table-content {
  // height: calc( 100vh - 50px - 156px - 50px );
  padding-bottom: 30px;
  background-color: #fff !important
}

// 最近几条数据
.qir-ON_list {
  display: flex;
  justify-content: space-around;
  .qir-ON_item {
    // flex: 15%;
    width: 100px;
    padding: 5px 0;
    text-align: center;
    font-size: 18px;
    color: #67c23a;
  }
  // .qir-ON_item:nth-child(5) {
  //   color: #ef1515;
  // }
  // .qir-ON_item:nth-child(1) {
  //   color: #67c23a;
  // }
  // .qir-ON_item:nth-child(2) {
  //   color: #67c23a;
  // }
  // .qir-ON_item:nth-child(3) {
  //   color: #67c23a;
  // }
  // .qir-ON_item:nth-child(4) {
  //   color: #ef1515;
  // }
  // .qir-ON_item:nth-child(5) {
  //   color: #666;
  // }
}
.mr-10 {
  margin-right: 10px;
}
// fiveData.length === 4 ? 'flex-around' : 'mr-10'
.flex-around {
  justify-content: space-around;
}
.flex-end {
  justify-content: flex-end;
}

// 搜索 表单
.el-form--inline .el-form-item {
  margin-right: 21px;
}

// 搜索框宽度
.demo-form-inline .el-input {
  --el-input-width: 100px;
}
// 搜索框字体
.el-form-item--small {
  --font-size: 18px;
}
.el-form-item__label {
  color: #000; // 无效
}
// 表单标头
/deep/.el-table th.el-table__cell {
  background-color: var(--el-color-primary-light-3);
  font-size: 16px;
}
// 表单
/deep/.el-table .cell {
  line-height: 18px;
  white-space: pre-line !important;
}
// .el-table--small {
//   // font-size: 14px;
// }

// TAGE 样式
.el-table .NOT-TAGE {
  --el-table-tr-bg-color: var(--el-color-warning-light-9) !important
}
.el-table .TAGE {
  --el-table-tr-bg-color: var(--el-color-success-light-9) !important
}


// 搜索样式
.qic-search-list-box {
  height: calc(100% - 20px - 156px - 25px);
}
.qic-search-list_header {
  display: flex;
  justify-content: space-between;
  // padding: 0 10px;
  text-align: center;
  background-color: #409eff;
  color: #fff;
  font-size: 20px;
  >div {
    flex: 23%;
  }
}

// 列表
.qic-search-list.active {
  height: calc(100% - 25px);
}
.qic-search-list {
  // margin-bottom: 20px;
  .qic-search-list-item {
    display: flex;
    justify-content: space-between;
    // padding: 0 10px;
    margin-bottom: 10px;
    background-color: #fff;
    color: #000;
    font-size: 16px;
    text-align: center;
    &:last-child {
      margin-bottom: 0;
    }
    >div {
      flex: 24%;
    }
  }
  .qic-search-list-item:hover {
    font-size:20px;
    background-color: #0ff;
    color: #fff;
  }

  .qic-search-list-item.active {
    background-color: #f00;
    color: #fff;
  }
  .qic-search-list-item:nth-child(1) .el-text:first-child {
    color: #f00;
  }
  .qic-search-list-item:nth-child(2) .el-text:first-child {
    color: #0f0;
  }
  .qic-search-list-item:nth-child(3) .el-text:first-child {
    color: #00f;
  }
}

// 尾部
.qic-search-footer.xj-fixed {
  position: fixed;
  bottom: 5px;
  left: 10px;
}
.qic-search-footer.xj-flex {
  display: flex;
  margin-top: 10px;
}

// Inditex 样式
// Inditex-header
.Inditex-header {
  margin: 1px 0;
}
.Inditex-header .el-radio-group {
  display: flex;
  flex-wrap: wrap;
  padding-left: 10px;
  background-color: #fff;
  /deep/.el-radio.el-radio--small .el-radio__label {
    display: flex;
    align-items: center;
  }
}
</style>