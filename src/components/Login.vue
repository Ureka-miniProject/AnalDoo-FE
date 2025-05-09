<template>
  <div class="login-container">
    <div class="login-box">
      <h2>로그인</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            required
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요"
            required
            :disabled="isLoading"
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="login-button" :disabled="isLoading">
          {{ isLoading ? '로그인 중...' : '로그인' }}
        </button>
      </form>
      <div class="additional-options">
        <a href="#" @click.prevent="forgotPassword">비밀번호 찾기</a>
        <span class="divider">|</span>
        <a href="#" @click.prevent="goToSignup">회원가입</a>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../api'
import api from '../api'

export default {
  name: 'LoginPage',
  data() {
    return {
      email: '',
      password: '',
      error: '',
      isLoading: false
    }
  },
  methods: {
    async handleLogin() {
      this.error = ''
      this.isLoading = true
      
      try {
        const response = await authAPI.login({
          email: this.email,
          password: this.password
        })
        
        // 로그인 성공 시 토큰 저장
        const { accessToken, refreshToken, tokenType, accessTokenValidationTime, refreshTokenValidationTime } = response.data
        
        // 토큰 저장
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('refreshToken', refreshToken)
        localStorage.setItem('tokenType', tokenType)
        localStorage.setItem('accessTokenExpiresIn', accessTokenValidationTime)
        localStorage.setItem('refreshTokenExpiresIn', refreshTokenValidationTime)
        
        // Authorization 헤더 설정
        api.defaults.headers.common['Authorization'] = `${tokenType} ${accessToken}`
        
        // 홈페이지로 이동
        this.$router.push('/')
      } catch (error) {
        console.error('Login failed:', error)
        this.error = error.response?.data?.message || '로그인에 실패했습니다. 다시 시도해주세요.'
      } finally {
        this.isLoading = false
      }
    },
    forgotPassword() {
      // TODO: 비밀번호 찾기 페이지로 이동
      console.log('Forgot password clicked')
    },
    goToSignup() {
      this.$router.push('/signup')
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.login-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

.login-button {
  width: 100%;
  padding: 0.75rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 1rem;
}

.login-button:hover {
  background-color: #357abd;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.additional-options {
  margin-top: 1rem;
  text-align: center;
}

.additional-options a {
  color: #4a90e2;
  text-decoration: none;
  font-size: 0.9rem;
}

.additional-options a:hover {
  text-decoration: underline;
}

.divider {
  margin: 0 0.5rem;
  color: #ddd;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}
</style> 