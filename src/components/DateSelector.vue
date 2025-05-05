<template>
  <div class="date-selector-container">
    <button class="nav-button" @click="prevDay">‹</button>

    <div class="date-selector">
      <div class="date-list">
        <div
          v-for="date in dates"
          :key="date.value"
          class="date-item"
          :class="[
            { active: selected === date.value },
            getDayClass(date.week)
          ]"
          @click="selectDate(date.value)"
        >
          <div class="date-num">{{ date.day }}</div>
          <div class="date-week">{{ date.week }}</div>
        </div>
      </div>
    </div>

    <button class="nav-button" @click="nextDay">›</button>
  </div>
</template>

<script>
function getDates(startDay) {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const arr = []
  const base = new Date(startDay)

  for (let i = 0; i < 7; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    arr.push({
      value: d.toISOString().slice(0, 10),
      month: d.getMonth() + 1,
      day: d.getDate(),
      week: days[d.getDay()]
    })
  }
  return arr
}

function addDays(dateStr, n) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

export default {
  emits: ['update:day'],
  data() {
    const today = new Date().toISOString().slice(0, 10)
    return {
      startDay: today,
      dates: getDates(today),
      selected: today
    }
  },
  methods: {
    selectDate(val) {
      this.selected = val
      this.$emit('update:day', val)
    },
    prevDay() {
      this.startDay = addDays(this.startDay, -1)
      this.dates = getDates(this.startDay)
    },
    nextDay() {
      this.startDay = addDays(this.startDay, 1)
      this.dates = getDates(this.startDay)
    },
    getDayClass(week) {
      if (week === '일') return 'sunday'
      if (week === '토') return 'saturday'
      return 'weekday'
    }
  }
}
</script>

<style scoped>
.date-selector-container {
  display: flex;
  align-items: center;
  background: #fdfdfd;
  border-bottom: 1px solid #ddd;
  padding: 8px;
}

.nav-button {
  background: none;
  border: none;
  font-size: 20px;
  color: #555;
  cursor: pointer;
  padding: 0 12px;
  transition: color 0.3s;
}

.nav-button:hover {
  color: #f0852b; /* 톤 다운된 오렌지 */
}

.date-selector {
  flex: 1;
  overflow: hidden;
}

.date-list {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.date-item {
  flex: 1;
  cursor: pointer;
  text-align: center;
  padding: 10px 0;
  border-radius: 16px;
  font-size: 14px;
  transition: background 0.3s, color 0.3s;
}

.date-item.active {
  background: #ffe4c2;
  color: #ff7f27;    
  font-weight: bold;
}

.date-num {
  font-size: 16px;
  font-weight: bold;
}

.date-week {
  font-size: 13px;
}

/* 요일별 색상 */

</style> 