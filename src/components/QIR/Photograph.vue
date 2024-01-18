<!-- 摄像头模块 -->
<script setup lang="ts">
import {ref, onMounted, watch} from "vue"

// 工具
import bus from "../../store/mitt"
import { messageError } from "../../tools/element-plus/SBMessage"
import { base64ToFile } from "../../tools/utils/base64"
import { UploadPicture } from "../../tools/api/fileApi"

// pinia
import { useQirPinia } from '../../store/qir'


const qicStore = useQirPinia()

// canvas控件对象
const canvasDom = ref<any>(null);
// video 控件对象
const videoDom = ref<any>(null);
// 照片路径
const imgurl = ref<string>('');
const fileImg = ref<File>();

// ****************** HOOK ******************************
watch(()=>qicStore.isCameraOnFirstCheck, (newVal, oldVal) => { // 监听摄像头
  console.log('isCameraOnFirstCheck', newVal, oldVal)
  if(newVal !== oldVal) {
    if(newVal) {
      openCamera()
      console.log('开启摄像头')
    } else {
      stop()
      console.log('关闭摄像头')
    }
  }
})

watch(()=>qicStore.isShowView, (newVal, oldVal)=> {
  if(newVal !== oldVal) {
    if (newVal === 2) {
      qicStore.isCameraOnFirstCheck = true
    } else {
      // stop()
      qicStore.isCameraOnFirstCheck = false
    }
  }
})

watch(()=>qicStore.selectCamer, (newVal, oldVal)=> {
  console.log('qicStore.selectCamer ==> ', qicStore.selectCamer)
  console.log('qicStore.selectCamer newVal ==> ', newVal)
  console.log('qicStore.selectCamer oldVal ==> ', oldVal)
  if(newVal !== oldVal) {
    console.log('摄像头 ==> ', newVal)
    if (newVal === '') {
      stop()
      console.log('关闭摄像头')
    } else {
      stop()
      openCamera()
      console.log('关闭摄像头')
    }
  }
})

// 开启摄像头
const openCamera = () => {
  // 检测浏览器是否支持mediaDevices
  if (navigator.mediaDevices) {
    navigator.mediaDevices
        // 开启视频，关闭音频
        .getUserMedia({audio: false, video: {
          deviceId: 'HP HD Camera (04ca:7089)'
        }})
        .then((stream) => {
          // let deviceArray = navigator.mediaDevices.enumerateDevices()
          // const self = Promise.resolve(deviceArray)
          // self.then(res=> {
          //   videoDom.value.srcObject = res.filter(v => v.kind === 'videoinput')[0]
          //   videoDom.value.play()
          // })
          // 将视频流传入viedo控件
          videoDom.value.srcObject = stream;
          // 播放
          videoDom.value.play();
        })
        .catch((err) => {
          console.log(err);
        });
  } else {
    window.alert("该浏览器不支持开启摄像头，请更换最新版浏览器");
  }
};

// 开启摄像头
// const openCamera = () => {
//   // 检测浏览器是否支持mediaDevices
//   if (navigator.mediaDevices) {
//     navigator.mediaDevices
//         // 开启视频，关闭音频
//         .getUserMedia({audio: false, video: true})
//         .then((stream) => {
//           // 将视频流传入viedo控件
//           videoDom.value.srcObject = stream;
//           // 播放
//           videoDom.value.play();
//         })
//         .catch((err) => {
//           console.log(err);
//         });
//   } else {
//     window.alert("该浏览器不支持开启摄像头，请更换最新版浏览器");
//   }
// };

// 拍照
const takePhoto = () => {
  // 如果已经拍照了就重新启动摄像头
  if (imgurl.value) {
    imgurl.value = '';
    // openCamera()
    // return;
  }

  // 设置画布大小与摄像大小一致
  canvasDom.value.width = videoDom.value.videoWidth;
  canvasDom.value.height = videoDom.value.videoHeight;
  // 执行画的操作
  canvasDom.value.getContext("2d").drawImage(videoDom.value, 0, 0);
  // 将结果转换为可展示的格式
  imgurl.value = canvasDom.value.toDataURL("image/webp");
  
  // 输出图片路径
  // console.log('路径 => ', imgurl.value)
  
  // 关闭摄像头
  // stop()
}


// 关闭摄像头
const stop = () => {
  console.log(videoDom.value)
  let stream = videoDom.value.srcObject;
  if (!stream) return;
  let tracks = stream.getTracks();
  tracks.forEach((x: any) => {
    x.stop();
  });

};

// 打开摄像头
onMounted(() => {
  // openCamera();
});

