// 图片hooks - 质量标准 投诉案例 生产留样 清线留样

import { ref, watch } from "vue"
import { IQICImgReq, IQualityStandardRes } from "../../../tools/interface/iFileData"
import { GetImgByBatch, GetImgByItem, GetImgByItemDefault, GetProduceImgByBarchOrDJ } from "../../../tools/api/fileApi"
import { SERVER_URL_SHOW_IMG } from "../../../tools/request/qicVar"
import { useQirPinia } from "../../../store/qir"
function _getImageHooks() {
  const _qualityStandardList = ref<Array<IQualityStandardRes>>([]) // 质量标准
  const _complainCaseList = ref<Array<IQualityStandardRes>>([]) // 投诉案例
  let _produceImgList = ref<Array<IQICImgReq>>([]) // 生产留样
  const _lineImgList = ref<Array<IQICImgReq>>([]) // 清线留样
  const qicStore = useQirPinia()
  // 根据单号获取图片
  const _getAllImgByBatch = (_batch: string)=>{ // 获取所有的图片
    console.log('根据单号获取图片')
    // _resetImg1()
    GetImgByBatch(_batch).then((res:any)=>{
      console.log(res)
      manageImg(res)
    }).catch((err:any)=>{
      console.error(err)
      // _resetImg1()
    })
  }

  // 处理所有图片
  const manageImg = (res:any)=>{
    // _resetImg1()
    res.forEach((v:IQICImgReq)=> {
      if (v.img_Type === '3') {
        _produceImgList.value.push(v)
      } else if (v.img_Type === '4') {
        _lineImgList.value.push(v)
      }
    })
    console.table(_produceImgList.value)
    console.table(_lineImgList.value)
  }
    

    // 获取迪卡侬图片
  const _getImgByDECA = (batch:string, dj: string)=>{
    GetProduceImgByBarchOrDJ(batch, dj).then((res:any)=>{
      manageImgByDECA(res)
    }).catch((err:any)=>{
      console.error(err)
      // _resetImg2()
    })
  }

  // 处理迪卡侬图片
  const manageImgByDECA = (res:any) =>{
    // _resetImg2()
    res.forEach((v:IQICImgReq)=> {
      if (v.img_Type.indexOf('3') !== -1) {
        _produceImgList.value.push(v)
      } else if (v.img_Type.indexOf('4') !== -1) {
        _lineImgList.value.push(v)
      }
    })
  }

  // 获取 质量标准 投诉案例图片
  const _getImgByItem = (item:string, rbo:string)=>{
    // _resetImg1()
    GetImgByItem(item, rbo).then((res:any)=>{
      console.log(res)
      _resetImg()
      if (res.length > 0) {
        res.forEach((v:IQualityStandardRes)=>{
          v.path = SERVER_URL_SHOW_IMG + v.path
          if (v.img_Type === '1') {
            _qualityStandardList.value.push(v)
          } else if (v.img_Type === '2') {
            _complainCaseList.value.push(v)
          }
        })
      } else {
        console.error('没有图片')
        // _resetImg()
      }
    }).catch((err:any)=>{
      console.error(err)
      // _resetImg()
    })
  }

  const _getImgByItemDefault = (item:string, rbo:string)=>{
    // _resetImg1()
    GetImgByItemDefault(item, rbo).then((res:any)=>{
      // console.log(res)
      _resetImg()
      if (res.length > 0) {
        res.forEach((v:IQualityStandardRes)=>{
          v.path = SERVER_URL_SHOW_IMG + v.path
          if (v.img_Type === '1') {
            _qualityStandardList.value.push(v)
          } else if (v.img_Type === '2') {
            _complainCaseList.value.push(v)
          }
        })
      } else {
        console.error('没有图片')
        // _resetImg()
      }
    }).catch((err:any)=>{
      console.error(err)
      // _resetImg()
    })
  }

  // 重置 1-2 质量标准 投诉案例图片
  const _resetImg1 = ()=>{
    console.log('重置 1-2')
    _qualityStandardList.value = []
    _complainCaseList.value = []
  }
  // 重置 3-4 生产留样 清线留样图片
  const _resetImg2 = ()=>{
    console.log('重置 3-4')
    _produceImgList.value = []
    _lineImgList.value = []
  }
  // 重置全部图片
  const _resetImg = () =>{
    console.log('重置 1-2 3-4')
    _qualityStandardList.value = []
    _complainCaseList.value = []
    _produceImgList.value = []
    _lineImgList.value = []
  }

  /**
   * 监听batch变化 重置图片
  */
  watch(()=>qicStore.BatchRefresh, (newVal, oldVal) => {
    if (newVal !== oldVal) _resetImg() // 重置全部图片
  })

  // 监听batch, 有点问题，故监听 record
  // watch(()=>qicStore.queryForm.batch, (newVal, oldVal)=>{
  //   console.log('****************** batch更新（img hooks）  **************************')
  //   console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
  //   if (newVal !== oldVal) {
  //     _resetImg() // 重置全部图片
  //     if (newVal !== '' && qicStore.isBatch === 1 && qicStore.isRecord === 1 && qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') === -1) {
  //       _getAllImgByBatch(newVal) //不是迪卡侬的，获取全部图片 获，有历史记录
  //     }
  //   }
  // })
  // 监听batch, 有点问题，故监听 record
  watch(()=>qicStore.isRecord, (newVal, oldVal)=>{
    console.log('****************** 监听 isRecord 获取 所有图片(不是迪卡侬) **************************')
    console.log(newVal, oldVal, qicStore.isBatch, qicStore.queryForm.batch)
    if (newVal !==oldVal && newVal !== -1 && qicStore.isBatch === 1 && qicStore.queryForm.batch.length === 11) {
      // _resetImg() // 重置全部图片
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') === -1) {
        _getAllImgByBatch(qicStore.queryForm.batch) //不是迪卡侬的，获取全部图片 获，有历史记录
      }
    }
  })


  // 监听dj更新 有问题 用两个监听器
  // watch(()=>qicStore.queryForm.DJ,(newVal, oldVal)=> {
  //   console.log('****************** 监听dj 获取 迪卡侬图片 **************************')
  //   console.log(newVal, oldVal, qicStore.isBatch, qicStore.isRecord)
  //   if(newVal !== oldVal && newVal !== '' && qicStore.isBatch === 1 && qicStore.isRecord === 1) {
  //     // 判断是否是迪卡侬的
  //     if (qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') !== -1) {
  //       console.log('获取迪卡侬')
  //       _resetImg2() // 重置 3-4
  //       // 是迪卡侬的
  //       _getImgByDECA(qicStore.queryForm.batch, newVal)
  //     }
  //   }
  // })

  // 监听dj更新 有问题 用两个监听器
  watch(()=>[qicStore.queryForm.DJ, qicStore.isRecord],([djNewVal, reNewVal], [djOldVal, crOldVal])=> {
    console.log('****************** 监听dj isRecord 获取 迪卡侬图片 **************************')
    console.log(djNewVal, djOldVal, reNewVal, crOldVal, qicStore.isBatch, qicStore.queryForm.rbo)
    console.log(qicStore.DJArr[0])
    if ((djNewVal !== djOldVal || djNewVal == qicStore.DJArr[0]) && djNewVal !== '' && qicStore.isBatch === 1) {
      if (reNewVal === 1 && qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') !== -1) {
        console.log('获取迪卡侬')
        _resetImg2() // 重置 3-4
        // 是迪卡侬的
        _getImgByDECA(qicStore.queryForm.batch, djNewVal.toString())
      }
    }
  })

  // 监听item
  watch(()=> qicStore.queryForm.internalItem,(newVal, oldVal)=>{
    console.log('************ 监听 internalItem hooks 获取1-2图片 ******************')
    console.log(newVal, oldVal)
    if(newVal !== oldVal && newVal !== '') {
      // _resetImg1() // 重置1-2
      _getImgByItem(newVal, qicStore.queryForm.rbo)
    }
  })

  // watch(()=>_produceImgList.value,(newVal, oldVal)=>{
  //   console.table(newVal)
  // })

  return {
    _qualityStandardList, _complainCaseList, _produceImgList, _lineImgList, _getImgByItem, _getAllImgByBatch, _getImgByDECA, _resetImg1, _getImgByItemDefault
  }
}

export default _getImageHooks