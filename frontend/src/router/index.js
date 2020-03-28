import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '@/views/MainPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'MainPage',
    component: MainPage
  },
  {
    path: '/:userId',
    name: 'UserPage',
    component: () => import('@/views/UserPage.vue')
  }
]

const router = new VueRouter({
  routes
})

export default router
