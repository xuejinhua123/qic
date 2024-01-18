<!-- 显示PDF模块 -->
<script setup lang="ts">

import { watch } from 'vue' 

import { useQirPinia } from '../../store/qir'

const qicStore = useQirPinia()

// const props = defineProps({
//   pdfUrl: {
//     type: String
//   }
// })

watch(()=>qicStore.pdf_url, (newVal, oldVal)=> {
  console.log('pdf ==》《 ', newVal, oldVal)
  if (newVal !== oldVal) {
    console.log('pdf ==》《 ', newVal)
  }
})


// const arr = ref<Array<string>>([])
// const filterArr = computed(()=> {
//   arr.value.filter(v=>v=== '')
// })

</script>
<template>
  <div style="width: calc(100% - 4px);"><iframe scrolling="auto" :src="qicStore.pdf_url" width="100%" height="700px"></iframe></div>
</template>

<style scoped lang="less">
</style>


<!-- pdfh5 -->

<!-- 显示PDF模块 -->
<!-- <script setup lang="ts">
import Pdfh5 from "pdfh5"  // 这两个一定要引入
import { ref, onMounted } from "vue";
// import "pdfh5/css/pdfh5.css" // 这两个一定要引入， 这个是在加载时，顶部会出来一个加载进度条和一些其他的样式

let pdf5 = ref<any>({})

const props = defineProps({
  pdfUrl: {
    type: String
  }
})


onMounted(() => {
  pdf5 = new Pdfh5("#demo", {
  pdfurl: props.pdfUrl, // pdf 地址，请求的地址需要为线上的地址，测试的本地的地址是不可以的
  lazy: true, // 是否懒加载
  withCredentials: true,
  renderType: "svg",
  maxZoom: 3, //手势缩放最大倍数 默认3
  scrollEnable: true, //是否允许pdf滚动
  zoomEnable: true, //是否允许pdf手势缩放
  scale: 1 // pdf渲染比例，默认是1.5
})
pdf5.on("complete", function (status: any, msg: any, time: any) {
        console.log("状态：" + status +"，信息：" +msg +"，耗时：" + time + "毫秒，总页数：" + pdf5.totalNum);
    })
});
</script>
<template>
  <div class="wrap">
    <div id="demo"></div>
</iframe>
  </div>
</template>

<style scoped lang="less">
@import 'pdfh5/css/pdfh5.css';

.wrap {
  width: 100%;
  height: 600px;
  background-color: #fff;
}
/* html,
body, */
#demo {
  width: 100%;
  height: 100%;
}
// 这里高度没有撑满
.viewerContainer {
  height: 100%;
}
</style> -->