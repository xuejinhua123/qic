import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ref } from 'vue'
import { NotificationSuccess } from '../element-plus/JHNotification'
let noTableHeight = 0 //table外的元素高度

export const downloadPDF = (page:any, itemList:any, fileName: string) => {
  mangePdfSize(page, itemList)
  const style = ref<any>({
    dpi: 96, // 分辨率
    scale: 2, //设置缩放
    useCORS: true, // 允许canvas画布内 可以跨域请求外部链接图片，允许跨域请求
    bgColor: '#fff', // 背景颜色
    logging: false // 打印日志用的，可以不加默认为false
  })
  console.log('准备画布 start')
  NotificationSuccess('准备画布')
  html2canvas(page, style).then((canvas:any)=> {
    console.log('准备画布 end')
    canvas2PDF(canvas, fileName)
    // canvas2PDF2(canvas)
  }).catch((err:any)=>{
    console.error(err)
  })
}
const canvas2PDF = (canvas:any, fileName: string) => {
  console.log('开始下载')
  NotificationSuccess('开始下载')
  let contentWidth = canvas.width
  let contentHeight = canvas.height
  // 一页pdf显示html页面生成的canvas高度;
  // const pageHeight = (contentWidth / 592.28) * 841.89
  const pageHeight = Math.floor(277 * canvas.width / 190) + 20 //计算pdf高度
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
      // console.log('leftHeight ==> ', leftHeight)
      // console.log('position ==> ', position)
		  pdf.addImage(pageData, 'JPEG', 0, position, imgWidth, imgHeight)
		  leftHeight -= pageHeight
		  position -= 841.89
		  // 避免添加空白页
		  if (leftHeight > 0) {
			pdf.addPage()
		  }
		}
	}
  console.log('下载完成')
  NotificationSuccess('下载完成')
  pdf.save(fileName + ".pdf")
}

// const canvas2PDF2 = (canvas:any, type:any = '')=>{
//   let pdf = new jsPDF('p', 'mm', 'a4') // A4纸，纵向
//   let ctx = canvas.getContext('2d')
//   let a4w = type ? 277 : 190; var a4h = type ? 190 : 277 // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
//   // let a4w = canvas.width
//   // let a4h = canvas.height
//   let imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
//   let renderedHeight = 0
//   while (renderedHeight < canvas.height) {
//     let page:any = document.createElement('canvas')
//     page.width = canvas.width
//     page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页

//     // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
//     page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
//     pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距

//     renderedHeight += imgHeight
//     if (renderedHeight < canvas.height) {
//       pdf.addPage()// 如果后面还有内容，添加一个空页
//     }
//     // delete page;
//   }
//   // 保存文件
//   pdf.save('xx.pdf')
// }

// 操作pdf
const mangePdfSize = (page:any, itemList:any)=>{
  console.log('page.scrollWidth ==> ', page.scrollWidth)
  
  const pageHeight = Math.floor(277 * page.scrollWidth / 190) + 20 //计算pdf高度
  console.log('pageHeight ==> ', pageHeight)
  console.log('计算中开始')
  for (let i = 0; i < itemList.length; i++) { //循环获取的元素
    const multiple = Math.ceil((itemList[i].offsetTop + itemList[i].offsetHeight) / pageHeight) //元素的高度
    if (isSplit(itemList, i, multiple * pageHeight)) { //计算是否超出一页
      let _H:number = 0 //向pdf插入空白块的内容高度
      if (itemList[i].localName !== 'tr') { //判断是不是表格里的内容
        _H = multiple * pageHeight - (itemList[i].offsetTop + itemList[i].offsetHeight) + 20 // 20是头部的那个边距
        // if (multiple > 1) { // 解决小bug
        //   console.log(_H)
        //   _H -= 64
        //   console.log(_H)
        // }
        console.log(`multiple=${multiple}, pageHeight=${pageHeight}, itemList[i].offsetTop=${itemList[i].offsetTop}, itemList[i].offsetHeight=${itemList[i].offsetHeight}`)
      } else {
        console.log('零星星')
        _H = multiple * pageHeight - (itemList[i].offsetTop + itemList[i].offsetHeight + noTableHeight) + 20
      }
      var newNode = getFooterElement(_H)  //向pdf插入空白块的内容
      const divParent = itemList[i].parentNode // 获取该div的父节点
      const next = itemList[i].nextSibling // 获取div的下一个兄弟节点
      // 判断兄弟节点是否存在
      if (next) {
        // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
        divParent.insertBefore(newNode, next)
      } else {
        // 否则向节点添加最后一个子节点
        divParent.appendChild(newNode)
      }
    }
  }
  console.log('计算中完成')
}

