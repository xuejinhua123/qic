<!-- 中间模块 -->
<script setup lang="ts">
// vue3
import { onBeforeMount, onMounted, ref, watch } from 'vue'
import { PDF_URL, SERVER_URL_SHOW_IMG } from '../../tools/request/qicVar'

// 模块
import ForemanLogin from '../../components/QIR/ForemanLogin.vue'
import SpecialRequest from '../../components/QIR/SpecialRequest.vue'
import UploadImage from '../../components/QIR/UploadImage.vue'
import EPCModel from '../../components/QIR/EPCModel.vue'
import UploadQICFile from '../../components/QIR/UploadQICFile.vue'
import UpdateIP from '../../components/QIR/UpdateIP.vue'
import UpdateItem from '../../components/QIR/UpdateItem.vue'


// api
import { GetPDF } from '../../tools/api/qicApi'
import { deleteImgByUuid } from '../../tools/api/fileApi'


// 工具
import bus from '../../store/mitt'
import { deleteLocalStorage } from '../../tools/utils/cache'

// 接口
// import type { IForemanInfo } from '../../utils/interface/Iuser'
// import type { IImage } from '../../utils/interface/IImage'

// element-plus
import { messageSuccess } from '../../tools/element-plus/SBMessage'

// hooks
import _getImageHooks from '../../components/QIR/hooks/getImgHooks'
// pinia
import { useQirPinia } from '../../store/qir'
import { IImage } from '../../tools/interface/iFileData'



const qicStore = useQirPinia()
const { _qualityStandardList, _complainCaseList, _produceImgList, _lineImgList } = _getImageHooks()



// ****************** 变量 ******************************
let condition = ref<string>('') // 注意核对DIT\n注意核对Format\n注意核对可变信息\n

// PDF
let pdfUrls = ref<Array<string>>([]) // 获取的数据(PDF)
let activePdfUrl = ref<number|string>('') // 默认激活第一个PDF
// let showPdfs = ref<Array<string>>([]) // 显示的pdf数据
let pdfHintInfo = ref<string>('没有PDF文件...')



// 首次启动
// const init = () => {
//   // console.log('启动init')

//   // 获取摄像头信息
//   // getCameraCount()
// }

// const isResetPad = ref<boolean>(false) // 是否显示重置密码，true：显示

// 质量标准数据
// const qualityStandard = [
//   {
//     id: 1,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 2,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 3,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 4,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 5,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 6,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 7,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 8,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   },
//   {
//     id: 9,
//     small_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//     large_img: 'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg'
//   }
// ]

// 质量标准数据
// const qualityStandard = [
//   {
//     id: 0,
//     small_img: 'http://147.121.223.2:8848/images/EF-ORM.PNG',
//     large_img: 'http://147.121.223.2:8848/images/EF-ORM.PNG',
//     title: '线'
//   },
//   {
//     id: 0,
//     small_img: 'http://147.121.223.2:8848/images/EF-ORM.PNG',
//     large_img: 'http://147.121.223.2:8848/images/EF-ORM.PNG',
//     title: '不清晰'
//   }
// ]
// 投诉案例数据
// const complaint = [
//   {
//     id: 0,
//     small_img: 'http://147.121.223.2:8848/images/EF-ORM.PNG',
//     large_img: 'http://147.121.223.2:8848/images/EF-ORM.PNG',
//     title: '少数'
//   },
//   {
//     id: 0,
//     small_img: '',
//     large_img: '',
//     title: '不可读'
//   }
// ]

// 生产留样数据
let wordsImgList = ref<IImage[]>([])
// 清线留样数据
let lineImgList = ref<IImage[]>([])


// 点击图片，显示弹框
const dialogImageUrl = ref<IImage>({ id: 0, uuid: '', small_img: '', large_img: '', status: 0 }) // status: 3 生产留样，4：清线留样
const dialogVisible = ref(false)

// 点击修改，显示弹框，用来操作特殊要求，质量标准，投诉案例
const isShowUpdateQIC = ref<boolean>(false)
const isShowUploadQICFile = ref<boolean>(false)
const isShowItem = ref<boolean>(false)

const isUpdateIP = ref<boolean>(false) // 弹框 修改IP 设置机台


// *****************方法******************************

