<!-- 为了解决部署无法拍照的问题，这里将图片上传改为从本地读取 -->

<script setup lang="ts">

import { ref, watch } from 'vue'

// import { GetImgList, UploadImg } from '../../utils/api/qic_data'
import bus from "../../store/mitt"

// element-plus
// import { messageError } from '../../utils/element-plus/SBMessage'
// import { getTime } from '../../utils/sb_time'

// pinia
import { useQirPinia } from '../../store/qir'
// import { GetDecathlonImgsByFist, GetDecathlonImgsByQinxian, GetOtherImgsByFist, SavaDecathImag, SavaOtherImag } from '../../utils/api/qic_data'
// import { SHOW_SERVER_IMG } from '../../assets/js/variable'
import { messageError } from '../../tools/element-plus/SBMessage'
import { getTime } from '../../tools/utils/sb_time'
import { GetDecathlonImgsByFist, GetDecathlonImgsByQinxian, GetOtherImgsByFist, SavaDecathImag, SavaOtherImag } from '../../tools/api/fileApi'
import { SERVER_URL_SHOW_IMG } from '../../tools/request/qicVar'
const qicStore = useQirPinia()

// const urls = [
//   'https://fuss10.elemecdn.com/a/3f/3302e58f9a181d2509f3dc0fa68b0jpeg.jpeg',
//   'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
//   'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
//   'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg',
//   'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg',
//   'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg',
//   'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
// ]



// 无数据提示
const isHint = ref<boolean>(false)

  let urls = ref<Array<any>>([])
const checkList = ref<Array<string>>([])

// const props = defineProps({
//   state: {
//     type: boolean
//   }
// })


// ****************** 方法 ***************************************

// 上传
const updateImg = ()=> {
  // 1、判断
  if (!isValue()) {
    return
  }

  // 2、上传
  if (checkList.value.length === 0) {
    messageError('请选择图片')
    return
  }

  // 3、上传
  // const results = await UploadImg()
  // SavaDecathImag('xx', '111', checkList.value,qicStore.img_state.toString()).then((res:any)=>{
  if (qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') > -1) { // 迪卡侬的图片
    SavaDecathImag(qicStore.queryForm.batch, qicStore.queryForm.DJ, checkList.value,
      qicStore.img_state.toString(), qicStore.queryForm.jobNumber.toString()).then((res:any)=>{
      console.log('上传图片 ==> ', res)

      // 将uuid和图片路径传递给中间显示
      bus.emit('mittStaticImg', { path: res.data, type: qicStore.img_state.toString() })

      // 
      qicStore.img_status = qicStore.img_state // 用来更新图片数据
      checkList.value = []

    }).catch((err:any)=>{
      console.error(err)
    })
  }

  else { // 其它图片
    SavaOtherImag(qicStore.queryForm.batch, qicStore.queryForm.DJ, checkList.value,
      qicStore.img_state.toString(), qicStore.queryForm.jobNumber.toString()).then((res:any)=>{
      console.log('上传图片 ==> ', res)

      // 将uuid和图片路径传递给中间显示
      bus.emit('mittStaticImg', { path: res.data, type: qicStore.img_state.toString() })

      // 
      qicStore.img_status = qicStore.img_state // 用来更新图片数据
      checkList.value = []

    }).catch((err:any)=>{
      console.error(err)
    })
  }
}

// 重置
const resetImg = () => {
  checkList.value = []
}

//******************************************   API 方法  ****************************************************************
// 获取迪卡侬数据 Adtp1 -- 首检
const getProduceImgdkn = ()=>{
  // 1、判断
  if (isDkn()) return
  urls.value = []
  // 2、请求
  // GetDecathlonImgsByFist('Adtp1','1401','2023-12-09','P45219A18060' ).then((res:any)=>{
  GetDecathlonImgsByFist(qicStore.queryForm.type, qicStore.queryForm.machineNo, qicStore.queryForm._date, qicStore.queryForm.DJ).then((res:any)=>{
    // console.log(' 迪卡侬：', res)
    if (res.isSuccess === true) {
      // console.log(' 迪卡侬：', res.data)
      imgListMnager(res.data)
    }
  }).catch((err:any)=>{
    console.error(err)
  })
}
// 获取迪卡侬数据 Adtp1 -- 清线留样
const getDecathlonImgsByQinxian = ()=>{
  // 1、判断
  if (isDkn()) return
  // 2、请求
  // GetDecathlonImgsByQinxian('Adtp1','1301','2023-12-09','P48136A1439' ).then((res:any)=>{
  GetDecathlonImgsByQinxian(qicStore.queryForm.type, qicStore.queryForm.machineNo, qicStore.queryForm._date, qicStore.queryForm.DJ).then((res:any)=>{
    console.log(' 迪卡侬：', res)
    if (res.isSuccess === true) {
      console.log(' 迪卡侬：', res.data)
      imgListMnager(res.data)
    }
  }).catch((err:any)=>{
    console.error(err)
  })
}

// 获取其它图片路径
const getOtherImgsByFist = ()=>{
  // 1、判断
  if (isDkn()) return
  urls.value = []
  // 2、请求
    // GetOtherImgsByFist('adtp1', '0202', '2023-11-03', 'nst10783154').then((res:any)=>{
    GetOtherImgsByFist(qicStore.queryForm.type, qicStore.queryForm.machineNo, qicStore.queryForm._date, qicStore.queryForm.DJ).then((res:any)=>{
    console.log(' 其它图片', res)
    if (res.isSuccess === true) {
      console.log(' 其它图片', res.data)
      imgListMnager(res.data)
    }
  }).catch((err:any)=>{
    console.error(err)
  })
}


