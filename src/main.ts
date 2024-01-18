import { createApp } from 'vue'
import './assets/css/reset.css'
import './assets/css/page.css'
import './assets/css/base.css'
import './assets/css/sb_size.css'
import './assets/css/xj_scoll.css'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import { createPinia } from 'pinia'

import router from './router'

import App from './App.vue'

const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
const pinia = createPinia()

app.use(router)
app.use(pinia)
app.use(ElementPlus, { size: 'small', zIndex: 3000 } )
app.mount('#app')