// 获取特殊要求，测试：5-602741-BWH-00
// const getSpecial = async () => {
//   console.log('qicStore.queryForm.internalItem ==> ', qicStore.queryForm.internalItem)
//   if (qicStore.queryForm.internalItem === '') {
//     return
//   }
//   const results = await GetSpecialFormatText(qicStore.queryForm.internalItem)
//   // .split('[默认]')[1]
//   condition.value = results.special
// }
// getSpecial()

// 获取PDF，测试：NSB10865171
const getPDFByBatch = async () => {
  // console.log('qicStore.queryForm.batch 获取PDF ==> ', qicStore.queryForm.batch)
  // // 这个只能过滤空值，如果batch变化，不能过滤，必须在batch输入框那边重新设置一个值，监听到pinia中，否则有问题
  // if (qicStore.queryForm.batch === '') return
  // const results = await GetPDF(qicStore.queryForm.batch)
  // pdfUrls.value = []
  // pdfUrls.value = results.data

  // // 反转
  // pdfUrls.value = pdfUrls.value.reverse()

  // console.table(pdfUrls.value)

  // if(results.data === undefined) pdfUrls.value = []
  console.log('获取PDF ==> ', qicStore.queryForm.batch)
  pdfUrls.value = []
  if (qicStore.queryForm.batch === '') return
  GetPDF(qicStore.queryForm.batch).then((res:any)=>{
    console.log(res)
    if (res.data.length > 0) {
      pdfUrls.value = res.data
      // 反转
      pdfUrls.value = pdfUrls.value.reverse()

      // 设置第一个
      qicStore.isShowView = 1
      qicStore.pdf_url = PDF_URL + pdfUrls.value[0]
      activePdfUrl.value = 0
    } else {
      qicStore.isShowView = -1
    }
    
  }).catch((err:any)=>{
    console.error(err)
    if (qicStore.orderInfo.typesettingMethod === 'GPM')
    {
      pdfHintInfo.value = '请查看电子工单上的layout稿图文件'
    }
    else
    {
      pdfHintInfo.value = '没有PDF文件...'
    }
  })

  
  // 裁切测试
  // const res = isArrayByValue(pdfUrls.value, 'N22VJ5')
  // console.log('res ==> ', res)
}

// getPDFByBatch()

// 判断是否存在某个值
// const isArrayByValue = (arr: Array<string>, value: string) => {
//   if(arr.length <=0 ) return [] 

//   return arr.filter(v => v.indexOf(value) !== -1)

//   // console.log(value)
//   // let res = ''
//   // arr.filter((v) => {
//   //   console.log(v)
//   //   if (v.indexOf(value) !== -1){
//   //     res = v
//   //   }
//   // })
//   // return res
// }


// 登录
// const login = () => {
//   console.log('登录信息 ==> ', foreman.value)
//   if (foreman.value.account === '') {
//     messageError('请输入工号')
//     return
//   }
//   if (foreman.value.password === '') {
//     messageError('请输入密码')
//     return
//   }

//   foremanLogin(foreman.value.account, foreman.value.password).then((res:any)=>{
//     console.log(res)
//     userData.value = res.data
//     qicStore.qicUser = res.data

//     // 开启权限（修改权限）
//     qicStore.isForemanLogin = true
//     // 取消禁用
//     // isDisabled.value = false

//     // 关闭登录界面
//     isShowLogin.value = false

//     // 重置登录信息
//     resetLoginInfo()
//   }).catch((err:any)=>{
//     console.error(err)
//   })
//   // 登录成功
//   // const results = await foremanLogin(foreman.value.account, foreman.value.password)
//   // userData.value = results.data
//   // qicStore.qicUser = results.data
//   // console.table(userData.value)
//   // console.table(qicStore.qicUser)
//   // if (results !==-1) {

//   //   // 开启权限（修改权限）
//   //   qicStore.isForemanLogin = true

//   //   // 取消禁用
//   //   // isDisabled.value = false

//   //   // 关闭登录界面
//   //   isShowLogin.value = false

//   //   // 重置登录信息
//   //   resetLoginInfo()
//   // }
//   // 回车修改成功(鼠标离开界面)
// }

// 回车登录
// const changeLogin = () => {
//   console.log('回车')
//   if (!isResetPad.value) {
//     login()
//   }
// }

