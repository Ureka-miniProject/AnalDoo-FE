<template>
  <div class="filter-bar">
    <div class="filter-options">
      <button 
        v-for="region in regions" 
        :key="region.value"
        :class="['filter-btn', { active: selectedRegion === region.value }]"
        @click="selectRegion(region.value)"
      >
        {{ region.label }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'FilterBar',
  setup(props, { emit }) {
    const selectedRegion = ref(null)
    
    const regions = [
      { label: '전체', value: null },
      { label: '서울', value: 'SEOUL' },
      { label: '대구', value: 'DAEGU' },
      { label: '광주', value: 'GWANGJU' }
    ]

    const selectRegion = (region) => {
      selectedRegion.value = region
      emit('update:region', region)
    }

    return {
      selectedRegion,
      regions,
      selectRegion
    }
  }
}
</script>

<style scoped>
.filter-bar {
  background: white;
  padding: 12px 20px;
  border-bottom: 1px solid #eee;
}

.filter-options {
  display: flex;
  gap: 8px;
}

.filter-btn {
  padding: 8px 16px;
  border: 1px solid #ffd6c4;
  border-radius: 20px;
  background: white;
  color: #ff6200;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #ff6200;
  color: #ff6200;
  background: #fff5f0;
}

.filter-btn.active {
  background: #ff6200;
  border-color: #ff6200;
  color: white;
}

@media (max-width: 768px) {
  .filter-bar {
    padding: 8px 16px;
  }
  
  .filter-btn {
    padding: 6px 12px;
    font-size: 13px;
  }
}
</style> 