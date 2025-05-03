<template>
  <header class="header-bar">
    <button class="menu-btn">☰</button>
    <span class="logo">Amateur Champs</span>
    <button class="profile-btn">
      <svg width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 8-4 8-4s8 0 8 4"/></svg>
    </button>
  </header>
</template>

<style scoped>
.header-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 8px 20px;
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
  font-size: 20px;
  font-weight: bold;
}
</style> 