// 修改密码
// const clickUpdatePassword = () => {
//   console.log('账号信息 ==> ', foreman.value)
//   if (foreman.value.account === '') {
//     messageError('请输入工号')
//     return
//   }
//   if (foreman.value.password === '') {
//     messageError('请输入密码')
//     return
//   }
//   if (foreman.value.newpassword === '') {
//     messageError('请输入密码')
//     return
//   }
//   if (foreman.value.password === foreman.value.newpassword) {
//     messageError('新密码与旧密码相同')
//     return
//   }
//   updatePad(foreman.value.account, foreman.value.password, foreman.value.newpassword).then((res:any)=>{
//     console.log(res)
//     // 重置登录信息
//     foreman.value.password = ''
//     foreman.value.newpassword = ''
//     // 显示登录界面
//     isResetPad.value = false
//   }).catch((err:any)=>{
//     console.error(err)
//   })

//   // // 重置登录信息
//   // resetLoginInfo()
  
//   // // 显示登录界面
//   // isResetPad.value = false
// }

// 回车修改
// const changeUpdatePassword = () => {
//   clickUpdatePassword()
// }

// 修改特殊要求(鼠标离开输入框)
// const updateAsk = () => {
//   // console.log('condition ==> ', condition.value)
//   // UpdateSpecial(qicStore.queryForm.internalItem, condition.value, qicStore.queryForm.jobNumber.toString())

//   // if (qicStore.queryForm.internalItem === '') {
//   //   messageError('产品为空')
//   //   return
//   // }
//   if (condition.value === '') {
//     messageError('特殊要求内容不能为空')
//     return
//   }
//   if (qicStore.qicUser.employeeNo === '') {
//     messageError('请登录')
//     return
//   }

//   // if (qicStore.queryForm.jobNumber.toString() === '' || qicStore.queryForm.jobNumber === 80){
//   //   messageError('请输入工号')
//   //   return
//   // }

//   console.log('修改特殊要求参数 ==> ', qicStore.queryForm.internalItem, condition.value, qicStore.queryForm.jobNumber.toString())

  
//   UpdateSpecial(qicStore.queryForm.internalItem, condition.value, qicStore.queryForm.jobNumber.toString()).then((res:any)=> {
//     console.log(res)
//   }).catch((err:any)=>{
//     console.error(err)
//   })
// }

// 点击pdf
const togglePdf = (url: string, index: number) => {
  if (qicStore.isShowView !== 1) {
    qicStore.isShowView = 1
  }
  console.log(url)
  qicStore.pdf_url = PDF_URL + url
  activePdfUrl.value = index
  console.log(qicStore.pdf_url)
}

// 根据单号获取图片
// const loaderImgByBatch = async () => {
//   console.log('根据单号获取图片')
//   wordsImgList.value = []
//   lineImgList.value = []
//   // 1、判断
//   if (qicStore.queryForm.batch === '') {
//     console.error('没有输入单号-获取图片')
//     return
//   }
//   // 2、获取图片
//   const results = await GetImgByBatch(qicStore.queryForm.batch)
//   // console.log(results.data)

//   // 3、判断是否有数据
//   if (results === '' || results.data.length === 0) {
//     console.error('该单号没有图片-获取图片')
//     return
//   }

//   // 4、重置数据 - 过滤数据 - 赋值数据
//   results.data.forEach((v:GetImgeStatic, i:number) => {
//     if (v.img_Type === '3') {
//       wordsImgList.value.push({ id: i, small_img: SERVER_URL_SHOW_IMG + v.path, large_img: SERVER_URL_SHOW_IMG + v.path, uuid: v.uuid, status: 3 })
//     } else if (v.img_Type === '4') {
//       lineImgList.value.push({ id: i, small_img: SERVER_URL_SHOW_IMG + v.path, large_img: SERVER_URL_SHOW_IMG + v.path, uuid: v.uuid, status: 4 })
//     }
//   })
//   console.table(wordsImgList.value)
//   console.table(lineImgList.value)
// }

// 根据batch + dj 获取图片- 迪卡侬的 - 待完成
// const loaderProduceImg = async ()=> {
//   console.log('根据batch + dj 获取图片')
//   wordsImgList.value = []
//   lineImgList.value = []
//   // 1、判断
//   if (qicStore.queryForm.batch === '') {
//     console.error('没有输入单号-获取生产图片')
//     return
//   }
//   let dj = qicStore.queryForm.DJ
//   if (dj === '') {
//     console.error('该单号没有dj-获取生产图片')
//     dj = 'dj'
//   }
//   console.log(dj)

