// QIC 表数据

import { Ref, onMounted, onUnmounted, onUpdated, ref, watch } from "vue"
import { IQICRecord, IQICTableData } from "../../../tools/interface/iQicData"
import { GetTableJson } from "../../../tools/api/staticApi"
import { messageError } from "../../../tools/element-plus/SBMessage"

import { useQirPinia } from '../../../store/qir'
import { _isTimerToWithin, closeSB_Interval, getTime, startSB_Interval, timerToSecond } from "../../../tools/utils/sb_time"
import { hideLoading, showLoading } from "../../../tools/element-plus/JHLoading"


function _tableHooks(tableName:Ref<string>, InditexValue:Ref<string>) {
  const win:any = window
  const { TABLE_NAME, TABLE_SET, OUT_T } = win
  const qicStore = useQirPinia()

  let _tableData = ref<Map<string, Array<IQICTableData>>>(new Map())
  // let tableName = ref<string>('Thermal')
  let tableName_Array = ref<Array<string>>([...TABLE_NAME])

  let QTYInterval = ref<NodeJS.Timer | null>()
  let _timer = ref<number>(0) // 计时，如果 qty > 7500 开启定时器，半小时后解禁
  // let _procedure = ref<string>('') // 工序

  let _tableContent = ref<Array<IQICTableData>>([]) // 表格内容
  let _filterTableContent = ref<Array<IQICTableData>>([]) // 表格内容
  let _tableProcedure = ref<Array<{
    _title: string,
    start: number,
    end: number
  }>>() // 工序列表

  // 获取表格数据（所有）
  const _getTContent = ()=> {

    // 1、判断文件
    if (tableName_Array.value.length === 0) {
      messageError('表名异常，可能删除了publicjs文件')
      return
    }

    // 2、获取所有表格内容
    tableName_Array.value.forEach(v=>{
      if (!_isTableData(v)) { // 判断是否有表格数据
        GetTableJson(v).then((res:any)=>{
          _tableData.value.set(v, res.data)
          // // 初始化第一次
          // if (v === tableName.value) {
          //   _getOneTableContent()
          // }
        }).catch(()=>{
          console.error(new Error('获取表格数据异常'))
        })
      }
    })
  }


  // 判断Map是否有表格数据
  const _isTableData = (_tableName: string) => {
    if (_tableData.value.has(_tableName)) {
      return true
    }
    return false
  }

  // 重置表格数据
  const _resetTableData = () => {
    _tableData.value.get(qicStore.tableName)!.forEach((item: any, index: number) => {
      item.isDisabled = false
      item.results = ''
      item.index = index
    })

    // 设置targe
    if(qicStore.tableName.indexOf('Thermal') !== -1) { // target
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
        _tableData.value.get(qicStore.tableName)![9].results = ''
        _tableData.value.get(qicStore.tableName)![9].isDisabled = true
      }
    }
  }

  // 禁用
  const _disabledTable = ()=>{
    _tableData.value.get(qicStore.tableName)!.forEach((item: any) => {
      item.isDisabled = true
    })
  }

  // ****************  单个表格start  ***********************
  // 初始化
  const _initOneTable = () => {
    // 1、获取表格内容
    if (!_isTableData(qicStore.tableName)) { // 判断是否有表格数据
      showLoading()
      GetTableJson(qicStore.tableName).then((res:any)=>{
        _tableData.value.set(qicStore.tableName, res.data)

        // 2、赋值第一个表格内容 工序
        _getOneTableContent()

        // 4、过滤 初始化第一个
        _filterTable(qicStore.processArr[0])

        hideLoading()

      }).catch(()=>{
        console.error(new Error('获取表格数据异常'))
        hideLoading()
      })
    }
  }

  // 赋值单个表格内容 和工序
  const _getOneTableContent = () => {

    // console.log(tableName.value)
    // if (tableName.value === 'Thermal/default' || tableName.value === '_default') {
    //   tableName.value = 'Thermal'
    // }
    // console.log(tableName.value)
    console.log(qicStore.tableName)

    // 赋值单个表格内容
    _tableContent.value = _tableData.value.get(qicStore.tableName) || []
    // console.table(_tableContent.value)

    // 获取工序
    TABLE_SET.forEach((v: any) => {
      if (v._name === qicStore.tableName) {
        _tableProcedure.value = v._select
      }
    })

    // 初始化表格数据
    _tableContent.value?.forEach((item: any, index: number) => {
      item.isDisabled = false
      item.results = ''
      item.index = index
    })

    // 处理targe
    // if(tableName.value.indexOf('Thermal') !== -1) { // target
    //   if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
    //     if (qicStore.queryForm.procedure === '印刷') {
    //       _tableContent.value![9].results = ''
    //       _tableContent.value![9].isDisabled = true
    //     }
    //   }
    // }
  }

  // 过滤，工序
  const _filterTable = (_name:string='') => {

    // 1、赋值数据
    _tableContent.value = _tableData.value.get(qicStore.tableName) || []
    // 2、默认全部
    if (_name === '') {
      _filterTableContent.value = _tableContent.value
      return
    }

    // 3、过滤
    _filterTableContent.value = []
    _tableProcedure.value?.some((v: any) => {
      if (v._title === _name) {
        _filterTableContent.value = _tableContent.value?.slice(v.start - 1, v.end)
        return true
      }
    })

    // 4、targe 监听器那个也不要关
    if (_name === '印刷' || _name === '') {
      if(qicStore.tableName.indexOf('Thermal') !== -1) {
        if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
          _tableContent.value![9].results = ''
          _tableContent.value![9].isDisabled = true
        }
      }
    }
    // console.log(_name)
    // console.table(_tableProcedure.value)
    // console.table(_tableContent.value)
    // console.table(_filterTableContent.value)

  }

  // 重置单个表格内容
  const _resetContent = ()=>{
    console.log('重置 单个表格内容')
    _tableContent.value?.forEach((item: any, index: number) => {
      item.isDisabled = false
      item.results = ''
      item.index = index
    })

    // 设置targe
    if(qicStore.tableName.indexOf('Thermal') !== -1) { // target
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
        if (qicStore.queryForm.procedure === '印刷') {
          _tableContent.value![9].results = ''
          _tableContent.value![9].isDisabled = true
        }
      }
    }
  }

  // 先这样 2024-01-15 复用
  // 处理表名
  const tableNameHandle = (tableName:string) =>{
    // console.log(tableName)
    _tableContent.value = _tableData.value.get(tableName) || []
    _tableProcedure.value?.some((v: any) => {
      if (v._title === qicStore.queryForm.procedure) {
        _filterTableContent.value = _tableContent.value?.slice(v.start - 1, v.end)
        return true
      }
    })
  }

  // 禁用单个表格数据
  const _disabledOneContent = ()=>{
    console.log('禁用单个表')
    _tableContent.value?.forEach((item: any) => {
      item.isDisabled = true
    })
  }
  

  // 中检的一些禁用: flag = true禁用 false: 解禁
  const middleCheck = (flag: boolean = true)=>{
    console.log('是否禁用: ', flag)
    _filterTableContent.value?.forEach((v:any)=>{
      if (v.process.indexOf('过程检查')!==-1) {
        v.isDisabled = flag
      }
    })
    // console.table(_filterTableContent.value)
  }
  
  // 半小时后解禁
  const _30Minute = ()=>{
    // (1) 参数设置获取
    _timer.value += 5 // 步进值：多少秒执行一次
    const currentTime = getTime(1) // 当前时间 hh:mm:ss
    const createTime = qicStore.recordObj.create_Time.split(' ')[1] || ''
    const step:number = +OUT_T.OUT_STEP // 多长时间（秒）下班时间左右，创建时间+step
    console.log('创建时间: ' + createTime, '当前时间: ' + currentTime, '多久解禁: ', step , '计时: ', _timer.value)

    // (2) 判断创建时间
    if (_createdTime(currentTime, createTime, step)) return

    // (3) 判断下班时间 下班半小时左右内解禁 下班的时间，间隔多少秒解禁, 左右判断 在public中
    if (_offTimer(currentTime, step)) return

    // (4) 判断 切换 DJ 半小时定时器
    if (_timer.value >= step) {
      // 关闭定时器
      closeSB_Interval(QTYInterval, '超过半小时 中检定时器')
      // 解禁
      middleCheck(false)
    }
  }

  /** 下班时间左右解禁
   * 
   * @param currentTime 当天系统时间
   * @param step 
   * @returns true：在其中一个下班时间左右内
   */
  const _offTimer = (currentTime:string, step:number):boolean=>{
    let flag:boolean = false
    OUT_T.OUT_TIMER.forEach((v:string) =>{
      console.log(currentTime, v, step)
      if (_isTimerToWithin(currentTime, v, step, OUT_T.OUT_B)) { // 如果在
        // 解禁
        middleCheck(false)
        // 关闭定时器
        closeSB_Interval(QTYInterval, '中检(下班半小时左右)定时器')
        flag = true
      }
    })
    return flag
  }

  /** 判断创建时间,是否大于当天时间 + 半小时
   * 
   * @param currentTime 当前时间
   * @param createTime 创建时间
   * @param step 多久解禁
   * @returns true：超过当前时间(或者没有创建时间)，false：没有超过当前时间
   */
  const _createdTime = (currentTime:string, createTime:string, step:number):boolean=>{
    console.log('判断创建时间,是否大于当天时间 + 半小时')
    if (createTime === '') return false
    if(_isTimerToWithin(currentTime, createTime, step, 2)) { // 如果没有超过
      console.log('没有超过')
      _timer.value = timerToSecond(currentTime)-timerToSecond(createTime)
      console.log(_timer.value)
      return false
    } else { // 如果超过
      console.log('超过')
      // 解禁
      middleCheck(false)
      // 关闭定时器
      if (QTYInterval !== null) closeSB_Interval(QTYInterval, '创建时间超过半小时,取消定时器,创建时间: ' + createTime + ', 当前时间: ' + currentTime)
      _timer.value = 0
      return true
    }
  }


  // 渲染表
  const _renderingTable = (record:IQICRecord)=>{
    console.log('渲染表')
    console.table(record)
    
    // 设置表数据
    tableNameHandle(record.table_Name)
    // console.table(_tableContent.value)
    console.table(_filterTableContent.value)

    // (1) 设置表名
    qicStore.tableName = record.table_Name

    // (2) 裁切params
    let arr = record.params.split('-')
    arr.pop() // 去掉最后一个

    // (3) 特殊情况 Inditex Inditex
    if (record.table_Name === 'Inditex') {
      console.log('特殊项 ==> ', record.table_Name)
      InditexValue.value = arr[0].split(':')[1]
      arr.shift() // 删除第一个
      console.log(arr)
      // // 每一项减去1
      // let it:Array<string> = []
      // arr.forEach( (v:string) => {
      //   it = v.split(':')
      //   v = (+it[0] - 1) + ':' + it[1]
      // } )
    }
    console.log(arr)

    // (4) 如果是领班登录
    let it:Array<string> = []
    if (qicStore.isForemanLogin) {
      console.log('领班登录')
      _tableContent.value?.forEach((item:IQICTableData, index: number)=>{
        it = arr[index].split(':')
        item.isDisabled = false
        if (it[1] === '0') item.results = ''
        else item.results = it[1]
      })
    }
    else { // (6) 修改OK-不是领班登录
      if (record.state === '1') { // 如果是已完成
        console.log('已完成')
        _tableContent.value?.forEach((item:IQICTableData, index: number)=>{
          it = arr[index].split(':')
          item.isDisabled = true
          if (it[1] === '0') item.results = ''
          else item.results = it[1]
        })
      }
      else { // 如果是未完成
        console.log('未完成')
        _tableContent.value?.forEach((item:IQICTableData, index: number)=>{
          // console.log(arr[0])
          // console.log(item)
          it = arr[index].split(':')
          item.isDisabled = true
          if (it[1] === '0') item.results = ''
          else item.results = it[1]
        })
      }
    }

    // (7) 如果是当天
    if (qicStore.queryForm._date === getTime(0)) {
      console.log('渲染 当天')
      _tableContent.value?.forEach((item:IQICTableData)=>{
        item.isDisabled = false
      })
    }

    // (8) targe
    if(qicStore.tableName === 'Thermal') { // target
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('TARG') === -1) {
        console.log('渲染 不是TARG')
        _tableData.value.get(qicStore.tableName)![9].results = ''
        _tableData.value.get(qicStore.tableName)![9].isDisabled = true
      }
    }

    // (9) 如果是定时器的 被重置了，再设置一次 为什么要注释，待测(首次重置了, 但是开了注释，创建时间超过了要被禁用)
    // if (QTYInterval !== null && +qicStore.queryForm.qty > 7500 && qicStore.isCurrentDayRecord === 2 && qicStore.isForemanLogin !== true) {
    //   console.log('渲染 定时器')
    //   middleCheck(true)
    // }

    console.table(_tableContent.value)
  }

  // 重置单个工序内容
  // const _resetProcedureTble = ()=>{}

  // ****************  单个表格 end  ***********************

  // 监听 工序变化
  watch(()=>qicStore.queryForm.procedure, (newVal, oldVal) => {
    // console.log('**********  工序变化了 *************')
    if (newVal!== oldVal) {
      _filterTable(newVal)
    } else if (newVal === '') {
      _filterTable()
    }
  })
  // 监听 表名 变化
  watch(()=>qicStore.tableName, (newVal, oldVal) => {
    console.log("****** 表名变化了 **********")
    console.log(newVal, oldVal)
    if (newVal!== oldVal) {
      _getOneTableContent()
      _filterTable(qicStore.queryForm.procedure)
    }
    else if (newVal === oldVal) // 表名相同，重置表内容
    {
      _resetContent()
    }
  })

  // 监听 targe 
  watch(()=>qicStore.queryForm.rbo, (newVal, oldVal)=>{
    console.log('*********** tbo tableHooks  ***************')
    console.log(newVal, oldVal, qicStore.tableName.indexOf('Thermal')!== -1, qicStore.queryForm.procedure, newVal.toUpperCase().indexOf('TARG') === -1)
    if (newVal !== oldVal && newVal !== '') {
      if (qicStore.tableName.indexOf('Thermal') !== -1 && qicStore.queryForm.procedure === '印刷') {
        if (newVal.toUpperCase().indexOf('TARG') === -1) { // 如果不是tage，并且是 Thermal 印刷
          _tableContent.value![9].results = ''
          _tableContent.value![9].isDisabled = true
        }
      }
    }
  })

  // 监听 isCurrentDayRecord qty
  watch(()=>[qicStore.isCurrentDayRecord, qicStore.queryForm.qty], ([crNewVal, qtyNewVal],[crOldVal, qtyOldVal])=>{
    console.log('**************监听 isCurrentDayRecord,qty (table hooks)**************')
    console.log(crNewVal, crOldVal, qtyNewVal, qtyOldVal, qicStore.queryForm.procedure, qicStore.isForemanLogin)
    // 两个监听器 不要设置 crNewVal !== crOldVal && qtyNewVal !== qtyOldVal
    if (crNewVal === 2 || crNewVal === 4) {
      if (qicStore.queryForm.procedure === '印刷' && qicStore.isForemanLogin === false){
        if (+qtyNewVal > 7500) {
          // 首次 判断
          const currentTime = getTime(1) // 当前时间 hh:mm:ss
          const createTime = qicStore.recordObj.create_Time.split(' ')[1] || ''
          const step:number = +OUT_T.OUT_STEP // 多长时间（秒）下班时间左右，创建时间+step
          console.log('创建时间: ' + createTime, '当前时间: ' + currentTime, '多久解禁: ', step , '计时: ', _timer.value)
          // (1) 创建时间 + 半小时 大于当前时间
          if (_createdTime(currentTime, createTime, step)) return
          // (2) 下班时间 左右半小时
          if (_offTimer(currentTime, step)) return
  
          console.log('开启定时器')
  
  
          // (3) 开启定时器 (当天记录 大于7500 印刷工序, 领班没有登录)
          _timer.value = 0
          QTYInterval = startSB_Interval(_30Minute, 5, true) // 方法，步进值：多少秒执行一次，true：立即执行一次
          middleCheck(true)
        } else {
          middleCheck(false)
          if (QTYInterval !== null) closeSB_Interval(QTYInterval, '小于7500 没有开启中检定时器')
        }
      }
    }
    else if (crNewVal === -1) {
      // middleCheck(false)
      if (QTYInterval !== null) closeSB_Interval(QTYInterval, '不是今天的记录 没有开启中检定时器')
    }
  })

 

  // 监听qty 变化 中捡 qty(变化是在orderhooks中dj监听器) 有问题：qicStore.isCurrentDayRecord = -1 代码的执行顺序 ,所以执行监听：qicStore.isCurrentDayRecord
  // watch(()=>qicStore.isCurrentDayRecord, (newVal, oldVal)=>{
  //   console.log('**************监听 isCurrentDayRecord (table hooks)**************')
  //   console.log(newVal, oldVal, qicStore.queryForm.procedure, qicStore.isForemanLogin, qicStore.queryForm.qty)
  //   if (newVal !== oldVal && newVal === 2 ) {
  //     if (+qicStore.queryForm.qty > 7500 && qicStore.queryForm.procedure === '印刷' && qicStore.isForemanLogin === false) {
  //       middleCheck(true)
  //       // 开启定时器
  //       _timer.value = 0
  //       QTYInterval = startSB_Interval(_30Minute, 5, true) // 方法，步进值：多少秒执行一次，true：立即执行一次
  //     } else {
  //       middleCheck(false)
  //       if (QTYInterval !== null) closeSB_Interval(QTYInterval, '没有开启中检定时器')
  //     }
  //     // 领班没有禁用，下班前半小时取消禁用，禁用时间：切换dj 和 创建时间(待写)分开判断，如果创建时间大于半小时，取消禁用，
  //     // 下班前半小时取消禁用
  //     // 待写：创建时间
  //   } else {
  //     console.log('没有开启中检定时器')
  //   }
  // })

  // 还是有点问题，切换dj无效 ，故写两个监听器(有问题)：crNewVal !== crOldVal && qtyNewVal !== qtyOldVal

  // 监听qty 变化 中捡 qty(变化是在orderhooks中dj监听器) 有问题：qicStore.isCurrentDayRecord = -1 代码的执行顺序 ,所以执行：qicStore.isCurrentDayRecord
  // watch(()=>qicStore.queryForm.qty, (newVal, oldVal)=>{
  //   console.log('**************监听 qty (table hooks)**************')
  //   console.log(newVal, oldVal, qicStore.queryForm.procedure, qicStore.isForemanLogin, qicStore.isCurrentDayRecord)
  //   if (newVal !== oldVal && newVal !== '') { // && qicStore.isCurrentDayRecord === 1
  //     if (qicStore.queryForm.procedure === '印刷' && qicStore.isForemanLogin === false && qicStore.isCurrentDayRecord === 2) { // 必须是当天的记录才有效
  //       if (+newVal > 7500) {
  //         middleCheck(true)
  //         // 开启定时器
  //         _timer.value = 0
  //         QTYInterval = startSB_Interval(_30Minute, 5, true) // 方法，步进值：多少秒执行一次，true：立即执行一次
  //       } else {
  //         middleCheck(false)
  //         if (QTYInterval !== null) closeSB_Interval(QTYInterval, '没有开启中检定时器')
  //       }
  //     }

  //     // 领班没有禁用，下班前半小时取消禁用，禁用时间：切换dj 和 创建时间(待写)分开判断，如果创建时间大于半小时，取消禁用，
  //     //  下班前半小时取消禁用
  //     // 待写：创建时间
  //   }
  // })

  // 监听当天的记录，判断是否完成，如果是完成，禁用
  // watch(()=>qicStore.isCurrentDayRecord, (newVal, oldVal)=>{
  //   if (newVal !== oldVal && newVal !== -1) {
  //     if (newVal === 2) {
  //       _disabledOneContent()
  //     } else if (newVal === 0 && qicStore.isRecord === 1) { // 不是当天的也禁用
  //       _disabledOneContent()
  //     }
  //   }
  // })

  // 模拟生命周期
  onMounted(()=>{
    console.log('hooks onMounted')
    // setSB_Interval(1, 10, 1)
  })

  onUpdated(()=>{
    console.log('hooks onUpdated')
  })

  onUnmounted(()=>{
    console.log('hooks onUnmounted')
    if (QTYInterval !== null) closeSB_Interval(QTYInterval, '中检定时器') // 关闭定时器
  })


  return {
    _tableData,
    tableName,
    tableName_Array,
    _getTContent,
    _resetTableData,
    _disabledTable,
    _getOneTableContent,
    _initOneTable, _resetContent, _disabledOneContent, _filterTableContent, _tableContent, _renderingTable
  }

}


export default _tableHooks