//******************************************   处理请求  ****************************************************************
const imgListMnager = (arr:Array<string>) => {
  console.table(arr)
  if (arr.length === 0) {
    //
    isHint.value = true
    return
  }

  // 处理数据
  let a = []
  arr.forEach((v,i) => {
    a = v.split('/')
    a = a[a.length - 1].split('-')
    urls.value.push({
      uuid: (i+1),
      url: v, // 传值
      path: SERVER_URL_SHOW_IMG + v, // 显示
      _name: a[0] + '-' + a[1],
      isSelect: false
    })
  })

  console.log(urls.value)
}






// ************************  监听器 *******************************************
watch(() => qicStore.queryForm.batch,(newVal, oldVal)=>{
  if (newVal !== oldVal || newVal !== '') {
    qicStore.isShowView = 0
  }
})

watch(()=>qicStore.img_state, (newVal, oldVal)=>{
  if (newVal!== oldVal) {
    if (newVal === 3) { // 生产留样
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') > -1) { // 如果是迪卡侬的
        getProduceImgdkn()
      } else {
        getOtherImgsByFist()
      }
    } else if (newVal === 4) { // 清线留样
      if (qicStore.queryForm.rbo.toUpperCase().indexOf('DEC') > -1) { // 如果是迪卡侬的
        getDecathlonImgsByQinxian()
      }
    }
  }
})

//******************************************   普通方法  ****************************************************************
// 迪卡侬判断
const isDkn = () => {
  console.table(qicStore.queryForm)
  if (qicStore.queryForm.batch === '') {
    messageError('请输入单号')
    return true
  }
  if (qicStore.queryForm.type === '') {
    messageError('组别信息为空')
    return true
  }
  if (qicStore.queryForm._name === '') {
    messageError('请输入工号（姓名）')
    return true
  }
  if (qicStore.queryForm._date === '') {
    messageError('日期异常')
    qicStore.queryForm._date = getTime(0)
    return true
  }
  if (qicStore.queryForm.DJ === '') {
    messageError('dj为空')
    return true
  }
  return false
}


// ***********************************


// 获取图片
// const getImgList = async () => {
//   // 1、判断
//   if (!isValue()) {
//     return
//   }

//   // 2、获取
//   // const results = await GetImgList()
  
//   // if (results === '') {
//   //   return
//   // }

//   // 3、处理数据
//   console.log('233')
// }

/**
 * 判断单号 姓名，DJ，ip 是否有值
*/
const isValue = () => {
  if (qicStore.queryForm.batch === '') {
    messageError('请输入单号')
    return false
  }

  if(qicStore.queryForm.DJ === '' || qicStore.queryForm.DJ === undefined) {
    messageError('没有DJ, 请加载单号')
    return false
  }

  if (qicStore.queryForm._name === '') {
    messageError('请输入工号')
    return false
  }

  if (qicStore.ipData.ip === '' || qicStore.ipData.ip === undefined) {
    messageError('IP信息无效')
    return false
  }
  return true
}



// console.log('state ==> ', state)

</script>

<template>
  <div class="select-img-box scoll">
    <div class="title" v-show="qicStore.img_state === 3">生产留样</div>
    <div class="title" v-show="qicStore.img_state === 4">清线留样</div>
    <div class="img-list" v-show="urls.length > 0">
      <el-checkbox-group v-model="checkList">
        <el-checkbox :label="v.url" v-for="v in urls" :key="v.uuid">
          <el-image :src="v.path"
            :preview-src-list="[v.path]" :hide-on-click-modal="true"
            :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
            style="width: 100px; height: 100px"
            fit="contain">
          </el-image>
          <div class="item-text">{{v._name}}</div>
        </el-checkbox>
      </el-checkbox-group>
    </div>

    <div>
      <el-button size="large" @click="updateImg" type="primary" v-show="urls.length > 0"> 确认</el-button>
      <el-button size="large" @click="resetImg" type="info" v-show="urls.length > 0">重置</el-button>
    </div>
    <div class="hint" v-show="urls.length === 0">没有记录,请做首检</div>
  </div>
</template>

<style scoped lang="less">
.select-img-box {
  height: 700px;
}
.title {
  margin-top: 20px;
  font-size: 20px;
  text-align: center;
  letter-spacing: .5em;
  color: rgb(65, 45, 240);
}

.img-list {
  margin-top: 30px;
}
/deep/.el-checkbox-group {
  display: flex;
  flex-wrap: wrap;
}
/deep/.el-checkbox.el-checkbox--small {
  width: 130px;
  margin-top: 40px;
  margin-bottom: 60px;
}
.item-text {
  font-size: 16px;
  text-align:center;
  letter-spacing: .1em;
}

// .img-box {
//   // display: grid;
//   // grid-template-columns: repeat(auto-fill, minmax(100px 1fr));
//   display: flex;
//   flex-wrap: wrap;
// }
// .img-item {
//   width: 100px;
//   margin-right: 10px;
//   margin-bottom: 10px;
//   margin-top: 10px;
//   border: 1px dashed #333;
//   border-radius: 4px;
//   overflow: hidden; // 超出边框隐藏
// }
// .img-item:hover {
//   border: 1px dashed #409eff;
// }
// .item-text {
//   font-size: 16px;
//   text-align:center;
//   letter-spacing: .2em;
// }
// .img-item.actice {
//   background-color: #409eff;
//   border: 1px dashed #409eff;
//   .item-text {
//     color: #fff;
//   }
// }
// .demo-image__lazy {
//   height: 400px;
//   overflow-y: auto;
// }
// .demo-image__lazy .el-image {
//   display: block;
//   min-height: 200px;
//   margin-bottom: 10px;
// }
// .demo-image__lazy .el-image:last-child {
//   margin-bottom: 0;
// }
</style>