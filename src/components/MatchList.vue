<template>
  <div class="match-list">
    <div v-if="competitions.length === 0 && !loading" class="no-matches">
      대회가 없습니다.
    </div>
    <div v-else class="match-items">
      <div v-for="competition in competitions" :key="competition.id" class="match-item" @click="goToDetail(competition.id)">
        <div class="match-left">
          <div class="match-time">{{ formatTime(competition.competitionTime) }}</div>
          <div class="match-period">
            {{ formatDate(competition.startDate) }} ~ {{ formatDate(competition.endDate) }}
          </div>
        </div>
        <div class="match-right">
          <div class="match-name">{{ competition.name }}</div>
          <div class="match-location">{{ competition.address }}</div>
        </div>
      </div>
      <div v-if="loading" class="loading-more">
        <div class="loading-text">로딩중입니다...</div>
      </div>
    </div>
  </div>
</template>

<script>
import { useRouter } from 'vue-router'

export default {
  name: 'MatchList',
  props: {
    competitions: {
      type: Array,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const router = useRouter()

    const formatDate = (dateString) => {
      const date = new Date(dateString)
      return `${date.getMonth() + 1}/${date.getDate()}`
    }

    const formatTime = (timeString) => {
      return timeString
    }

    const goToDetail = (id) => {
      router.push(`/match/${id}`)
    }

    return {
      formatDate,
      formatTime,
      goToDetail
    }
  }
}
</script>

<style scoped>
.match-list {
  background: #fff;
  padding: 0 0 16px 0;
}

.no-matches {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 18px;
}

.match-items {
  display: flex;
  flex-direction: column;
}

.match-item {
  display: flex;
  border-bottom: 1px solid #eee;
  padding: 16px 20px;
  cursor: pointer;
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

.match-time {
  font-size: 18px;
  font-weight: bold;
  color: #ff6200;
}

.match-period {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
}

.match-right {
  flex: 1;
}

.match-name {
  font-size: 16px;
  font-weight: 600;
  color: #222;
  margin-bottom: 4px;
}

.match-location {
  font-size: 13px;
  color: #666;
}

.loading-more {
  text-align: center;
  padding: 20px;
  color: #666;
  font-size: 16px;
  background: #f8f8f8;
  margin: 0 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.loading-text {
  animation: fadeInOut 1.5s infinite;
}

@keyframes fadeInOut {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

@media (max-width: 768px) {
  .match-item {
    padding: 12px 16px;
  }
  
  .match-left {
    width: 60px;
    margin-right: 12px;
  }
  
  .match-time {
    font-size: 16px;
  }
}
</style> 