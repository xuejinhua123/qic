// 一些参数 item
const ITEM_SIZE = [
  12,
  15
]


// 下班时间
const OUT_TIMER = [
  '11:20:00', '16:30:00', '20:00:00'
]

/**
 * 前后多少秒之内解禁 半小时
 */
const OUT_STEP = 30 * 60
// 左右解禁0:左右判断，1：左判断，2：右判断
const OUT_B = 0


window.ITEM_SIZE = ITEM_SIZE
window.OUT_T = {
  OUT_TIMER,
  OUT_STEP,
  OUT_B
}

/*
  使用：
    const win:any = window
    const { TABLE_NAME, TABLE_SET } = win
*/