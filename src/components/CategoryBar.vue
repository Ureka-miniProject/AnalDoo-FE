<template>
  <div class="category-bar">
    <div
      v-for="cat in categories"
      :key="cat.type"
      class="category-item"
      :class="{active: selected === cat.type}"
      @click="selectCategory(cat.type)"
    >
      <span class="icon">{{ cat.icon }}</span>
      <span>{{ cat.label }}</span>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['update:type'],
  data() {
    return {
      categories: [
        { type: '풋볼', label: '풋볼', icon: '⚽' },
        { type: '배드민턴', label: '배드민턴', icon: '🏸' },
        { type: '주짓수', label: '주짓수', icon: '🤼‍♂️' }
      ],
      selected: null
    }
  },
  methods: {
    selectCategory(type) {
      this.selected = type
      this.$emit('update:type', type)
    }
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
  transition: border 0.2s;
}
.category-item.active {
  border: 2px solid #3578ff;
}
.icon {
  font-size: 56px;
}
</style> 