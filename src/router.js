import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/Home.vue'
import MatchDetail from './components/MatchDetail.vue'
import CreateMatch from './components/CreateMatch.vue'
import LoginPage from './components/Login.vue'
import SignupPage from './components/Signup.vue'

const routes = [
  { path: '/', component: HomePage },
  { path: '/match/:id', component: MatchDetail, props: true },
  { path: '/create', component: CreateMatch },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 