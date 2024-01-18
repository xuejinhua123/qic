// **********cookie**************
// 创建cookie
// time：时间（s）,name：键，value：值
export const createCookie = (time: number, name: string, value: string) => {
  const expires = new Date(new Date().getTime() + time * 1000).toUTCString()
  document.cookie = name + '=' + value + ' ' + expires
}

// 获取cookie
export const getCookie = (name: string) => {
  document.cookie.startsWith(' ') && (name = name.substr(1))
}


// **********localStorage**************
// 创建
export const createLocalStorage = (name: string, value: string) => {
  localStorage.setItem(name, value)
}
// 读
export const readLocalStorage = (name: string):string => {
  return localStorage.getItem(name) || ''
}
// 修改
export const updateLocalStorage = (name: string, value: string) => {
  localStorage.setItem(name, value)
}
// 删除
export const deleteLocalStorage = (name: string) => {
  localStorage.removeItem(name)
}
// 清空
export const clearLocalStorage = () => {
  localStorage.clear()
}






// **********cookie**************
// 创建cookie
// 特点
/*
   1、有时效性，不设置有效期，默认关闭浏览器就失效。
   2、分域名储存，在当前域名下储存只能在当前域名下使用。
   3、分路径储存，根路径不能用子路径的数据，子路径可以用根路径的数据。
*/
// export const createCookie = () => {
//   // document.cookie = '键=值;expires=失效时间;path=要储存的路径;'
//   // toUTCString: 具体的日期转换为（根据 UTC）字符串; cookie识别的时间是世界时间，和我们北京时间有八个小时时差
//   // const date = new Date();
//   // date.setTime(date.getTime() + 24 * 60 * 60 * 1000); // 一天
//   // document.cookie = `cookie=cookie; expires=${date.toUTCString()}`;

//   // 或
//   /*
//         // document.cookie = '键=值;expires=失效时间;path=要储存的路径;'
//         var date = new Date()
//         date.setTime(date.getTime() - 8*3600*1000 + 2*3600*1000)
//         //上面的时间表示，当前时间戳 - 八小时 + 两个小时
//         //减八小时是为了获取到正确的世界时间，不然直接获取时间戳是北京时间
//         //加两个小时表示该数据有效时间为两个小时
//         document.cookie = `name=李四;expires=${date};path=/`
//         // path=/ 表示储存在根目录下
//   */

//     const expires = new Date(new Date().getTime() + 1000 * 60 * 10)
//     document.cookie = 'name=xiaoming; age=18; class=A ' + expires
// }

// // 读cookie
// export const readCookie = () => {
//   const cookie = document.cookie // 'name=xiaoming; age=18; class=A'
//   console.log(cookie)
// }

// // 更新cookie
// export const updateCookie = () => {
//   document.cookie = 'name=libai' // 'age=18; class=A; name=libai'
// }

// // 删除cookie
// export const deleteCookie = () => {
//   let time = new Date()
//   time.setTime(time.getTime() - 8*3600*1000 - 1)
//   document.cookie = 'name=libai;expires=' + time
//   console.log(document.cookie)
// }


// ***********************sessionStorage******************************
// sessionStorage的特点：浏览器刷新或者关闭时，数据会丢失


// ***********************localStorage******************************
// localStorage的特点：数据会永久储存，不清除的话一直都在
// 创建
// localStorage.setItem('name', 'xiaoming')

// 读
// localStorage.getItem('name') // 'xiaoming'

// 修改
// localStorage.setItem('name', 'libai')

// 删除
// localStorage.removeItem('name')'

// 清空
// localStorage.clear()

/*
以上三者的区别

存储大小

cookie：数据大小不能超过 4k
localStorage、sessionStorage：数据大小支持 5M 左右，不同浏览器存储大小不同
生命周期（有效时间）

cookie：需要设置有效期，过期后 cookie 就会销毁
localStorage：除非被手动清理，否则永久存在
sessionStorage：页面关闭（包括标签选项卡）后就会被销毁
存储形式

三者都是存储字符串类型，复杂对象可以采用 json 的 stringify 和 parse 方法来做处理

安全性

cookie：请求时一般会携带在 header 中

localStorage、sessionStorage：请求时不会携带
*/