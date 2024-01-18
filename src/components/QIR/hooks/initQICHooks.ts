// 初始化QIC
import { ref } from 'vue'
import { useQirPinia } from '../../../store/qir'
import { GetIP, GetQICFiveRecord } from '../../../tools/api/qicApi'
import { messageError, messageWarning } from '../../../tools/element-plus/SBMessage'
import { IQICFiveRecord } from '../../../tools/interface/iQicData'

function _useInitQICHooks () {
  const win:any = window
  const { TABLE_PROCESS } = win
  const qicStore = useQirPinia()
  // 最近5条记录
  let _fiveData = ref<Array<IQICFiveRecord>>([])

  /**
   * 初始化一些参数，假设有多个模块，可能需要初始化pinia
   */
  const initVar = ()=>{
    qicStore.isBatch = -1
    qicStore.isRecord = -1
    qicStore.isCurrentDayRecord = -1
    qicStore.isShowView = 0
    qicStore.processArr = TABLE_PROCESS
  }

  /** 获取IP信息
   * 
   * @param _getFiveRecord 获取5条历史记录 函数
   */
  const getIPInfo = (_getFiveRecord: Function)=>{
    GetIP().then((res:any)=>{
      console.log(res)
      if (res.data === '' || res.data === undefined) {
        messageWarning('该机台没有IP信息, 请联系领班')
        qicStore.isIP = false
      } else {
        // 2、数据处理
        handleIP(res)

        // 3、获取5条历史记录
        _getFiveRecord()
  
      }
    }).catch((err:any)=>{
      console.error(err)
      messageError('服务器异常')
      qicStore.isIP = false
      // 假设没有IP信息，弹框，并且，手动设置工序信息
      // ... 代做
    })
  }

  /** 获取5条历史记录
   *
   */
  const getFiveRecord = ()=>{
    GetQICFiveRecord().then((res:any)=>{
      // (1) 赋值
      _fiveData.value = res.data
      // (2) 将单号转换为大写
      _fiveData.value.forEach(v=>{
        v.batch = v.batch.toUpperCase()
      })
      // (3) 翻转
      _fiveData.value.reverse()
      // console.table(_fiveData.value)
    }).catch((err:any)=>{
      console.error(err)
    })
  }

  /** IP信息处理
   * 
   * @param res 
   */
  const handleIP = (res:any)=>{
    qicStore.ipData = res.data // 保存IP信息
    qicStore.queryForm.type = res.data.type // 赋值组别
    qicStore.queryForm.machineNo = res.data.machine_no // 赋值机台
    qicStore.queryForm.procedure = res.data.process_selection // 赋值工序
    qicStore.isIP = true // 有IP信息 // 谷歌开发时，没有绑定到组别，机台等，部署时，可以绑定的
    console.table(qicStore.queryForm)
  }

  const _init = () =>{
    // 1、初始化参数
    initVar()

    // 2、IP信息获取 和 获取 5条历史记录
    getIPInfo(getFiveRecord)
  }
  return {
    _init, _fiveData
  }
}

export default _useInitQICHooks