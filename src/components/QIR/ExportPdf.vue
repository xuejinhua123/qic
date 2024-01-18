<!-- 将表格导出成PDF -->
<script setup lang="ts">

import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
// import {downloadPDF} from "@/util/pdf.js"  //工具方法，导出操作
import { ref } from "vue"

const props = defineProps({
  _tableList: {
    type: Array
  }
})
const _pdf = ref<any>(null)
const handleExport = () =>{
  downloadPDF(_pdf.value)
}
const downloadPDF = (page:any) => {
  const style = ref<any>({
    dpi: 96, // 分辨率
    scale: 2, //设置缩放
    useCORS: true, // 允许canvas画布内 可以跨域请求外部链接图片，允许跨域请求
    bgColor: '#fff', // 背景颜色
    logging: false // 打印日志用的，可以不加默认为false
  })
  html2canvas(page, style).then((canvas:any)=> {
    canvas2PDF(canvas)
  }).catch((err:any)=>{
    console.error(err)
  })
}
const canvas2PDF = (canvas:any) => {
  let contentWidth = canvas.width
  let contentHeight = canvas.height

  // 一页pdf显示html页面生成的canvas高度;
  const pageHeight = (contentWidth / 592.28) * 841.89
   // 未生成pdf的html页面高度
   let leftHeight = contentHeight
   // 页面偏移
   let position = 20
   // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  let imgWidth = 595.28
  let imgHeight = (595.28 / contentWidth) * contentHeight
  // const ctx: any = canvas.getContext('2d')

  const pageData = canvas.toDataURL('image/jpeg', 1.0)
	const pdf = new jsPDF('p', 'pt', 'a4')
  if (leftHeight < pageHeight) {
		// 在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示；
		pdf.addImage(pageData, 'JPEG', 0, 0, imgWidth, imgHeight)
	  } else {
		// 分页
		while (leftHeight > 0) {
		  pdf.addImage(
			pageData,
			'JPEG',
			0,
			position,
			imgWidth,
			imgHeight
		  )
		  leftHeight -= pageHeight
		  position -= 841.89
		  // 避免添加空白页
		  if (leftHeight > 0) {
			pdf.addPage()
		  }
		}
	}
  // // 第一个参数： l：横向  p：纵向
  // // 第二个参数：测量单位（"pt"，"mm", "cm", "m", "in" or "px"）
  // let pdf = new jsPDF("p", "pt")

  // pdf.addImage(
  //   canvas.toDataURL("image/jpeg", 1.0),
  //   "JPEG",
  //   0,
  //   0,
  //   imgWidth,
  //   imgHeight
  // )

  pdf.save("导出.pdf")
}

</script>

<template>
  <div>
    <el-button round type="primary" @click="handleExport">导出</el-button>
    <div ref="_pdf" class="ex-pdf-box">
      <el-table
        :data="props._tableList" :border="true" size="small" style="width: 100%" :highlight-current-row="true">
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
</template>

<style scoped lang="less">
</style>