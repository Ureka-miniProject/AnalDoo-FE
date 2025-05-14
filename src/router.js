import { createRouter, createWebHistory } from 'vue-router'
import CompetitionDetail from './components/CompetitionDetail.vue'
import CreateCompetition from './components/CreateCompetition.vue'
import Home from './components/Home.vue'
import Login from './components/Login.vue'
import Signup from './components/Signup.vue'

const routes = [
  { path: '/', component: Home },
  { path: '/competition/:id', component: CompetitionDetail, props: true },
  { path: '/create', component: CreateCompetition },
  { path: '/login', component: Login },
  { path: '/signup', component: Signup }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 