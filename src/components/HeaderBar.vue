<template>
  <header class="header-bar">
    <button class="host-btn" @click="goToCreate">대회 주최하기</button>
    <img class="logo" :src="logo" alt="Logo" @click="goToHome" />
    <div class="auth-buttons">
      <button v-if="!isLoggedIn" class="login-btn" @click="goToLogin">로그인</button>
      <div v-else class="profile-menu">
        <button class="profile-btn" @click="toggleMenu">
          <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
        </button>
        <div v-if="showMenu" class="dropdown-menu">
          <button @click="goToProfile">프로필</button>
          <button @click="handleLogout">로그아웃</button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { authAPI } from '../api'

export default {
  data() {
    return {
      logo: require('@/image/logo.png'),
      isLoggedIn: false,
      showMenu: false
    }
  },
  created() {
    this.syncLoginState()
  },
  mounted() {
    window.addEventListener('storage', this.syncLoginState)
  },
  beforeUnmount() {
    window.removeEventListener('storage', this.syncLoginState)
  },
  methods: {
    syncLoginState() {
      this.isLoggedIn = !!localStorage.getItem('accessToken')
    },
    goToCreate() {
      this.$router.push('/create')
    },
    goToLogin() {
      this.$router.push('/login')
    },
    goToProfile() {
      this.$router.push('/mypage')
      this.showMenu = false
    },
    goToHome() {
      this.$router.push('/')
    },
    toggleMenu() {
      this.showMenu = !this.showMenu
    },
    async handleLogout() {
      try {
        await authAPI.logout()
        localStorage.removeItem('accessToken')
        localStorage.removeItem('tokenType')
        localStorage.removeItem('accessTokenExpiresIn')
        this.syncLoginState()
        this.showMenu = false
        this.$router.push('/')
      } catch (error) {
        console.error('Logout failed:', error)
      }
    }
  },
  watch: {
    '$route'() {
      this.syncLoginState()
    }
  }
}
</script>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px 8px 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
}

.host-btn {
  background-color: #222;         /* 딥 블랙 계열 배경 */
  color: #fff;                    /* 흰색 텍스트 */
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.host-btn:hover {
  background-color: #444;      
}

.auth-buttons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.login-btn {
  background-color: #4a90e2;
  color: white;
  font-size: 14px;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s ease;
}

.login-btn:hover {
  background-color: #357abd;
}

.profile-menu {
  position: relative;
}

.profile-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding-bottom: 8px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #eee;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-width: 120px;
  z-index: 1000;
}

.dropdown-menu button {
  display: block;
  width: 100%;
  padding: 8px 16px;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  color: #333;
  font-size: 14px;
}

.dropdown-menu button:hover {
  background-color: #f5f5f5;
}

.logo {
  height: 60px;
  object-fit: contain;
  cursor: pointer;
}
</style>
