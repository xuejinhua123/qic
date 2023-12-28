/// <reference types="vite/client" />

// declare module "pdfh5" {
//   import Pdfh5 from 'pdfh5'
//   export default Pdfh5
// }

// 解决路由导入模块爆红
// 引入文件爆红且不提示的处理
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component

}


//env.d.ts
// clearInterval(timeInterval) 爆红
declare namespace NodeJS {
  type Timer = any;
}