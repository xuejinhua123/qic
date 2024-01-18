<!-- 将表格导出成PDF -->
<script setup lang="ts">

// import {downloadPDF} from "@/util/pdf.js"  //工具方法，导出操作
import { ref } from "vue"
import { IQICRecord, IQICTableData } from '../../tools/interface/iQicData'
import { downloadPDF } from '../../tools/utils/exportPdf2'
import { getTime } from "../../tools/utils/sb_time"

const props = defineProps({
  _tableList: {
    type: Array<IQICRecord>
  },
  _tableContent: {
    type: Array<IQICTableData>,
    default: []
  }
})
let _batch = ref<string>('123')
const _pdf = ref<any>(null)
const handleExport = () =>{
  console.log('点击下载')
  const pageHeight = Math.floor(277 * _pdf.value.scrollWidth / 190) //计算pdf高度
  downloadPDF(_pdf.value, document.getElementsByClassName('item'), _batch.value + '_' + getTime(0), 30, 30, pageHeight)
}


// *********************************  数据 start   ***********************************************
// 处理历史记录数据
interface IItem {
  _info: {
    _process: string, // 工序
    _name: string, // 姓名
    _date: string, // 日期
  },
  _table: Array<IQICTableData>
}
const win:any = window
const { TABLE_SET } = win
const _processAll = ref<any>('') // 工序
// const _pdfConentList = ref<Array<IQICTableData>>()
const _pdfList = ref<Array<IItem>>([])
// 设置工序
const setProcess = ()=>{
  TABLE_SET.forEach((v: any) => {
    if (v._name === props._tableList![0].table_Name) {
      _processAll.value = v._select
    }
  })
}

// 设置OK
const setOK = (_table:Array<IQICTableData>, params:string)=>{
  // 1、裁切ok
  let arr = params.split('-')
  arr.pop() // 去掉最后一个

  // 2、特殊情况 Inditex

  // 3、修改
  let it
  arr.forEach((v, i:number)=>{
    it = v.split(':')
    if (it[1] === '1') {
      _table[i].results = 'OK'
    } else if (it[1] === '2') {
      _table[i].results = 'NOT OK'
    } else if (it[1] === '3') {
      _table[i].results = 'N/A'
    } else {
      _table[i].results = ''
    }
  })
}

// 处理记录数据
const mangerRecord = ()=>{
  console.log('处理历史记录数据')
  // console.table(props._tableList)
  // console.table(props._tableContent)
  // console.table(TABLE_SET)
  // 1、获取工序
  setProcess()
  console.table(_processAll.value)

  _batch.value = props._tableList![0].batch

  // 2、遍历记录
  let item:IItem = {
    _info: {
      _process: '',
      _name: '',
      _date: ''
    },
    _table: []
  }
  // let index:number = -1 // 工序对象的下标
  props._tableList?.forEach((v:IQICRecord)=>{
    // 添加一些基础信息
    item._info._process = v._process
    item._info._name = v.cN_Name
    item._info._date = v.create_Time
    // 处理表OK内容
    setOK(props._tableContent, v.params)

    // 添加表工序内容
    // 使用some数组方法可以跳出循环
    _processAll.value.some((v1:any)=>{
      if (v1._title === v._process) {
        // 必须深拷贝, 由于没有什么map + symbol 等，可以使用JSON 深拷贝
        item._table = JSON.parse(JSON.stringify(props._tableContent.slice(v1.start - 1, v1.end)))
        _pdfList.value?.push(item)
        return true
      }
    })
    item = {
        _info: {
        _process: '',
        _name: '',
        _date: ''
      },
      _table: []
    }

  })

  // 显示
  // console.log(_pdfList.value)
  // _pdfList.value.forEach(v=>{
  //   console.log(`工序: ${v._info._process} 姓名: ${v._info._name} 日期: ${v._info._date}`)
  //   console.table(v._table)
  // })
  
}
mangerRecord()
// *********************************  数据 end   ***********************************************
const headerRowStyle = () => {
  return {
    color: '#fff',
  }
}
const rowStyle = () => {
  return {
    color: '#000',
    backgroundColor: '#fff',
    // fontSize: '14px'
  }
}
</script>

<template>
  <div>
    <el-button round type="primary" @click="handleExport">导出</el-button>
    <div ref="_pdf" class="ex-pdf-box">
      <div v-for="v in _pdfList" :key="v._info._name" class="item">
        <!-- 表工序 -->
        <div class="box-head">
          <div>{{v._info._process}}</div>
          <div>{{v._info._name}}</div>
          <div>{{v._info._date}}</div>
        </div>
        <!-- 表内容 -->
        <el-table
          :header-row-style="headerRowStyle" :row-style="rowStyle"
          :data="v._table" :border="true" size="small" style="width: 100%" :highlight-current-row="true">
          <el-table-column prop="process" label="过程" width="80" header-align="center" />
          <el-table-column prop="number" label="编号" width="51" align="center" />>
          <el-table-column prop="risk_level" label="风险等级" width="51" align="center" />
          <el-table-column prop="inspection_items" label="检查项目" header-align="center" />
          <el-table-column prop="inspection_frequency" label="检查频率" width="100" header-align="center" />
          <el-table-column prop="method" label="检查方法/仪器" width="130" header-align="center" />
          <el-table-column prop="results" label="检查结果" width="51" header-align="center" align="center" />
        </el-table>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.ex-pdf-box {
  color: #000;
  font-size: 16px;
  // font-weight: lighter;
  padding: 0 60px;
}
// 表标题
/deep/.el-table thead th {
  font-weight: 500;
}
.box-head {
  display: flex;
  padding-top: 10px;
  >div {
    margin-right: 20px;
  }
}
</style>