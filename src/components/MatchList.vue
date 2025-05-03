<template>
  <div class="match-list">
    <router-link
      v-for="n in 4"
      :key="n"
      :to="`/match/${n}`"
      class="match-item-link"
      style="text-decoration:none; color:inherit;"
    >
      <div class="match-item">
        <div class="match-date">4/3 ~ 5/3</div>
        <div class="match-desc">[5월 10일 경기] 광주 빛고을 체육관 2층 강당</div>
      </div>
    </router-link>
  </div>
</template>

<style scoped>
.match-list {
  background: #fff;
  padding: 0 0 16px 0;
}
.match-item-link {
  display: block;
}
.match-item {
  border-bottom: 1px solid #eee;
  padding: 16px 20px 8px 20px;
  transition: background 0.2s;
}
.match-item:hover {
  background: #f0f6ff;
}
.match-date {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 4px;
}
.match-desc {
  font-size: 15px;
  color: #222;
}
</style> 