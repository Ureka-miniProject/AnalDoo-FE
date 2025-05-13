<template>
  <div class="category-bar">
    <div
      v-for="cat in categories"
      :key="cat.type"
      class="category-item"
      :class="{active: selected === cat.type}"
      @click="selectCategory(cat.type)"
    >
      <span class="icon">{{ getSportIcon(cat.type) }}</span>
      <span>{{ getSportLabel(cat.type) }}</span>
    </div>
  </div>
</template>

<script>
import { getSportIcon, getSportLabel } from '@/constants/sportIcons'

export default {
  emits: ['update:type'],
  data() {
    return {
      categories: [
        { type: 'FOOTBALL' },
        { type: 'BADMINTON' },
        { type: 'JIUJITSU' }
      ],
      selected: null
    }
  },
  methods: {
    selectCategory(type) {
      this.selected = type
      this.$emit('update:type', type)
    },
    getSportIcon,
    getSportLabel
  }
}
</script>

<style scoped>
.category-bar {
  display: flex;
  gap: 4vw;
  justify-content: space-around;
  background: #f7f7f7;
  padding: 24px 0 16px 0;
}
.category-item {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 2px 8px #0001;
  width: 30vw;
  min-width: 260px;
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 700;
  gap: 16px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: all 0.2s ease;
}

.category-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.category-item.active {
  border: 2px solid #3578ff;
  box-shadow: 0 4px 12px rgba(53, 120, 255, 0.2);
}

.icon {
  font-size: 56px;
}
</style> 