import { createRouter, createWebHashHistory } from 'vue-router' // createWebHistory createWebHashHistory
import { routes } from './routes'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes
})
export default router
