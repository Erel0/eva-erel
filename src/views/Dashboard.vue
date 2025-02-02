<template>
  <div class="p-4">
    <div class="bg-white rounded-lg shadow p-6">
      <h2 class="text-xl font-semibold mb-4">Sample Chart</h2>
      <highcharts :options="chartOptions"></highcharts>
    </div>
    <div class="bg-white rounded-lg shadow p-6 mt-4">
      <h2 class="text-xl font-semibold mb-4">User Information</h2>
      <div v-if="user">
        <p><strong>Name:</strong> {{ user?.name }}</p>
        <p><strong>Email:</strong> {{ user?.email }}</p>
      </div>
      <div v-else>
        <p>No user information available.</p>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const user = ref(null)

onMounted(async () => {
  try {
    const userData = await store.dispatch('getUser')
    user.value = userData
  } catch (error) {
    console.error('Failed to fetch user data:', error)
  }
})

// Chart configuration
const chartOptions = ref({
  chart: {
    type: 'column'
  },
  title: {
    text: 'Monthly Sales Data'
  },
  xAxis: {
    categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  },
  yAxis: {
    title: {
      text: 'Sales ($)'
    }
  },
  series: [{
    name: 'Sales 2023',
    data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]
  }, {
    name: 'Sales 2024',
    data: [44.9, 52.5, 86.4, 102.2, 125.0, 146.0, 167.6, 178.5, 196.4, 174.1, 85.6, 64.4]
  }]
})

</script>
