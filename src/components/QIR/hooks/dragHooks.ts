import { Ref, onMounted, ref, watch } from "vue"

import { useQirPinia } from "../../../store/qir"

// 拖拽
function _useDragHooks (_pdfRef:Ref<any>) {

  let oldWidth = ref<number>(-1)
  const qicStore = useQirPinia()

  let isMove = ref<boolean>(false) // 是否移动, true:移动，false：不移动

  const _clickDrag = ()=>{
    isMove.value = !isMove.value
    _move(_pdfRef.value)
  }

  // 移动
  const _move = (doc:any)=>{
    document.body.addEventListener('mousemove', (ele)=>{
      if (isMove.value) {
        doc.style.zIndex = 999
        doc.style.position = 'fixed'
        doc.style.left = ele.clientX - 420 + 'px'
        doc.style.top = ele.clientY + 'px'
        doc.style.width = 900 + 'px'
      }
    })
  }

  // 还原
  const _clickReset = ()=>{
    _pdfRef.value.style.position = 'relative'
    _pdfRef.value.style.left = 0
    _pdfRef.value.style.top = 0
    _pdfRef.value.style.width = oldWidth.value + 'px'
  }

  onMounted(()=>{
    oldWidth.value = _pdfRef.value?.offsetWidth
  })

  watch(()=>qicStore.isShowView,(newVal, oldVal)=>{
    if (newVal !== oldVal && newVal === -1) {
      _clickReset()
    }
  })

  return {
    isMove, _clickDrag, _clickReset
  }
}

export default _useDragHooks