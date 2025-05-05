<template>
  <header class="header-bar">
    <button class="menu-btn">☰</button>
    <img class="logo" :src="logo" alt="Amateur Champs Logo" />
    <button class="profile-btn">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="8" r="4"/>
        <path d="M4 20c0-4 8-4 8-4s8 0 8 4"/>
      </svg>
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
  padding: 10px 20px 8px 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
}
.menu-btn, .profile-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}
.logo {
  height: 60px;
  object-fit: contain;
  display: block;
}

</style> 