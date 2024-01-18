// 调整 页面
export const _devicePixeRatio = ()=>{
  // 初始化 页面比例
  if (_getSystem()) {
    _correct()
    _watch()
  }
  // https://blog.csdn.net/weixin_56815090/article/details/130962367
}

// 获取系统类型
const _getSystem = ()=>{
  const agent = navigator.userAgent.toLowerCase()

  // 针对谷歌
  if (agent.indexOf('windows') >=0) return true
}

// 监听方法兼容写法
const _addHandler = (element:any, type: string, handler: any)=> {
  if (element.addEventListener) element.addEventListener(type, handler, false)
  else if (element.attachEvent) element.attachEvent('on' + type, handler)
  else element['on' + type] = handler
}

// 校正浏览器缩放比例
const _correct = ()=> {
  // 页面devicePixelRatio（设备像素比例）变化后，计算页面body标签zoom修改其大小，来抵消devicePixelRatio带来的变化。
  // const _style:any = document.body.style
  // console.log(document.body.style)
  // let { zoom } = _style
  // zoom = 1 / window.devicePixelRatio
  // const win:any = window
  // const { TABLE_PROCESS } = win
}

// 监听页面缩放
const _watch = ()=>{
  _addHandler(window, 'resize', _correct())
}


_devicePixeRatio()