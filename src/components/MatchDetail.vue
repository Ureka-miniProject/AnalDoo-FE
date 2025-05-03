<template>
  <div class="match-detail">
    <h2>대회 상세 정보</h2>
    <div class="info-box">
      <div><strong>기간:</strong> {{ match.date }}</div>
      <div><strong>설명:</strong> {{ match.desc }}</div>
    </div>
    <button @click="$router.back()" class="back-btn">뒤로가기</button>
  </div>
</template>

<script>
const matchData = [
  { id: 1, date: '4/3 ~ 5/3', desc: '[5월 10일 경기] 광주 빛고을 체육관 2층 강당' },
  { id: 2, date: '4/3 ~ 5/3', desc: '[5월 10일 경기] 광주 빛고을 체육관 2층 강당' },
  { id: 3, date: '4/3 ~ 5/3', desc: '[5월 10일 경기] 광주 빛고을 체육관 2층 강당' },
  { id: 4, date: '4/3 ~ 5/3', desc: '[5월 10일 경기] 광주 빛고을 체육관 2층 강당' }
]
export default {
  props: ['id'],
  computed: {
    match() {
      return matchData.find(m => m.id === Number(this.id)) || {}
    }
  }
}
</script>

<style scoped>
.match-detail {
  padding: 32px 20px;
  background: #fff;
  min-height: 60vh;
}
.info-box {
  margin: 24px 0;
  font-size: 18px;
  background: #f7f7f7;
  padding: 20px;
  border-radius: 12px;
}
.back-btn {
  background: #3578ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 24px;
  font-size: 16px;
  cursor: pointer;
}
</style> 