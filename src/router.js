import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/Home.vue'
import MatchDetail from './components/MatchDetail.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/match/:id', component: MatchDetail, props: true }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 