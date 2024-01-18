// 导出PDF table
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { ref } from 'vue'
import { NotificationSuccess } from '../element-plus/JHNotification'

/** 导出PDF 内容: 表格
 * 
 * @param _pdfRef pdf ref
 * @param itemList 列表中的表格类名
 * @param fileName 导出的pdf的文件名
 * @param headSize 头部高度
 * @param footerSize 尾部高度
 * @param pageSize 一页高度
 */
export const downloadPDF = (_pdfRef:any, itemList:any, fileName: string, headSize: number, footerSize: number, pageHeight: number) =>{
  NotificationSuccess('开始下载')
  // console.log(fileName)
  // return
  // (1) 添加一些画面
  setPdfPage(_pdfRef, itemList, headSize, footerSize, pageHeight)
  // return

  // (2) 准备画布样式
  const style = ref<any>({
    dpi: 96, // 分辨率
    scale: 2, //设置缩放
    useCORS: true, // 允许canvas画布内 可以跨域请求外部链接图片，允许跨域请求
    bgColor: '#fff', // 背景颜色
    logging: false // 打印日志用的，可以不加默认为false
  })

  // (3) 画布
  console.log('准备画布 start')
  html2canvas(_pdfRef, style).then((canvas:any)=>{
    console.log('准备画布 end')
    canvas2Pdf(canvas, fileName, headSize, pageHeight)
  }).catch((err:any)=>{
    console.error(err)
  })
}


// 画布
/**
 * 
 * @param canvas 画布
 * @param fileName 文件名
 * @param headSize 头部高度(px, 不是画布的头部高度)
 * @param pageHeight pdf页面高度(px, 不是画布一页的高度)
 * 公式：1、+xx.toFixed(2) 保留两位小数, 记得加+(转为数值) 2、
 */
const canvas2Pdf = (canvas:any, fileName:string, headSize: number, pageHeight:number)=>{
  console.log('开始下载')
  console.log(canvas)
  // (1) 一些参数配置
  const canvasWidth = canvas.width
  const canvasHeight = canvas.height
  const _headHeight = +(595.28 / canvasWidth * headSize).toFixed(2)

  // a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
  const imgwidth = 595.28
  const imgHeight = +(595.28 / canvasWidth * canvasHeight).toFixed(2)

  let position = _headHeight // 页面偏移, 刚开始是页面头部
  let residueHeight = canvasHeight // 未生成的canvas页面高度
  
  // A4大小，210mm x 297mm，四边各保留10mm的边距，显示区域190x277
  // const pageHeight = Math.floor(277 * canvas.width / 190) + 20 //计算pdf高度
  // 如果 Math.floor(277 * canvas.width / 190) !== pageHeight, 那就用公式

  // console.log('canvasWidth ==> ', canvasWidth)
  // console.log('canvasHeight ==> ', canvasHeight)
  // console.log('_headHeight ==> ', _headHeight)
  // console.log('imgwidth ==> ', imgwidth)
  // console.log('imgHeight ==> ', imgHeight)
  // console.log('canvas.width ==> ', canvas.width)
  // console.log('pageHeight ==> ', pageHeight)
  // console.log('pageHeight ==> ', Math.floor(277 * canvas.width / 190))
  

  const pageData = canvas.toDataURL('image/jpeg', 1.0)
  // 第一个参数： l：横向  p：纵向
  // 第二个参数：测量单位（"pt"，"mm", "cm", "m", "in" or "px"）
	const pdf = new jsPDF('p', 'pt', 'a4')

  if (residueHeight < pageHeight) { // 如果剩余画布高度小于一页pdf高度(最后一个了)
    // 在pdf.addImage(pageData, 'JPEG', 左，上，宽度，高度)设置在pdf中显示
    pdf.addImage(pageData, 'JPEG', 0, headSize, imgwidth, imgHeight)
  }
  else { // 否则，不断循环
    while(residueHeight > 0) {
      pdf.addImage(pageData, 'JPEG', 0, position, imgwidth, imgHeight)

      residueHeight -= pageHeight
      position -= +(841.89 - +(_headHeight * 5 / 7).toFixed(2)).toFixed(2) //  5/7
      // console.log('position ==> ', position)

      // 避免添加空白页
      if (residueHeight > 0) {
        pdf.addPage()
      }
    }
  }

  console.log('下载完成')
  NotificationSuccess('下载完成')
  pdf.save(fileName + ".pdf")

}


/** 计算 设置pdf页面，一些表格内容超出页面(放空页面)
 * 
 * @param _pdfRef pdf ref
 * @param itemList 列表中的表格类名
 * @param headSize 头部高度(px, 不是画布的头部高度)
 * @param footerSize 尾部高度(px, 不是画布的尾部高度)
 * @param pageSize 页面大小
 */
const setPdfPage = (_pdfRef:any, itemList:any, headSize: number, footerSize: number, pageSize: number)=>{
  console.log(_pdfRef)
  console.log(itemList)
  // a4纸的尺寸[595.28,841.89]
  let size = 0 // 相加的大小
  let addSize = 0 // 添加的页面大小

  for(let i=0; i<itemList.length; i++) {
    if (i==0) size = headSize + footerSize

    // 一个表都大于页面，先不考虑(好像目前这个没有)

    if (size + itemList[i].offsetHeight > pageSize) { // 如果大于
      addSize = pageSize - size

      console.log('i 如果大于 ===> ', i)

      i--
      size = headSize + footerSize
      

      // 添加页面
      let newNode = addFooterElement(addSize)  //向pdf插入空白块的内容
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
      // sum += size
    }
    // 如果小于，再试试加一个
    else {
      size += itemList[i].offsetHeight
    }
  }
}

/** 创建div
 * 
 * @param remainingHeight 插入元素的高度
 * @param fillingHeight 
 * @returns div
 */
const addFooterElement = (remainingHeight:number, fillingHeight:number = 0)=> {
  console.log('添加的div高度', remainingHeight)
  const newNode = document.createElement('div')
  newNode.style.background = '#ffffff'
  newNode.style.width = 'calc(100% + 8px)'
  newNode.style.marginLeft = '-4px'
  newNode.style.marginBottom = '0px'
  newNode.classList.add('divRemove')
  newNode.style.height = (remainingHeight + fillingHeight) + 'px'
  return newNode
}
