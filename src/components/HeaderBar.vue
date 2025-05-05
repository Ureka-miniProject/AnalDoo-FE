<template>
  <header class="header-bar" @click="$emit('click-logo')">
    <button class="menu-btn">☰</button>
    <img class="logo" :src="logo" alt="Logo" />
    <button class="profile-btn">👤</button>
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
  padding: 16px 20px 8px 20px;
  background: #fff;
  border-bottom: 1px solid #eee;
  cursor: pointer;
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
}
</style>
