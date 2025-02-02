<template>
  <div class="p-4">
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-4">
        <div class="flex flex-wrap gap-4">
          <label v-for="series in availableSeries" :key="series.id" class="flex items-center space-x-2 cursor-pointer">
            <input type="checkbox" v-model="series.visible" class="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
            <span class="text-sm font-medium text-gray-700">{{ series.name }}</span>
          </label>
        </div>
        <select v-model="selectedDays" @change="fetchDailySales"
          class="border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="7">Last 7 Days</option>
          <option value="14">Last 14 Days</option>
          <option value="30">Last 30 Days</option>
          <option value="60">Last 60 Days</option>
        </select>
      </div>
      <highcharts :options="chartOptions"></highcharts>
    </div>

    <div class="bg-white rounded-lg shadow p-6 mt-4">
      <h2 class="text-xl font-semibold mb-4">User Information</h2>
      <div v-if="auth">
        <p><strong>Access Token:</strong> {{ auth.Data.AccessToken }}</p>
      </div>
      <div v-else>
        <p>No user information available.</p>
      </div>
    </div>

  </div>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useStore } from '@/store'
import type { DailySalesPayload } from '../store/types/dailySalesOverview'

const store = useStore()
const auth = computed(() => store.getters.auth)
const chart = computed(() => store.getters.dailySalesOverview)
const selectedDays = ref(30)

const availableSeries = ref([
  { id: 'totalSales', name: 'Total Sales', visible: true, color: '#4F46E5', dataKey: 'amount' },
  { id: 'shipping', name: 'Shipping', visible: true, color: '#10B981', dataKey: 'fbaShippingAmount' },
  { id: 'profit', name: 'Profit', visible: true, color: '#10B981', dataKey: 'profit' },
  { id: 'fbaSales', name: 'FBA Sales', visible: true, color: '#10B981', dataKey: 'fbaAmount' },
  { id: 'fbmSales', name: 'FBM Sales', visible: true, color: '#F59E0B', dataKey: 'fbmAmount' }
])

const chartOptions = computed(() => ({
  chart: {
    type: 'column'
  },
  title: {
    text: 'Daily Sales Overview'
  },
  xAxis: {
    categories: chart.value?.Data?.item?.map(item => item.date) || [],
    labels: {
      rotation: -45,
      style: {
        fontSize: '10px'
      }
    }
  },
  yAxis: [{
    title: {
      text: 'Amount ($)'
    }
  }],
  tooltip: {
    shared: true,
    formatter: function (this: Highcharts.TooltipFormatterContextObject): string {
      let tooltip = `<b>${this.x}</b><br/>`;
      this.points?.forEach(point => {
        const value = point.y ?? 0;
        tooltip += `${point.series.name}: $${value.toFixed(2)}<br/>`;
      });
      return tooltip;
    }
  },
  series: availableSeries.value
    .filter(series => series.visible)
    .map(series => ({
      name: series.name,
      data: chart.value?.Data?.item?.map(item => item[series.dataKey as keyof typeof item]) || [],
      color: series.color,
      cursor: 'pointer',
      events: {
        click: function (this: any, event: any) {
          const clickedColumnIndex = event.point.index;

          // Reset all columns in all series to their original colors
          this.chart.series.forEach((series: any) => {
            series.data.forEach((point: any, index: number) => {
              if (index === clickedColumnIndex) {
                point.update({
                  color: '#E9D5FF' // Light purple for the entire column
                }, false);
              } else {
                point.update({
                  color: series.options.color // Reset to original color
                }, false);
              }
            });
          });

          this.chart.redraw();
        }
      }
    })),
  plotOptions: {
    column: {
      stacking: 'normal',
      states: {
        hover: {
          brightness: 0.1
        }
      }
    }
  },
  credits: {
    enabled: false
  }
}))

const fetchDailySales = async () => {
  try {
    const payload: DailySalesPayload = {
      marketplace: store.getters.userInformation?.Data.user.store[0]?.marketplaceName ?? '',
      sellerId: store.getters.userInformation?.Data.user.store[0]?.storeId ?? '',
      requestStatus: 0,
      day: selectedDays.value,
      excludeYoYData: true,
    }

    await store.dispatch('getDailySalesOverview', payload)
  } catch (error) {
    console.error('Failed to fetch daily sales:', error)
  }
}

onMounted(async () => {
  try {
    await store.dispatch('getUserInformation');
    await fetchDailySales(); // Fetch daily sales after user information is loaded
  } catch (error) {
    console.error('Failed to fetch user information:', error);
  }
});

</script>
