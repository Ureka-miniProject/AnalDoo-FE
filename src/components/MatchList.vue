<template>
  <div class="match-list">
    <router-link
      v-for="match in matchData"
      :key="match.id"
      :to="`/match/${match.id}`"
      class="match-item-link"
      style="text-decoration: none; color: inherit"
    >
      <div class="match-item">
        <div class="match-left">
          <div class="match-date">{{ match.matchDate }}</div>
          <div class="recruit-period">{{ match.recruitPeriod }}</div>
        </div>
        <div class="match-right">
          <div class="match-title">{{ match.title }}</div>
          <div class="match-location">{{ match.location }}</div>
        </div>
      </div>
    </router-link>
  </div>
</template>


<script>
export default {
  data() {
    return {
      matchData: [
        {
          id: 1,
          title: '2025 아마추어 챔피언십',
          recruitPeriod: '4/1 ~ 4/15',
          matchDate: '11:00',
          location: '광주 빛고을 체육관 2층 강당'
        },
        {
          id: 2,
          title: '전국 아마 리그',
          recruitPeriod: '4/5 ~ 4/20',
          matchDate: '14:30',
          location: '부산 시민체육관 A구장'
        }
      ]
    }
  }
}
</script>


<style scoped>
.match-list {
  background: #fff;
  padding: 0 0 16px 0;
}
.match-item-link {
  display: block;
}
.match-item {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 16px 20px;
  transition: background 0.2s;
}
.match-item:hover {
  background: #f0f6ff;
}
.match-left {
  width: 70px;
  text-align: center;
  margin-right: 16px;
  flex-shrink: 0;
}
.match-date {
  font-size: 18px;
  font-weight: bold;
  color: #ff6200;
}
.recruit-period {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
.match-right {
  flex: 1;
}
.match-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}
.match-location {
  font-size: 13px;
  color: #666;
}

</style> 