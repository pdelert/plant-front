import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import(/* webpackChunkName: "about" */ '../views/ChartWrapper.vue')
  }
  // {
  //   path: '/chart',
  //   name: 'Chart',
  //   component: () => import(/* webpackChunkName: "about" */ '../views/ChartWrapper.vue')
  // }
]

const router = new VueRouter({
  routes
})

export default router