//   // 2、获取图片
//   const results = await GetProduceImgByBarchOrDJ(qicStore.queryForm.batch, dj)
//   // console.log(results.data)
  
//   // 3、判断是否有数据
//   if (results === '' || results.data.length === 0) {
//     console.error('该单号+dj没有生产-留样图片')
//     return
//   }

//   // 4、重置与赋值
//   // wordsImgList.value = results.data
//   results.data.forEach((v:GetImgeStatic, i:number) => {
//     if (v.img_Type === '3') {
//       wordsImgList.value.push({ id: i, small_img: SERVER_URL_SHOW_IMG + v.path, large_img: SERVER_URL_SHOW_IMG + v.path, uuid: v.uuid, status: 3 })
//     } else if (v.img_Type === '4') {
//       lineImgList.value.push({ id: i, small_img: SERVER_URL_SHOW_IMG + v.path, large_img: SERVER_URL_SHOW_IMG + v.path, uuid: v.uuid, status: 4 })
//     }
//   })
// }



// 加载batch 记录 获取EPC

// const closeImg = () => {
//   console.log('closeImg')
// }
// const showImg = () => {
//   console.log('showImg')
// }

// 图片弹框
// const showImgDialog = (v: IImage, status: number) => {
//   dialogVisible.value = true
//   dialogImageUrl.value = v
//   dialogImageUrl.value.status = status
// }


// 退出登录
const logout = async () => {
  //1、 删除token
  deleteLocalStorage('token')

  // 2、关闭修改权限
  qicStore.isForemanLogin = false
}

// 删除图片 - 生产留样 - 清线留样
const clickDeleteImg = async (data: IImage) => {
  console.log('删除图片')
  deleteImgByUuid(data.uuid).then((res:any)=>{
    console.log(res)
    dialogVisible.value = false
    // 删除arr的一项-
    if (data.status === 3) {
      wordsImgList.value.splice(data.id, 1)
    } else if (data.status === 4) {
      lineImgList.value.splice(data.id, 1)
    }
    messageSuccess('删除成功')
  }).catch((err:any)=>{
    console.error(err)
  })
  // const results = await deleteImgByUuid(data.uuid)
  // if (results === 1) {
  //   dialogVisible.value = false
  //   // 删除arr的一项-
  //   if (data.status === 3) {
  //     wordsImgList.value.splice(data.id, 1)
  //   } else if (data.status === 4) {
  //     lineImgList.value.splice(data.id, 1)
  //   }
  //   messageSuccess('删除成功')
  // }
  // console.log(results)
}



// 重置登录输入框信息
// const resetLoginInfo = ()=>{
//   foreman.value.account = ''
//   foreman.value.password = ''
//   foreman.value.newpassword = ''
// }

// 获取摄像头信息
// const getCameraCount = () => {
//   navigator.mediaDevices.enumerateDevices().then(res => {
//     qicStore.cameraArr = res.filter(v => v.kind === 'videoinput')
//   })
// }

// *****************监听器******************************
watch(()=>qicStore.isShowView, (newVal, oldVal)=> { // 监听是否显示PDF
  if(newVal !== oldVal) {
    if (newVal === 1) {
      activePdfUrl.value = 0
    } else {
      activePdfUrl.value = -1
      qicStore.pdf_url = ''
    }
  }
})

// 根据 产品 更新 特殊要求
// watch(()=> qicStore.queryForm.internalItem,(newVal, oldVal)=>{
//   if(newVal !== oldVal && newVal !== '') {
//     getSpecial()
//   }
// })

// 当batch更新时，重新获取PDF（根据batch获取）
// watch(()=>qicStore.queryForm.batch,(newVal, oldVal)=>{
//   console.log('****************** batch更新（middle）  **************************')
//   console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
//   if(newVal !== oldVal && newVal !== '' && qicStore.isBatch === 1) {
//     // 2、获取PDF
//     getPDFByBatch()

