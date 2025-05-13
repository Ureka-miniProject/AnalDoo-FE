<template>
  <div class="app">
    <HeaderBar @click-logo="goHome" />
  <router-view />
  </div>
</template>

<script>
import HeaderBar from './components/HeaderBar.vue'

export default {
  name: 'App',
  components: {
    HeaderBar
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  background: #f7f7f7;
  min-height: 100vh;
}
</style> 