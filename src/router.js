import { createRouter, createWebHistory } from 'vue-router'
import HomePage from './components/Home.vue'
import MatchDetail from './components/MatchDetail.vue'
import CreateMatch from './components/CreateMatch.vue'
import LoginPage from './components/Login.vue'
import SignupPage from './components/Signup.vue'
import MyPage from './components/MyPage.vue'
import api from './api'

const routes = [
  { path: '/', component: HomePage },
  { path: '/match/:id', component: MatchDetail, props: true },
  { path: '/create', component: CreateMatch },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignupPage },
  { path: '/mypage', component: MyPage }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 인증이 필요한 경로에 대한 라우터 가드 추가
router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('accessToken');
  const authRequiredPaths = ['/mypage', '/create'];

  if (authRequiredPaths.includes(to.path)) {
    if (!token) {
      // accessToken이 없으면 refreshToken으로 재발급 시도
      try {
        const response = await api.post('/api/v1/users/reissue');
        const accessToken = response.data?.accessToken;
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          next(); // 재발급 성공 시 원래 경로로 진행
        } else {
          next('/login');
        }
      } catch (e) {
        next('/login');
      }
      return;
    }
  }
  next();
});

export default router 