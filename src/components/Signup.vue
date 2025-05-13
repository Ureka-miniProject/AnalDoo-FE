<template>
  <div class="signup-container">
    <div class="signup-box">
      <h2>회원가입</h2>
      <form @submit.prevent="handleSignup">
        <div class="form-group">
          <label for="email">이메일</label>
          <input
            type="email"
            id="email"
            v-model="email"
            placeholder="이메일을 입력하세요"
            required
            :disabled="isLoading"
            :class="{ 'error-input': emailError }"
          />
          <span v-if="emailError" class="field-error">{{ emailError }}</span>
        </div>
        <div class="form-group">
          <label for="password">비밀번호</label>
          <input
            type="password"
            id="password"
            v-model="password"
            placeholder="비밀번호를 입력하세요 (8-20자)"
            required
            minlength="8"
            maxlength="20"
            :disabled="isLoading"
          />
        </div>
        <div class="form-group">
          <label for="nickname">닉네임</label>
          <input
            type="text"
            id="nickname"
            v-model="nickname"
            placeholder="닉네임을 입력하세요 (2-20자)"
            required
            minlength="2"
            maxlength="20"
            :disabled="isLoading"
            :class="{ 'error-input': nicknameError }"
          />
          <span v-if="nicknameError" class="field-error">{{ nicknameError }}</span>
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" class="signup-button" :disabled="isLoading">
          {{ isLoading ? '가입 중...' : '회원가입' }}
        </button>
      </form>
      <div class="additional-options">
        <span>이미 계정이 있으신가요?</span>
        <a href="#" @click.prevent="goToLogin">로그인</a>
      </div>
    </div>
  </div>
</template>

<script>
import { authAPI } from '../api'

export default {
  name: 'SignupPage',
  data() {
    return {
      email: '',
      password: '',
      nickname: '',
      error: '',
      emailError: '',
      nicknameError: '',
      isLoading: false
    }
  },
  methods: {
    async handleSignup() {
      this.error = ''
      this.emailError = ''
      this.nicknameError = ''
      this.isLoading = true
      
      try {
        await authAPI.register({
          email: this.email,
          password: this.password,
          nickname: this.nickname,
          role: 'PARTICIPANT'
        })
        
        // 회원가입 성공 시 로그인 페이지로 이동
        this.$router.push('/login')
      } catch (error) {
        console.error('Signup failed:', error)
        const errorMessage = error.response?.data?.message || '회원가입에 실패했습니다. 다시 시도해주세요.'
        
        // 이메일 중복 체크
        if (errorMessage.includes('이메일') || errorMessage.includes('email')) {
          this.emailError = '이미 사용 중인 이메일입니다.'
        }
        // 닉네임 중복 체크
        else if (errorMessage.includes('닉네임') || errorMessage.includes('nickname')) {
          this.nicknameError = '이미 사용 중인 닉네임입니다.'
        }
        // 기타 에러
        else {
          this.error = errorMessage
        }
      } finally {
        this.isLoading = false
      }
    },
    goToLogin() {
      this.$router.push('/login')
    }
  }
}
</script>

<style scoped>
.signup-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 2rem;
  box-sizing: border-box;
}

.signup-box {
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

.error-input {
  border-color: #dc3545;
}

.field-error {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: block;
}

.signup-button {
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

.signup-button:hover {
  background-color: #357abd;
}

.signup-button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.additional-options {
  margin-top: 2rem;
  text-align: center;
  color: #666;
  font-size: 1rem;
}

.additional-options a {
  color: #4a90e2;
  text-decoration: none;
  margin-left: 0.5rem;
  font-size: 1rem;
}

.additional-options a:hover {
  text-decoration: underline;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  text-align: center;
}

@media (max-width: 600px) {
  .signup-container {
    padding: 1rem;
  }

  .signup-box {
    padding: 2rem;
  }

  h2 {
    font-size: 1.75rem;
    margin-bottom: 2rem;
  }

  .form-group {
    max-width: 100%;
  }

  .signup-button {
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