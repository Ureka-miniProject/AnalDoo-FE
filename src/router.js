import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/Home.vue'
import MatchDetail from './components/MatchDetail.vue'
import CreateMatch from './components/CreateMatch.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/match/:id', component: MatchDetail, props: true },
  { path: '/create', component: CreateMatch }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 