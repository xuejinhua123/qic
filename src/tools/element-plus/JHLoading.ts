import { ElLoading } from 'element-plus'
 
let loadingCount = 0
let loading: any
 
const startLoading = () => {
    loading = ElLoading.service({
        lock: true,
        text: '加载中……',
        background: 'rgba(0, 0, 0, 0.6)'
    })
}
 
const endLoading = () => {
    loading.close()
}
 
export const showLoading = () => {
    if (loadingCount === 0) {
        startLoading();
    }
    loadingCount += 1
}
 
export const hideLoading = () => {
    if (loadingCount <= 0) {
        return
    }
    loadingCount -= 1
    if (loadingCount === 0) {
        endLoading()
    }
}

// import { ElLoading } from 'element-plus'

// // 加载
// export const _localing = ():any => {
//   return ElLoading.service({
//     lock: true,
//     text: 'Loading',
//     background: 'rgba(0, 0, 0, 0.7)',
//   })
// }

// //关闭
// export const _closeLocal = (localing: any) => {
//   localing.close()
// }