// pdf截断需要一个空白位置来补充
const getFooterElement = (remainingHeight:number, fillingHeight:number = 0) => {
  console.log('插入元素的高度 ==> ', remainingHeight)
  const newNode = document.createElement('div')
  newNode.style.background = '#ffffff'
  newNode.style.width = 'calc(100% + 8px)'
  newNode.style.marginLeft = '-4px'
  newNode.style.marginBottom = '0px'
  newNode.classList.add('divRemove')
  newNode.style.height = (remainingHeight + fillingHeight) + 'px'
  return newNode
}
const isSplit = (nodes:any, index:number, pageHeight:number) => {
  // 判断是不是tr 如果不是高度存起来
  // 表格里的内容要特殊处理
  // tr.offsetTop 是tr到table表格的高度
  // 所以计算高速时候要把表格外的高度加起来
  // 生成的pdf没有表格了这里可以不做处理 直接计算就行
  if (nodes[index].localName !== 'tr') {  //判断元素是不是tr
    noTableHeight += nodes[index].clientHeight
  }

  if (nodes[index].localName !== 'tr') {
    return nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
  } else {
    return nodes[index].offsetTop + nodes[index].offsetHeight + noTableHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight + noTableHeight > pageHeight
  }
}


/*
第二种情况
// 页面导出为pdf格式 //title表示为下载的标题，html表示document.querySelector('#myPrintHtml')
let noTableHeight = 0 //table外的元素高度
export const htmlPdf = (title:any, html:any, fileList:any, type:any) => {// type传有效值pdf则为横版
  if (fileList) {
    const pageHeight = Math.floor(277 * html.scrollWidth / 190) + 20 //计算pdf高度
    for (let i = 0; i < fileList.length; i++) { //循环获取的元素
      const multiple = Math.ceil((fileList[i].offsetTop + fileList[i].offsetHeight) / pageHeight) //元素的高度
      if (isSplit(fileList, i, multiple * pageHeight)) { //计算是否超出一页
        let _H:string|number = '' //向pdf插入空白块的内容高度
        if (fileList[i].localName !== 'tr') { //判断是不是表格里的内容
          _H = multiple * pageHeight - (fileList[i].offsetTop + fileList[i].offsetHeight)
        } else {
          _H = multiple * pageHeight - (fileList[i].offsetTop + fileList[i].offsetHeight + noTableHeight) + 20
        }
        let newNode = getFooterElement(_H)  //向pdf插入空白块的内容
        const divParent = fileList[i].parentNode // 获取该div的父节点
        const next = fileList[i].nextSibling // 获取div的下一个兄弟节点
        // 判断兄弟节点是否存在
        if (next) {
          // 存在则将新节点插入到div的下一个兄弟节点之前，即div之后
          divParent.insertBefore(newNode, next)
        } else {
          // 否则向节点添加最后一个子节点
          divParent.appendChild(newNode)
        }
      }
    }
  }
  html2canvas(html, {
    allowTaint: false,
    logging: false,
    useCORS: true,
    scale: 1 // 按比例增加分辨率
  }).then(canvas => {
    let pdf = new jsPDF('p', 'mm', 'a4') // A4纸，纵向
    let ctx:any = canvas.getContext('2d')
    let a4w = type ? 277 : 190; let a4h = type ? 190 : 277 // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
    let imgHeight = Math.floor(a4h * canvas.width / a4w) // 按A4显示比例换算一页图像的像素高度
    let renderedHeight = 0
    while (renderedHeight < canvas.height) {
      let page:any = document.createElement('canvas')
      page.width = canvas.width
      page.height = Math.min(imgHeight, canvas.height - renderedHeight)// 可能内容不足一页

      // 用getImageData剪裁指定区域，并画到前面创建的canvas对象中
      page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0)
      pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', 10, 10, a4w, Math.min(a4h, a4w * page.height / page.width)) // 添加图像到页面，保留10mm边距

      renderedHeight += imgHeight
      if (renderedHeight < canvas.height) {
        pdf.addPage()// 如果后面还有内容，添加一个空页
      }
      // delete page;
    }
    // 保存文件
    pdf.save(title + '.pdf')
  })
}
// pdf截断需要一个空白位置来补充
const getFooterElement = (remainingHeight:any, fillingHeight = 0) => {
  const newNode = document.createElement('div')
  newNode.style.background = '#ffffff'
  newNode.style.width = 'calc(100% + 8px)'
  newNode.style.marginLeft = '-4px'
  newNode.style.marginBottom = '0px'
  newNode.classList.add('divRemove')
  newNode.style.height = (remainingHeight + fillingHeight) + 'px'
  return newNode
}
const isSplit = (nodes:any, index:any, pageHeight:any) => {
  // 判断是不是tr 如果不是高度存起来
  // 表格里的内容要特殊处理
  // tr.offsetTop 是tr到table表格的高度
  // 所以计算高速时候要把表格外的高度加起来
  // 生成的pdf没有表格了这里可以不做处理 直接计算就行
  if (nodes[index].localName !== 'tr') {  //判断元素是不是tr
    noTableHeight += nodes[index].clientHeight
  }

  if (nodes[index].localName !== 'tr') {
    return nodes[index].offsetTop + nodes[index].offsetHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight > pageHeight
  } else {
    return nodes[index].offsetTop + nodes[index].offsetHeight + noTableHeight < pageHeight && nodes[index + 1] && nodes[index + 1].offsetTop + nodes[index + 1].offsetHeight + noTableHeight > pageHeight
  }
}

<template>
	<div>
    	<button class="primary-btn" @click="handleExport">导出</button>
        <div class="check-wrapper" id="pdfRef">
      		<div class="page1-box pdfRef">11</div>
      		<div class="page2-box pdfRef">11</div>
      		<div class="page3-box pdfRef">11</div>
      		<div class="page4-box pdfRef">11</div>
      		<div class="page5-box pdfRef">11</div>
      		<div class="page6-box pdfRef">11</div>
      		<div class="page7-box pdfRef">11</div>
      		<div class="page8-box pdfRef">11</div>
      	</div>
	</div>
</template>
<script setup>
	// 引入方法
	import { htmlPdf } from "@/utils/htmlToPDF.js"  
	// 导出成PDF
	const handleExport = (name) => {
	  var fileName= '投资评审报告'
	  const fileList = document.getElementsByClassName('pdfRef')   // 很重要
	  htmlPdf(fileName, document.querySelector('#pdfRef'), fileList)
	}
</script>


const _pdf = ref<any>(null)
const handleExport = () =>{
  var fileName= '投资评审报告'
	const fileList = document.getElementsByClassName('pdfRef')   // 很重要
	htmlPdf(fileName, _pdf.value, fileList, _pdf.value)
}

**/



/*
// 第一种设计
const _pdf = ref<any>(null)
const handleExport = () =>{
  downloadPDF(_pdf.value)
}
export const downloadPDF = (page:any) => {
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
  pdf.save("导出.pdf")
}
*/

/*
// 第0种设计
let contentWidth = canvas.width
let contentHeight = canvas.height

//a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
let imgWidth = 595.28
let imgHeight = 592.28/contentWidth * contentHeight
// 第一个参数： l：横向  p：纵向
// 第二个参数：测量单位（"pt"，"mm", "cm", "m", "in" or "px"）
let pdf = new jsPDF("p", "pt")

pdf.addImage(
  canvas.toDataURL("image/jpeg", 1.0),
  "JPEG",
  0,
  0,
  imgWidth,
  imgHeight
)
*/