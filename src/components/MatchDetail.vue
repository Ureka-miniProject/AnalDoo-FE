<template>
  <div class="match-detail-page">
    <HeaderBar @click-logo="goHome" />

    <div class="match-detail-container">
      <!-- 왼쪽 정보 -->
      <div class="info-section">
        <h2 class="match-title">{{ match.name }}</h2>

        <div class="point-grid">
          <div class="point-item">🎯 {{ match.sportType }}</div>
          <div class="point-item">👥 {{ match.entryCount }} / {{ match.limitCount }}명</div>
        </div>

        <div class="recruit-period">📅 모집 기간: {{ formattedRecruitPeriod }}</div>
        <div class="host">🏅 개최자: {{ match.host }}</div>

        <div class="description-box">
          <h3>📋 대회 설명</h3>
          <p>{{ match.content }}</p>
        </div>
      </div>

      <!-- 오른쪽 정보 -->
      <div class="main-section">
        <div class="match-date">🗓️ {{ formattedMatchDate }}</div>
        <div class="match-location">📍 {{ match.address.fullAddress }}</div>
        <div class="price">{{ match.entryFee.toLocaleString() }}원</div>
        <button class="apply-btn">신청하기</button>
      </div>
    </div>
  </div>
</template>

<script>
import HeaderBar from './HeaderBar.vue'

export default {
  name: 'MatchDetail',
  components: { HeaderBar },
  data() {
    return {
      match: {
        id: 2,
        name: '풋살 페스티벌',
        content: '이 대회는 누구나 즐겁게 참여할 수 있는 친선 경기입니다. 경기 규칙은 현장 공지 예정이며, 페어플레이 정신을 중요시합니다.',
        period: {
          startDate: '2025-06-01',
          endDate: '2025-06-10'
        },
        matchDate: '2025-06-15 14:30',
        entryFee: 20000,
        entryCount: 10,
        limitCount: 12,
        reward: 300000,
        sportType: '풋살',
        host: '김희진',
        address: {
          fullAddress: '부산 시민체육관 A구장'
        }
      }
    }
  },
  computed: {
    formattedRecruitPeriod() {
      const s = new Date(this.match.period.startDate)
      const e = new Date(this.match.period.endDate)
      return `${s.getMonth() + 1}/${s.getDate()} ~ ${e.getMonth() + 1}/${e.getDate()}`
    },
    formattedMatchDate() {
      const d = new Date(this.match.matchDate)
      const day = ['일', '월', '화', '수', '목', '금', '토'][d.getDay()]
      const h = d.getHours().toString().padStart(2, '0')
      const m = d.getMinutes().toString().padStart(2, '0')
      return `${d.getMonth() + 1}월 ${d.getDate()}일 (${day}) ${h}:${m}`
    }
  },
  methods: {
    goHome() {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped>
.match-detail-page {
  background: #f7f7f7;
  min-height: 100vh;
}
.match-detail-container {
  display: flex;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 0 6px rgba(0, 0, 0, 0.05);
  gap: 32px;
  margin: 20px;
}

.info-section {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 14px;
}

.match-title {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 4px;
}

.point-grid {
  display: flex;
  gap: 13px;
  font-size: 15px;
  flex-wrap: wrap;
  padding-bottom: 10px;
}
.point-item {
  background: #f0f0f0;
  padding: 8px 12px;
  border-radius: 20px;
}

.recruit-period {
  font-size: 17px;
  color: #444;
}
.host {
  font-size: 17px;
  color: #222;
}

.description-box {
  background: #f9f9f9;
  padding: 16px;
  border-radius: 8px;
  margin-top: 16px;
}
.description-box h3 {
  margin-bottom: 8px;
  font-size: 15px;
  color: #444;
}
.description-box p {
  font-size: 14px;
  color: #333;
  line-height: 1.6;
}

.main-section {
  flex: 1.3;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 세로 중앙 정렬 */
  align-items: center;     /* 가로 중앙 정렬 */
  gap: 20px;
  padding: 24px;
  border: 1px solid #eee;
  border-radius: 12px;
  background: #fafafa;
  height: fit-content; /* 내용 기반 높이 */
  align-self: center;  /* 전체 컨테이너 중앙 정렬 */
}

.match-date {
  font-size: 18px;
  font-weight: 500;
  color: #333;
  text-align: center;
}

.match-location {
  font-size: 15px;
  color: #555;
  text-align: center;
  max-width: 180px;
}

.price {
  font-size: 20px;
  font-weight: bold;
  color: #666666;
}

.apply-btn {
  background: #3578ff;
  color: white;
  font-size: 16px;
  padding: 10px 24px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.apply-btn:hover {
  background: #245fd5;
}

</style>