//     // 3、获取图片（其它图片）不是迪卡侬，有历史记录
//     // if (qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') === -1 && qicStore.isRecord === 1) { // 不是迪卡侬的
//     //   _getAllImgByBatch(newVal)
//     // } 
//   }
// })
// 有问题,用两个监听器
watch(()=>[qicStore.queryForm.batch, qicStore.isBatch], ([baNewVal, isNewVal],[baOldVal, isOldVal])=>{
  console.log('********************  监听 batch isbatch middle pdf  ************************')
  console.log(baNewVal, baOldVal, isNewVal, isOldVal)
  if (isNewVal === 1){
    getPDFByBatch()
  }
})
// // 当dj更新时
watch(()=>qicStore.queryForm.DJ,(newVal, oldVal)=> {
  console.log('****************** DJ更新（middle）  **************************')
  console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
  if(newVal !== oldVal && newVal !== '' && qicStore.isBatch === 1 && qicStore.isRecord === 1) {
    if (qicStore.isShowView === 1) {
      console.log('dj(待写切换PDF) ==> ', newVal)
      let active = -1
      pdfUrls.value.forEach((v, i)=>{
        if (v.indexOf(newVal) !== -1) {
          active = i
        }
      })

      if (active !== -1) {
        qicStore.pdf_url = PDF_URL + pdfUrls.value[active]
        activePdfUrl.value = active
      }
    }  
  }
})

// 当img_status变化，就是员工上传了图片
watch(()=>qicStore.img_status, (newVal, oldVal)=> {
  console.log(newVal, oldVal)
  if(newVal !== oldVal) {
    if (newVal === 3) {
      console.log('上传了生产留样')
      // 更新数据
    } else if (newVal === 4) {
      console.log('上传了清线留样')
      // 更新数据
    }
    qicStore.isShowView = 0
    qicStore.img_status = 0
  }
})

// 当单号无效时 好像没有效果
watch(()=>qicStore.isBatch, (newVal, oldVal) =>{
  console.log('*********** isBatch middle  ***************')
  console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
  if (newVal !== oldVal) {
    if (newVal === 0 || newVal === -1) {
      console.log('执行watch isBatch middle')
      condition.value = '' // 特殊要求置空
      pdfUrls.value = [] // pdf
      // _resetImg()
      // _qualityStandardList.value = []
      // _complainCaseList.value = []
      // _produceImgList.value = [] // 必须在模块那里设置  判断 props.lists === undefined  赋值[]
      // _lineImgList.value = []
    }
  }
})

// watch(()=>qicStore.isShowView, (newVal, oldVal)=> {
//   console.log("isShowView ==> ", newVal, oldVal)
// })
// uuid
// watch(()=> qicStore.uuid,(newVal, oldVal)=>{
//   if(newVal !== oldVal) {
//     if (newVal !== '') {
//       const u:Array<string> =  qicStore.uuid.split('-')
//       if (u[0] === '1') {
//         console.log('1')
//       } else if (u[0] === '2'){
//         console.log('2')
//       } else if (u[0] === '3') {
//         wordsImgList.value[wordsImgList.value.length -1].uuid = u[1]
//       } else if (u[0] === '4') {
//         lineImgList.value[lineImgList.value.length -1].uuid = u[1]
//       }
//     }
//   }
// })


// *****************监听******************************
// 监听拍照
// bus.on('mittPhotograph', (val: any) => {
//   // console.log('拍照 ==> ', val.img)
//   if (val.type === '3') {
//     wordsImgList.value.push({
//       id: 1,
//       small_img: val.img,
//       large_img: val.img,
//       uuid: val.uuid,
//       status: 3,
//       isLoading: true
//     })
//   } else if (val.type === '4') {
//     lineImgList.value.push({
//       id: 1,
//       small_img: val.img,
//       large_img: val.img,
//       uuid: val.uuid,
//       status: 4,
//       isLoading: true
//     })
//   }
//   console.log('拍照 ==> ', val)
// })

bus.on('mittStaticImg', (val: any) => {
  console.log('选择 ==> ', val)
  if (val.type === '3') {
      val.path.forEach((v:any, i:number)=>{
        wordsImgList.value.push({
          id: wordsImgList.value.length + i,
          small_img: SERVER_URL_SHOW_IMG + v.path,
          large_img: SERVER_URL_SHOW_IMG + v.path,
          uuid: v.uuid,
          status: 3,
          isLoading: true
        })
      })
    console.table(wordsImgList.value)
  } else if (val.type === '4') {
    val.path.forEach((v:any, i:number)=>{
      lineImgList.value.push({
        id: wordsImgList.value.length + i,
        small_img: SERVER_URL_SHOW_IMG + v.path,
        large_img: SERVER_URL_SHOW_IMG + v.path,
        uuid: v.uuid,
        status: 4,
        isLoading: true
      })
    })
    console.table(lineImgList.value)
  }
})





