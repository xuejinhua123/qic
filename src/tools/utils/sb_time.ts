// 时间处理

// import { onMounted, onUnmounted } from 'vue'

/**
 * 
 * @param status 默认：yyyy-MM-ddHH:mm:ss 不填参数 0: yyyy-MM-dd 1: HH:mm:ss
 * @returns 
 */
export const getTime = (status: number = -1) => {
  const date = new Date()
  const year = date.getFullYear()
  let month:number|string = date.getMonth() + 1
  if (month < 10) month = '0' + month
  let day:number|string = date.getDate()
  if (day < 10) day = '0' + day
  let hour:number|string = date.getHours()
  if (hour < 10) hour = '0' + hour
  let minute:number|string = date.getMinutes()
  if (minute < 10) minute = '0' + minute
  let second:number|string = date.getSeconds()
  if (second < 10) second = '0' + second

  if (status === 0) return year + '-' + '' + month + '-' + day
  else if (status === 1) return hour + ':' + minute + ':' + second
  else return year + '-' + '' + month + '-' + day +' ' + hour + ':' + minute + ':' + second
}

// 时间 转换为秒 HH:mm:ss
export const timerToSecond = (time:string) =>{
  const arr = time.split(':')
  let _timer = 0
  _timer += +arr[0] * 60 * 60
  _timer += +arr[1] * 60
  _timer += +arr[2]
  return _timer
}

/** 判断两个时间是否在目标时间内左右多少秒 例：下班时间半小时内
 * 
 * @param timer 判断时间 HH:mm:ss
 * @param targe 目标时间
 * @param within 左右多少秒
 * @param _b 1: 判断左(targe - within <= timer <= targe)，2：判断右(targe <= timer <= targe + within)： 默认0：左右都判断
 * @returns 是否在目标时间内 true: 是，false：不是
 */
export const _isTimerToWithin = (timer:string, targe:string, within:number, _b: number = 0):boolean => {

  const _timer = timerToSecond(timer)
  const _targe = timerToSecond(targe)

  if (_b === 1) { // 判断左
    if (_timer >= _targe - within && _timer <= _targe) {
      // console.log(`${targe} - ${within} <= ${timer} <= ${targe}`)
      return true
    }
  } else if (_b === 2) { // 判断右
    if (_timer >= _targe && _timer <= _targe + within) {
      // console.log(`${targe} <= ${timer} <= ${targe} + ${within}`)
      return true
    }
  } else { // 左右判断
    if (_timer >= _targe - within && _timer <= _targe + within) {
      return true
    }
  }
  return false
}


// 定时器(无用处)
// start_time: 开始计时 end_timer: 结束计时 step: 步进 end_timer: 如果-1，无重大
export const setSB_Interval = (start_time: number, end_timer: number, step: number = 1): NodeJS.Timer | null => {
  step *=1000
  if (end_timer === -1) end_timer = 99999999
  // 定时器
  let timeInterval: NodeJS.Timer | null = null
  timeInterval = setInterval(() => {
    console.log('定时器 ==> ', start_time)
    start_time++
    if (start_time >= end_timer) {
      timeInterval && clearInterval(timeInterval)
    }
    console.log('定时器 ==> ', start_time)
  }, step)
  return timeInterval
  // onMounted(() => {
  //   timeInterval = setInterval(() => {
  //     console.log('11 ==> ', start_time)
  //     start_time++
  //     if (start_time >= end_timer) {
  //       timeInterval && clearInterval(timeInterval)
  //     }
  //     console.log('22 ==> ', start_time)
  //   }, step)
  // })

  // onUnmounted (() => {
  //   timeInterval && clearInterval(timeInterval)
  // })
}

// 定时器，fn:方法，step：多久执行一次，soon：是否立即执行，true：是 EPC 半小时解禁(qty>7500)
/**
 * 
 * @param fn 方法
 * @param step 多久执行一次 秒
 * @param soon 是否立即执行:true:是(默认)
 * @returns 定时器
 * 用途: (1) EPC (2) 半小时解禁(qty>7500)
 */
export const startSB_Interval = (fn: Function, step: number = 1, soon: boolean = true): NodeJS.Timer | null => {
  step *=1000
  if (soon) fn()
  // 定时器
  let timeInterval: NodeJS.Timer | null = null
  timeInterval = setInterval(() => {
    fn()
  }, step)
  return timeInterval
}


// 定时器 - 关闭
export const closeSB_Interval = (timeInterval: NodeJS.Timer | null, _name:string = '定时器') => {
  console.log('关闭定时器 ==> ', _name)
  timeInterval && clearInterval(timeInterval)
}


// 根据时间排序
// property是你需要排序传入的key,bol为true时是升序，false为降序
// console.log(data.sort(dateData("time", true)))
// console.log(data.sort(dateData("time", false)))
export const dateData = (property: any, bol: boolean) => {
	return function(a: string, b: string) {
		var value1 = a[property];
		var value2 = b[property];
		if (bol) {
			// 升序
			return Date.parse(value1) - Date.parse(value2);
		} else {
			// 降序
			return Date.parse(value2) - Date.parse(value1)
		}
	}
}