<template>
  <div class="app">
    <HeaderBar />
    <CategoryBar @update:type="onType" />
    <DateSelector @update:day="onDay" />
    <FilterBar @update:region="onRegion" />
    <MatchList />
    <FooterBar />
  </div>
</template>

<script>
import HeaderBar from './HeaderBar.vue'
import CategoryBar from './CategoryBar.vue'
import DateSelector from './DateSelector.vue'
import FilterBar from './FilterBar.vue'
import MatchList from './MatchList.vue'
import FooterBar from './FooterBar.vue'

export default {
  name: 'HomePage',
  components: {
    HeaderBar,
    CategoryBar,
    DateSelector,
    FilterBar,
    MatchList,
    FooterBar
  },
  data() {
    return {
      selectedType: null,
      selectedDay: null,
      selectedRegion: '서울'
    }
  },
  methods: {
    onType(type) {
      this.selectedType = type
      this.tryFetch()
    },
    onDay(day) {
      this.selectedDay = day
      this.tryFetch()
    },
    onRegion(region) {
      this.selectedRegion = region
      this.tryFetch()
    },
    tryFetch() {
      if (this.selectedType && this.selectedDay && this.selectedRegion) {
        this.fetchContents()
      }
    },
    fetchContents() {
      // 실제 API 호출 부분
      let url = `/api/v1/contents?day=${this.selectedDay}&type=${this.selectedType}`
      if (this.selectedRegion) {
        url += `&region=${this.selectedRegion}`
      }
      // 예시: fetch(url).then(...)
      console.log('API 호출:', url)
    }
  }
}
</script>

<style>
.app {
  font-family: Arial, sans-serif;
  background: #f7f7f7;
  min-height: 100vh;
}
</style> 