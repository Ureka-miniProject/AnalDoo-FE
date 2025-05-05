<template>
  <header class="header-bar">
    <button class="host-btn">대회 주최하기</button>
    <img class="logo" :src="logo" alt="Logo" @click="$emit('click-logo')" />
    <button class="profile-btn">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
    </button>
  </header>
</template>

<script>
export default {
  data() {
    return {
      logo: require('@/image/logo.png')
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

.profile-btn {
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  padding-bottom: 8px;
}

.logo {
  height: 60px;
  object-fit: contain;
  cursor: pointer;
}
</style>
