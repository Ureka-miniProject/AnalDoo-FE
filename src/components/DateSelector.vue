<template>
  <div
    class="date-selector"
    ref="scrollArea"
    @mousedown="onMouseDown"
    @mousemove="onMouseMove"
    @mouseup="onMouseUp"
    @mouseleave="onMouseUp"
    @touchstart="onTouchStart"
    @touchmove="onTouchMove"
    @touchend="onTouchEnd"
  >
    <transition-group
      name="slide"
      tag="div"
      class="date-list"
      :css="false"
      @before-enter="beforeEnter"
      @enter="enter"
      @after-enter="afterEnter"
    >
      <div
        v-for="date in dates"
        :key="date.value"
        class="date-item"
        :class="{active: selected === date.value}"
        @click="selectDate(date.value)"
      >
        <div class="date-num">{{ date.month }}/{{ date.day }}</div>
        <div class="date-week">{{ date.week }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script>
function getDates(startDay = null) {
  const days = ['일', '월', '화', '수', '목', '금', '토']
  const arr = []
  let today = new Date()
  if (startDay) {
    today = new Date(startDay)
  }
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
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
    const today = new Date()
    const start = today.toISOString().slice(0, 10)
    return {
      startDay: start,
      dates: getDates(start),
      selected: null,
      isDragging: false,
      dragStartX: 0,
      dragDelta: 0,
      slideDirection: 0 // -1: left, 1: right
    }
  },
  methods: {
    selectDate(val) {
      this.selected = val
      this.$emit('update:day', val)
    },
    // 마우스 드래그
    onMouseDown(e) {
      this.isDragging = true
      this.dragStartX = e.pageX
      this.dragDelta = 0
    },
    onMouseMove(e) {
      if (!this.isDragging) return
      this.dragDelta = e.pageX - this.dragStartX
    },
    onMouseUp() {
      if (!this.isDragging) return
      if (this.dragDelta > 40) {
        this.slideDirection = 1
        this.moveDates(-1)
      } else if (this.dragDelta < -40) {
        this.slideDirection = -1
        this.moveDates(1)
      }
      this.isDragging = false
      this.dragDelta = 0
    },
    // 터치 드래그
    onTouchStart(e) {
      this.isDragging = true
      this.dragStartX = e.touches[0].pageX
      this.dragDelta = 0
    },
    onTouchMove(e) {
      if (!this.isDragging) return
      this.dragDelta = e.touches[0].pageX - this.dragStartX
    },
    onTouchEnd() {
      if (!this.isDragging) return
      if (this.dragDelta > 40) {
        this.slideDirection = 1
        this.moveDates(-1)
      } else if (this.dragDelta < -40) {
        this.slideDirection = -1
        this.moveDates(1)
      }
      this.isDragging = false
      this.dragDelta = 0
    },
    moveDates(n) {
      this.startDay = addDays(this.startDay, n)
      this.dates = getDates(this.startDay)
    },
    // 트랜지션 애니메이션
    beforeEnter(el) {
      el.style.transition = 'none';
      el.style.transform = `translateX(${this.slideDirection * 100}%)`;
    },
    enter(el, done) {
      setTimeout(() => {
        el.style.transition = 'transform 0.3s cubic-bezier(.55,0,.1,1)';
        el.style.transform = 'translateX(0)';
        el.addEventListener('transitionend', done);
      });
    },
    afterEnter(el) {
      el.style.transition = '';
      el.style.transform = '';
      this.slideDirection = 0;
    }
  }
}
</script>

<style scoped>
.date-selector {
  display: flex;
  justify-content: space-between;
  background: #fff;
  padding: 0 12px 0 12px;
  border-bottom: 1px solid #eee;
  user-select: none;
  cursor: grab;
}
.date-list {
  display: flex;
  flex: 1;
}
.date-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  padding: 12px 0;
  color: #888;
  font-size: 15px;
  cursor: pointer;
  margin: 0 2px;
}
.date-item.active {
  color: #fff;
  background: #3578ff;
  border-radius: 16px;
}
.date-num {
  font-size: 16px;
  font-weight: bold;
}
.date-week {
  font-size: 13px;
}
</style> 