// 上传图片
const saveImg = async () => {
  console.log('上传')

  console.log(imgurl.value)

  if (imgurl.value === '') {
    console.error('图片为空')
    return
  }

  // 1、看格式，是否需要转
  fileImg.value = base64ToFile(imgurl.value, 'sb', "image/webp")
  console.log("file ==> ", fileImg.value)


  // 2、先判断是否有DJ和姓名
  console.table(qicStore.queryForm)
  
  if (qicStore.queryForm.batch === '') {
    messageError('请输入单号')
    return
  }
  let dj = qicStore.queryForm.DJ
  if (dj === '') {
    dj = '无'
  }

  console.log(dj)
  console.log(qicStore.queryForm.batch)
  // 组件传值 QIRMiddle
  // console.log(imgurl.value)
  // qicStore.order_data

  

  // 3、上传
  // const results = await UploadPicture({
  //   batch: qicStore.queryForm.batch,
  //   dj: qicStore.queryForm.DJ,
  //   type: '3',
  //   base64: imgurl.value
  // })

  // 3、传值
  // bus.emit('mittPhotograph', { img: imgurl.value })

  // qicStore.uuid = ''

  // // 4、上传
  // UploadPicture({ batch: qicStore.queryForm.batch, dj: qicStore.queryForm.DJ, type: '3', base64: imgurl.value}).then((res:any) => {
  //   if (res.data.isSuccess === true) {
  //     console.log(res.data.data)

  //     if (res.data.isSuccess === true){
  //       // 上传成功
  //       console.log(res.data.data)
  //       // pinia
  //       qicStore.uuid = '3-' + res.data.data

  //       // 重置 打开摄像头
  //       imgurl.value = ''
  //       openCamera()
  //     }

  // }}).catch((err:any) => {
  //   console.log(err)
  //   console.log('请重新上传')
  // })

  UploadPicture({
    batch: qicStore.queryForm.batch,
    dj: qicStore.queryForm.DJ,
    type: qicStore.img_state.toString(),
    base64: imgurl.value,
    employeeno: qicStore.queryForm.jobNumber.toString()
  }).then((res) => {
    if (res.data.isSuccess === true) {
      console.log(res.data.data)

      // 4、传值
      bus.emit('mittPhotograph', { img: imgurl.value, uuid: res.data.data, type: qicStore.img_state.toString() })

      imgurl.value = ''
      openCamera()
    }
  }).catch(err => {
    console.error(err)
  })

}

// 摄像头开启与关闭
// const isCamera = () => {
//   console.log('qirStore.isCameraOnFirstCheck ==> ', )
//   qirStore.isCameraOnFirstCheck = !qirStore.isCameraOnFirstCheck
//   if(qirStore.isCameraOnFirstCheck) { // 如果是打开状态
//     stop()
//   } else {
//     imgurl.value = '';
//     openCamera()
//   }
// }


// ********mitt********
// emitter.emit('panda', {name: 'lokka', age: 2})

</script>

<template>
  <div class="main">
    <!-- 画笔控件 用来拍照 -->
    <canvas style="display: none" ref="canvasDom"/>
    <!-- 播放器，用来播放拍摄的视频 -->
    <video class="camera_video" ref="videoDom"/>
    <!-- <video v-if="!imgurl" class="camera_video" ref="videoDom"/> -->
    <!--  显示照片  -->
    <!-- <img v-else :src="imgurl"/> -->
    <br/>
    <el-text size="large">拍照：</el-text>
    <el-button-group>
      <el-button type="primary" round @click="takePhoto">{{ imgurl ? "重拍" : "拍照" }}</el-button>
      <el-button type="success" round @click="saveImg">确认</el-button>
    </el-button-group>
    <el-text style="margin-left: 30px;" size="large">摄像头：</el-text>
    <el-button-group>
      <el-button round :type="qicStore.isCameraOnFirstCheck ? 'warning' : 'danger'"
        @click="qicStore.isCameraOnFirstCheck = !qicStore.isCameraOnFirstCheck" >
        {{qicStore.isCameraOnFirstCheck ? '关闭' : '打开'}}</el-button>
    </el-button-group>
    <div>
      <el-image :preview-src-list="[imgurl]" :src="imgurl"
        :initial-index="4" :zoom-rate="1.2" :max-scale="7" :min-scale="0.2"
        style="width: 100px; height: 100px" fit="contain" />
    </div>
  </div>
</template>

<style scoped lang="less">
.main {
  width: 500px;
  height: 500px;
  margin: auto auto;
}

.camera_video {
  width: 100%;
  height: 100%;
  border: 2px black solid;
}
</style>