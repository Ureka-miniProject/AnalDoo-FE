<template>
  <div class="filter-bar">
    <div style="position:relative;">
      <button ref="regionBtn" class="filter-btn" @click="toggleDropdown">{{ selectedRegion }} ▼</button>
      <div v-if="showDropdown" class="dropdown" :style="dropdownStyle">
        <div v-for="region in regions" :key="region" class="dropdown-item" @click="selectRegion(region)">{{ region }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['update:region'],
  data() {
    return {
      regions: ['서울', '광주', '대구'],
      selectedRegion: '서울',
      showDropdown: false,
      dropdownStyle: {}
    }
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown
      if (this.showDropdown) {
        this.$nextTick(() => {
          const btn = this.$refs.regionBtn
          if (btn) {
            const rect = btn.getBoundingClientRect()
            this.dropdownStyle = {
              position: 'fixed',
              left: rect.left + 'px',
              top: rect.bottom + 'px',
              minWidth: rect.width + 'px',
              zIndex: 2000
            }
          }
        })
      }
    },
    selectRegion(region) {
      this.selectedRegion = region
      this.showDropdown = false
      this.$emit('update:region', region)
    }
  }
}
</script>

<style scoped>
.filter-bar {
  display: flex;
  gap: 8px;
  padding: 12px 8px 8px 8px;
  background: #fff;
  border-bottom: 1px solid #eee;
  overflow-x: auto;
}
.filter-btn {
  background: #f5f5f5;
  border: none;
  border-radius: 16px;
  padding: 6px 14px;
  font-size: 14px;
  color: rgb(239, 141, 99);
  cursor: pointer;
  white-space: nowrap;
}
.filter-btn:active, .filter-btn:focus {
  background: #e0eaff;
}
.dropdown {
  background: #fff;
  border: 1px solid #eee;
  border-radius: 10px;
  box-shadow: 0 2px 8px #0002;
  min-width: 120px;
  min-height: 40px;
  padding: 8px 0;
  display: flex;
  flex-direction: column;
}
.dropdown-item {
  padding: 10px 18px;
  cursor: pointer;
  font-size: 15px;
  color: #000000;
  white-space: nowrap;
}
.dropdown-item:hover {
  background: #f0f6ff;
}
</style> 