// *****************函数******************************


// *****************生命周期******************************
onBeforeMount(()=> {
  console.log('middle onBeforeMount')
  // 首次启动
  // init()
})
onMounted(() => {
  console.log('middle onMounted')
  // EPCInterval.value = setSB_Interval(1,2) // -1：99999999秒
})



</script>

<template>
  <!-- 特殊要求 -->
  <div class="qir-title right_title">
    <div>特殊要求</div>
    <div v-show="qicStore.isForemanLogin">{{qicStore.qicUser.employeeName}}</div>
    <el-button type="primary" v-show="qicStore.isForemanLogin" @click="isShowUpdateQIC = true">修改</el-button>
    <el-button type="primary" v-show="qicStore.isForemanLogin" @click="isShowUploadQICFile = true">上传</el-button>
    <el-button type="primary" v-show="qicStore.isForemanLogin" @click="isShowItem = true">ITEM</el-button>
    <el-button type="primary" v-show="qicStore.isForemanLogin" @click="isUpdateIP = true">IP</el-button>
    <el-button type="primary" v-show="!qicStore.isForemanLogin" @click="qicStore.isShowLogin = true">登录</el-button>
    <el-button type="primary" v-show="qicStore.isForemanLogin" @click="logout">退出登录</el-button>
  </div>
  <div class="xj-scoll qirm-box condition">
    <!-- <div v-for="(v, i) in condition" :key="i">{{v.content}}</div> -->
    <!-- <el-input
      v-model="condition"
      placeholder="Please enter special requirements."
      show-word-limit
      :rows=4
      :disabled="!qicStore.isForemanLogin"
      type="textarea"
      @blur="updateAsk"
    /> -->
    <SpecialRequest />
  </div>

  <!-- PDF ':8848/pdf/ADNSN22VGK_1UPS_LOA_Docs.pdf'.substr(14,6) {{v.substr(14,6)}} {{v.substring(20,14)}}  -->
  <div class="qir-title">ApprovedLayout</div>
  <div class="jh_grid_100 pdf-box qirm-box xj-scoll" v-show="pdfUrls.length > 0">
    <div class="pdf-item" :class="{active: activePdfUrl === i}" v-show="pdfUrls.length > 0" @click="togglePdf(v, i)" v-for="(v, i) in pdfUrls" :key="i">{{v.substring(20,14)}}</div>
    <!-- <a :class="{active: activePdfUrl === i}" v-show="pdfUrls.length > 0" href="#" @click="togglePdf(v, i)" v-for="(v, i) in pdfUrls" :key="i">{{v.substring(20,14)}}</a> -->
  </div>
  <div class="pdf-box qirm-box hint lh50" v-show="pdfUrls.length <= 0">{{pdfHintInfo}}</div>

  <!-- 质量标准 -->
  <div class="qir-title">质量标准</div>
  <div class="qirm-box jh_grid_100 img-list xj-scoll sb-h-108">
    <!-- <UploadImgList /> -->
    <div class="img-item" v-for="(v, i) in _qualityStandardList" :key="i">
      <el-image :preview-src-list="[v.path]" :src="v.path"
        :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :hide-on-click-modal="true"
        style="width: 80px; height: 80px;" fit="contain" /><div class="img-title">{{v.remark}}</div></div>
      <!-- <UploadImg2 _type="1" /> -->
  </div>

  <!-- 投诉案例 -->
  <div class="qir-title">投诉案例</div>
  <div class="qirm-box jh_grid_100 img-list xj-scoll sb-h-108">
    <div class="img-item" v-for="(v, i) in _complainCaseList" :key="i">
      <el-image :preview-src-list="[v.path]" :src="v.path"
        :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2" :hide-on-click-modal="true"
        style="width: 80px; height: 80px;" fit="contain" /><div class="img-title">{{v.remark}}</div></div>
    <!-- <UploadImg _type="2" v-show="qicStore.isForemanLogin" /> -->
  </div>

  <!-- 生产留样 -->
  <div class="qir-title right_title epc-title">
    <div>生产留样</div>
    <!-- 开启摄像头 -->
    <!-- <el-select v-model="qicStore.selectCamer" clearable placeholder="请选择">
      <el-option
        v-for="item in qicStore.cameraArr"
        :key="item.deviceId"
        :label="item.label"
        :value="item.label"
      />
    </el-select> -->
    <!-- <el-button type="primary" @click="()=> {qicStore.isShowView = 2; qicStore.img_state = 3;}">选择图片</el-button> -->
  </div>
  <div class="qirm-box xj-scoll sb-h-90">
    <UploadImage _type="3" :lists="_produceImgList" />
    <!-- <div class="img-item" v-for="(v, i) in wordsImgList" :key="i">
      <el-image :src="v.large_img" @click="showImgDialog(v, 3)"
        style="width: 100px;" fit="contain" :v-loading="v.isLoading" /></div> -->
      <!-- <el-image :preview-src-list="[v.small_img]" :src="v.large_img" :hide-on-click-modal="true"
        :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
        style="width: 100px; height: 100px" fit="contain" /></div> -->
  </div>

  <!-- 清线留样 -->
  <div class="qir-title right_title">
    <div>清线留样</div>
    <!-- <el-button type="primary" @click="()=> {qicStore.isShowView = 2; qicStore.img_state = 4;}">选择图片</el-button> -->
  </div>
  <div class="qirm-box xj-scoll sb-h-90">
    <UploadImage _type="4" :lists="_lineImgList" />
    <!-- <div class="img-item" v-for="(v, i) in lineImgList" :key="i">
      <el-image :preview-src-list="[v.small_img]" :src="v.large_img" :hide-on-click-modal="true"
        :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
        style="width: 100px; height: 100px" fit="contain" @close="closeImg" @show="showImg" /></div>
        <el-image :src="v.large_img" @click="showImgDialog(v, 4)"
        style="width: 100px;" fit="contain" :v-loading="v.isLoading" /></div> -->
  </div>

  <!-- 生产EPC -->
  <EPCModel />
 

  <!-- 弹框登录 -->
  <ForemanLogin />

  <!-- 弹框显示图片 -->
  <el-dialog v-model="dialogVisible">
    <el-button size="large" class="delete-btn" type="danger" @click="clickDeleteImg(dialogImageUrl)">删 除</el-button>
    <br>
    <img class="xj-img" w-full :src="dialogImageUrl.large_img" alt="Preview Image" />
  </el-dialog>

  <!-- 弹框显示操作界面 -->
  <el-dialog v-model="isShowUpdateQIC" >
    <UpdateQICModel />
  </el-dialog>
  <el-dialog v-model="isShowUploadQICFile" >
    <UploadQICFile />
  </el-dialog>

  
  <el-dialog v-model="isShowItem" >
    <UpdateItem />
  </el-dialog>

  <!-- 修改IP -->
  <el-dialog v-model="isUpdateIP" >
    <UpdateIP />
  </el-dialog>
