<template>
  <footer class="footer-bar">
    <div class="footer-title">소셜 미디어</div>
    <div class="footer-links">
      <a href="#" class="footer-link">인스타그램</a>
      <a href="#" class="footer-link">유튜브</a>
    </div>
  </footer>
</template>

<style scoped>
.footer-bar {
  background: #222;
  color: #fff;
  padding: 16px 0 24px 0;
  text-align: left;
  margin-top: 24px;
}
.footer-title {
  font-size: 15px;
  font-weight: bold;
  margin-left: 20px;
  margin-bottom: 8px;
}
.footer-links {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 20px;
}
.footer-link {
  color: #fff;
  text-decoration: none;
  font-size: 15px;
  opacity: 0.85;
}
.footer-link:hover {
  text-decoration: underline;
  opacity: 1;
}
</style> 