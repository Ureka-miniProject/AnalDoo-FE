<template>
  <div class="competition-list">
    <div v-if="isLoading" class="loading-state">로딩 중...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <template v-else>
      <router-link
        v-for="competition in competitions"
        :key="competition.id"
        :to="`/competition/${competition.id}`"
        class="competition-item-link"
        style="text-decoration: none; color: inherit"
      >
        <div class="competition-item">
          <div class="competition-left">
            <div class="competition-date">{{ formatTime(competition.competitionDate) }}</div>
            <div class="recruit-period">{{ formatPeriod(competition.startDate, competition.endDate) }}</div>
          </div>
          <div class="competition-right">
            <div class="competition-title">{{ competition.name }}</div>
            <div class="competition-location">{{ formatLocation(competition) }}</div>
          </div>
        </div>
      </router-link>
    </template>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'CompetitionList',
  data() {
    return {
      competitions: [],
      isLoading: true,
      error: null
    }
  },
  async created() {
    try {
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/api/v1/competitions`)
      this.competitions = response.data
      console.log('대회 목록:', response.data)
    } catch (error) {
      console.error('대회 목록 조회 실패:', error)
      this.error = '대회 목록을 불러오는데 실패했습니다.'
    } finally {
      this.isLoading = false
    }
  },
  methods: {
    formatTime(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    },
    formatPeriod(startDate, endDate) {
      if (!startDate || !endDate) return ''
      const start = new Date(startDate)
      const end = new Date(endDate)
      return `${start.getMonth() + 1}/${start.getDate()} ~ ${end.getMonth() + 1}/${end.getDate()}`
    },
    formatLocation(competition) {
      if (!competition) return ''
      return `${competition.local || ''} ${competition.street || ''} ${competition.detail || ''}`
    }
  }
}
</script>

<style scoped>
.competition-list {
  background: #fff;
  padding: 0 0 16px 0;
}
.competition-item-link {
  display: block;
}
.competition-item {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 16px 20px;
  transition: background 0.2s;
}
.competition-item:hover {
  background: #f0f6ff;
}
.competition-left {
  width: 70px;
  text-align: center;
  margin-right: 16px;
  flex-shrink: 0;
}
.competition-date {
  font-size: 18px;
  font-weight: bold;
  color: #ff6200;
}
.recruit-period {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}
.competition-right {
  flex: 1;
}
.competition-title {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}
.competition-location {
  font-size: 13px;
  color: #666;
}
.loading-state, .error-state {
  text-align: center;
  padding: 2rem;
  color: #666;
}
.error-state {
  color: #dc3545;
}
</style> 