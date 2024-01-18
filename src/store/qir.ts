import { defineStore } from 'pinia'
import { ref } from 'vue'

// import type { IIpData } from '../utils/interface/Iqic'
// import { SIP, SOCK } from '../assets/js/variable'

// 接口
// import { IQueryQICForm } from '../utils/interface/Iqic'
// import type { ICamera } from '../utils/interface/IImage'

// import { getTime } from '../utils/sb_time'
// import { IForemanInfo } from '../utils/interface/Iuser'
// 接口
import type { IIpRes, IQICRecord, IQueryQICForm } from '../tools/interface/iQicData'
import type { IQicUserRes } from '../tools/interface/iUserData'
import type { ICamera } from '../tools/interface/iFileData'

// API
import { getTime } from '../tools/utils/sb_time'


/** 搜索框数据
 * 
 */
let queryForm = ref<IQueryQICForm>({
  batch: '',
  DJ: '',
  jobNumber: 80,
  rbo: '',
  internalItem: '',
  _name: '',
  type: '',
  machineNo: '',
  _date: getTime(0),
  procedure: '',
  qty: '' // 单个dj的qty
})

// IP信息参数
const ipData = ref<IIpRes>({
  ip: '', // ip
  machine_no: '', // 机台号
  type: '', // 组
  updata_time: '', // 更新时间
  process_selection: '' // 工序选择
})

// 用户登录信息
const qicUser = ref<IQicUserRes>({
  employeeName: '', // 姓名
  employeeNo: '', // 工号
  level: '',
  token: '' // token
})

/** 记录数据
 * 
 */
const recordObj = ref<IQICRecord>({
  uuid: '', // uuid
  batch: '', // 单号
  rbo: '', // 客户
  table_Name: '', // 表名
  params: '', // OK:格式：1-2-1-2-4...
  state: '', // 状态 0:未完成，1：已完成
  employee: '', // 工号
  cN_Name: '', // 姓名
  create_Time: '', // 创建时间
  _process: ''
})

/** 工序列表
 * 
 */
const processArr = ref<Array<string>>([])

// 摄像头信息
const cameraArr = ref<Array<ICamera>>([])

const qtyMap = ref<Map<string, string>>(new Map())

export const useQirPinia = defineStore('Main', {
  state () {
    let orderData = {
      batch: '',
      internalItem: '',
      otc: []
    }
    return {
      isStart: false, // 是否是工作中，true：是
      /*
        是否显示PDF界面
      */
      isShowPDF: true,
      /*
        是否是查询的质量检测表
          true: 是, false: 不是
          true: 就是只能查看,不能修改
        true: 搜索订单出来的都设置
        false: 自动加载,按单加载
      */
      isQuery: false,
      orderData, // 订单信息
      qir_table: [], // 暂时的检查表数据

      isShowLogin: false, // 是否显示登录界面，true：显示，false：没有显示
      isForemanLogin: false, // 是否是领班登录，true：登录，false：没有登录

      ipData, // ip数据
      isIP: false, // 是否存在IP信息，true：是，false：不是
      queryForm, // 查询表单数据
      tableName: 'Thermal', // 表名
      isResetTbale: -1, // 是否重置表内容，-1:初始值,0:重置,1:不重置

      isShowView: 0, // 是否显示右侧: -1: 隐藏右边视图，0：隐藏所有的子模块（如PDF，拍照，录音，视频，表格等）, 1：显示PDF, 2: 显示生产留言拍照
      img_state: 0, // 显示视图：3：生产留言，4：清线留样
      img_status: 0, // 显示视图：3：生产留言，4：清线留样 当员工，点击图片，点击上传时，触发
      pdf_url: '', // pdf路径(显示的那个)
      isCameraOnFirstCheck: false, // 是否启动摄像头（首检）true: 开启，false：关闭
      // isUploading: false, // 是否正在上传中, true: 是，false：否
      uuid: '', // 上传后传递的uuid
      cameraArr, // 摄像头数组
      selectCamer: '', // 选择的摄像头

      isBatch: -1, // 单号是否有效，-1：默认值，0：无效，1：有效
      isRecord: -1, // 是否有记录，0：无记录，1：有记录
      isCurrentDayRecord: -1, // 是否是当天记录 默认: -1 ,0：是当天的已完成，1：不是当天的已完成，2：是当天的未完成，3：不是当天的未完成, 4:大单，多天记录
      isDisabledLeft: -1, // 是否禁用左边的 -1：默认值，0：不禁用，1：禁用
      qicUser, // 用户信息
      recordObj, // 记录数据(一条)
      processArr, // 工序信息
      qtyMap
    }
  },
  getters: {
    // getPdfUrl ():string {
    //   console.log(SIP + ':' + SOCK + '/paf' + this.pdf_url)
    //   // //http://147.121.223.2:8080/pdf/ADNLNPAC01_1UPS_LOA_Docs.pdf
    //   console.log(SIP + ':' + SOCK + '/paf' + this.pdf_url)
    //   return SIP + ':' + SOCK + '/paf' + this.pdf_url
    // }
  },
  actions: {
    // 重置记录
    resetRecord () {
      this.recordObj = {
        uuid: '', // uuid
        batch: '', // 单号
        rbo: '', // 客户
        table_Name: '', // 表名
        params: '', // OK:格式：1-2-1-2-4...
        state: '', // 状态 0:未完成，1：已完成
        employee: '', // 工号
        cN_Name: '', // 姓名
        create_Time: '', // 创建时间
        _process: ''
      }
    }
  }
})
