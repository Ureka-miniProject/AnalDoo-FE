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
        // 로그인 성공 시 accessToken만 저장 (refreshToken은 쿠키로 관리)
        const { accessToken, tokenType, accessTokenValidationTime } = response.data
        localStorage.setItem('accessToken', accessToken)
        localStorage.setItem('tokenType', tokenType)
        localStorage.setItem('accessTokenExpiresIn', accessTokenValidationTime)
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
  padding: 2rem;
  box-sizing: border-box;
}

.login-box {
  background: white;
  padding: 3.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
  margin: auto;
  box-sizing: border-box;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2.5rem;
  font-size: 2rem;
}

form {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.form-group {
  margin-bottom: 1.5rem;
  width: 100%;
  max-width: 400px;
}

label {
  display: block;
  margin-bottom: 0.8rem;
  color: #666;
  font-size: 1.1rem;
}

input {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1.1rem;
  box-sizing: border-box;
}

input:focus {
  outline: none;
  border-color: #4a90e2;
}

.login-button {
  width: 100%;
  max-width: 400px;
  padding: 1rem;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 2rem;
}

.login-button:hover {
  background-color: #357abd;
}

.login-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.additional-options {
  margin-top: 2rem;
  text-align: center;
}

.additional-options a {
  color: #4a90e2;
  text-decoration: none;
  font-size: 1rem;
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

@media (max-width: 600px) {
  .login-container {
    padding: 1rem;
  }

  .login-box {
    padding: 2rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }

  .form-group {
    max-width: 100%;
  }

  .login-button {
    max-width: 100%;
  }

  label {
    font-size: 1rem;
  }

  input {
    font-size: 1rem;
    padding: 0.875rem;
  }
}
</style> 