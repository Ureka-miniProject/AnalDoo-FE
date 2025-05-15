<template>
  <div class="home">
    <CategoryBar @update:type="onType" />
    <DateSelector @update:day="onDay" />
    <FilterBar @update:region="onRegion" />
    <MatchList :competitions="competitions" :loading="loading" />
    <HeaderBar />
  </div>
</template>

<script>
import CategoryBar from './CategoryBar.vue'
import DateSelector from './DateSelector.vue'
import FilterBar from './FilterBar.vue'
import MatchList from './MatchList.vue'
import { competitionAPI } from '@/api'
import { ref, watch, onMounted, onUnmounted } from 'vue'

export default {
  name: 'HomePage',
  components: {
    CategoryBar,
    DateSelector,
    FilterBar,
    MatchList
  },
  setup() {
    const competitions = ref([])
    const hasNext = ref(false)
    const loading = ref(false)
    const selectedType = ref(null)
    const selectedDay = ref(null)
    const selectedRegion = ref(null)
    const lastDate = ref(null)
    const lastId = ref(null)

    const onType = (type) => {
      selectedType.value = type
    }

    const onDay = (day) => {
      selectedDay.value = day
    }

    const onRegion = (region) => {
      selectedRegion.value = region
    }

    const fetchCompetitions = async (isInitial = false) => {
      if (loading.value || selectedType.value === null) return
      loading.value = true

      try {
        if (!isInitial) {
          await new Promise(resolve => setTimeout(resolve, 500))
        }

        const params = {
          sportType: selectedType.value,
          date: selectedDay.value,
          local: selectedRegion.value,
          lastDate: lastDate.value,
          lastId: lastId.value
        }

        const response = await competitionAPI.getCompetitions(params)
        
        if (isInitial) {
          competitions.value = response.data.competitions
        } else {
          competitions.value = [...competitions.value, ...response.data.competitions]
        }
        
        hasNext.value = response.data.hasNext
        if (response.data.competitions.length > 0) {
          const lastCompetition = response.data.competitions[response.data.competitions.length - 1]
          const time = lastCompetition.competitionTime.split(' ')[1] || lastCompetition.competitionTime
          lastDate.value = `${selectedDay.value} ${time}`
          lastId.value = lastCompetition.id
        }
      } catch (error) {
        console.error('대회 목록 조회 실패:', error)
      } finally {
        loading.value = false
      }
    }

    const handleScroll = () => {
      if (loading.value || !hasNext.value) return

      const scrollHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY
      const clientHeight = document.documentElement.clientHeight

      if (scrollTop + clientHeight >= scrollHeight - 100) {
        fetchCompetitions()
      }
    }

    watch([selectedType, selectedDay, selectedRegion], () => {
      lastDate.value = null
      lastId.value = null
      fetchCompetitions(true)
    })

    onMounted(() => {
      window.addEventListener('scroll', handleScroll)
      fetchCompetitions(true)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', handleScroll)
    })

    return {
      competitions,
      loading,
      onType,
      onDay,
      onRegion
    }
  }
}
</script>

<style>
.home {
  font-family: Arial, sans-serif;
  background: #f7f7f7;
  min-height: 100vh;
}
</style> 