</template>

<style scoped lang="less">

// 每个模块
.qirm-box {
  background-color: #fff !important;
  margin-bottom: 10px;
}
.condition .el-textarea{
  font-size: 20px;
  --el-input-text-color: #f52025;
  --el-disabled-text-color: #f52025;
}
// 禁用颜色
// PDF
.jh_grid_100 {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
}
.pdf-box{
  // display: grid;
  // grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  // display: flex;
  // flex-wrap: wrap;
  // align-content: flex-start;
  // align-content: center;
  height: 50px;
  // padding: 10px 0;
}
.lh50 {
  line-height: 50px;
}
.pdf-box .pdf-item{
  flex: 20%;
  height: 30px;
  font-size: 20px;
  color: rgb(31, 31, 224);
  text-decoration: none;
  text-align: center;
  line-height: 30px;
}
.pdf-box .pdf-item.active {
  color: #67c23a;
}

// 生产留言
.right_title {
  display: flex;
  justify-content: space-between;
  padding-right: 10px;
  >.el-button {
    font-size: 16px;
  }
}
.img-item {
  margin-top: 5px;
  text-align: center;
}
.img-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: 5px;
  text-align: center;
  >.el-image {
    flex: 1;
  }
}
.img-title {
  padding-bottom: 3px;
  text-align: left;
  font-size: 16px;
  letter-spacing: .1em;
}
.xj-img {
  width: 140%;
}

// 删除按钮
.delete-btn {
  margin-bottom: 20px;
  font-size: 18px;
}

</style>
