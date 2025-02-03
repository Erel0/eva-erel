<template>
  <div class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <label v-for="series in availableSeries" :key="series.id"
          class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <input type="checkbox" v-model="series.visible"
            class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer" />
          <span class="text-sm font-medium text-gray-700">{{ series.name }}</span>
        </label>
      </div>
      <select v-model="selectedDays" @change="$emit('update:selectedDays', selectedDays)"
        class="bg-white border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all cursor-pointer hover:bg-gray-50">
        <option value="7">Last 7 Days</option>
        <option value="14">Last 14 Days</option>
        <option value="30">Last 30 Days</option>
        <option value="60">Last 60 Days</option>
      </select>
    </div>
    <div class="bg-white rounded-lg p-2">
      <highcharts :options="chartOptions"></highcharts>
    </div>
    <div class="flex justify-end mt-4">
      <label class="relative inline-flex items-center cursor-pointer hover:opacity-80 transition-opacity">
        <input type="checkbox" v-model="isSharedTooltip" class="sr-only peer">
        <div
          class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600">
        </div>
        <span class="ms-3 text-sm font-medium text-gray-700">Shared Tooltip</span>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Props {
  chartData: any
  selectedBands: number[]
}

const props = defineProps<Props>()
const emit = defineEmits(['update:selectedDays', 'columnClick'])

const selectedDays = ref(30)
const isSharedTooltip = ref(false)

const availableSeries = ref([
  { id: 'totalSales', name: 'Total Sales', visible: true, color: '#4F46E5', dataKey: 'amount' },
  { id: 'shipping', name: 'Shipping', visible: true, color: '#10B981', dataKey: 'fbaShippingAmount' },
  { id: 'profit', name: 'Profit', visible: true, color: '#10B981', dataKey: 'profit' },
  { id: 'fbaSales', name: 'FBA Sales', visible: true, color: '#10B981', dataKey: 'fbaAmount' },
  { id: 'fbmSales', name: 'FBM Sales', visible: true, color: '#F59E0B', dataKey: 'fbmAmount' }
])

const handleColumnClick = (clickedIndex: number) => {
  emit('columnClick', clickedIndex)
}

const chartOptions = computed(() => ({
  chart: {
    type: 'column',
    backgroundColor: 'transparent',
    style: {
      fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    },
    spacing: [30, 30, 30, 30]
  },
  title: {
    text: 'Daily Sales Overview',
    style: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#1F2937'
    }
  },
  xAxis: {
    categories: props.chartData?.Data?.item?.map((item: any) => item.date) || [],
    labels: {
      rotation: -45,
      style: {
        fontSize: '11px',
        color: '#6B7280'
      }
    },
    lineColor: '#E5E7EB',
    tickColor: '#E5E7EB',
    plotBands: props.selectedBands.map(band => ({
      color: 'rgba(79, 70, 229, 0.1)',
      from: band - 0.5,
      to: band + 0.5,
      zIndex: 0,
      events: {
        click: function (this: any) {
          const clickedIndex = Math.round(this.options.from + 0.5);
          handleColumnClick(clickedIndex);
        }
      }
    }))
  },
  yAxis: [{
    title: {
      text: 'Amount ($)',
      style: {
        color: '#4B5563',
        fontSize: '12px'
      }
    },
    gridLineColor: '#F3F4F6',
    labels: {
      style: {
        color: '#6B7280',
        fontSize: '11px'
      }
    }
  }],
  tooltip: {
    shared: isSharedTooltip.value,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    shadow: true,
    style: {
      fontSize: '12px'
    }
  },
  legend: {
    itemStyle: {
      color: '#4B5563',
      fontSize: '12px',
      fontWeight: '500'
    },
    itemHoverStyle: {
      color: '#1F2937'
    }
  },
  series: availableSeries.value
    .filter(series => series.visible)
    .map(series => ({
      name: series.name,
      data: props.chartData?.Data?.item?.map((item: any) => item[series.dataKey as keyof typeof item]) || [],
      color: series.color,
      cursor: 'pointer',
      borderRadius: 4,
      events: {
        click: function (this: any, event: any) {
          handleColumnClick(event.point.index);
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
</script> 