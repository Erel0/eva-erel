<template>
  <div class="min-h-screen">
    <div class="mx-auto space-y-6">
      <!-- Chart Section -->
      <DailySalesChart :chart-data="chart" :selected-bands="selectedBands" @update:selected-days="selectedDays = $event"
        @column-click="handleColumnClick" />

      <!-- SKU List Table -->
      <div v-if="selectedColumnsData.length > 0" class="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-xl font-semibold text-gray-800">SKU List</h2>
          <div class="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-lg">
            <span class="font-medium">Selected Date:</span> {{ dailySalesSkuList?.Data?.item?.selectedDate }}
            <template v-if="selectedColumnsData.length === 2">
              <span class="mx-2">|</span>
              <span class="font-medium">Comparison Date:</span> {{ selectedColumnsData[1].date }}
            </template>
          </div>
        </div>

        <SkuListTable :sku-list="displayedItems" :is-loading="isLoading" :skuRefundRate="skuRefundRate"
          :currency="dailySalesSkuList?.Data?.Currency || '$'" :has-comparison="selectedColumnsData.length === 2"
          :current-page="currentPage" :items-per-page="itemsPerPage" :total-items="totalItems"
          @update:current-page="handlePageChange" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from '@/store'
import type { DailySalesPayload } from '../store/types/dailySalesOverview'
import type { SkuListItem, DailySalesSkuListResponse } from '../store/types/dailySalesSkuList'
import DailySalesChart from '@/components/DailySalesChart.vue'
import SkuListTable from '@/components/SkuListTable.vue'

const store = useStore()
const chart = computed(() => store.getters.dailySalesOverview)
const dailySalesSkuList = computed(() => store.getters.dailySalesSkuList)
const skuRefundRate = computed(() => store.getters.skuRefundRate)
const selectedDays = ref(30)
const selectedBands = ref<number[]>([])
const selectedColumnsData = ref<{ date: string; data: Record<string, number> }[]>([])

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)
const localSkuList = ref<SkuListItem[]>([])
const isLoading = ref(false)

// Computed property for displayed items
const displayedItems = computed(() => {
  const startIndex = (currentPage.value - 1) * itemsPerPage.value
  const endIndex = startIndex + itemsPerPage.value
  return localSkuList.value.slice(startIndex, endIndex)
})

onMounted(async () => {
  try {
    await store.dispatch('getUserInformation');
    await fetchDailySales(); // Fetch daily sales after user information is loaded
  } catch (error) {
    console.error('Failed to fetch user information:', error);
  }
});

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
    // Reset selections after fetching new data
    selectedBands.value = []
    selectedColumnsData.value = []
  } catch (error) {
    console.error('Failed to fetch daily sales:', error)
  }
}

const updateSelectedColumnsData = () => {
  selectedColumnsData.value = selectedBands.value.map(index => {
    const item = chart.value?.Data?.item?.[index]
    return {
      date: item?.date || '',
      data: {}
    }
  })
}

const handleColumnClick = (clickedIndex: number) => {
  const currentIndex = selectedBands.value.indexOf(clickedIndex);

  if (currentIndex === -1) {
    if (selectedBands.value.length === 2) {
      // Remove the first selected column and add the new one
      selectedBands.value.shift();
      selectedBands.value.push(clickedIndex);
    } else {
      selectedBands.value.push(clickedIndex);
    }
  } else {
    // Remove if already selected
    selectedBands.value.splice(currentIndex, 1);
  }

  updateSelectedColumnsData();
}


const handlePageChange = async (page: number) => {
  currentPage.value = page
  await fetchSkuListData()
}

const fetchSkuListData = async () => {
  if (!selectedColumnsData.value || selectedColumnsData.value.length === 0) return

  // Only check for new data if we're not changing selection
  const isChangingPage = !isLoading.value
  const currentStartIndex = (currentPage.value - 1) * itemsPerPage.value
  const needNewData = isChangingPage && currentStartIndex >= localSkuList.value.length && currentStartIndex < totalItems.value

  if (isChangingPage && !needNewData && localSkuList.value.length > 0) {
    return // Use existing data if we don't need new data and just changing pages
  }

  isLoading.value = true
  const marketplace = store.getters.userInformation?.Data.user.store[0]?.marketplaceName || ''
  const sellerId = store.getters.userInformation?.Data.user.store[0]?.storeId || ''
  const isDaysCompare = selectedColumnsData.value.length === 2 ? 1 : 0

  try {
    // Calculate the API page number based on the current page
    const apiPageNumber = Math.ceil(currentPage.value * itemsPerPage.value / 30)

    const getDailySalesSkuList: DailySalesSkuListResponse = await store.dispatch('getDailySalesSkuList', {
      marketplace,
      sellerId,
      salesDate: selectedColumnsData.value[0].date,
      salesDate2: selectedColumnsData.value.length === 2 ? selectedColumnsData.value[1].date : selectedColumnsData.value[0].date,
      pageSize: 30,
      pageNumber: apiPageNumber,
      isDaysCompare
    })

    await store.dispatch('getSkuRefundRate', {
      marketplace,
      sellerId,
      skuList: getDailySalesSkuList.Data.item.skuList,
      requestedDay: 60,
    })

    // Update total items
    if (dailySalesSkuList.value?.Data?.item?.total !== undefined) {
      totalItems.value = dailySalesSkuList.value.Data.item.total
    }

    // If there's no data, reset everything
    if (!dailySalesSkuList.value?.Data?.item?.skuList?.length) {
      localSkuList.value = []
      totalItems.value = 0
      return
    }

    // Store all fetched items
    const newSkuList = dailySalesSkuList.value?.Data?.item?.skuList || []

    // If it's the first page or selection changed, replace the entire list
    if (apiPageNumber === 1 || !isChangingPage) {
      localSkuList.value = newSkuList
    } else {
      // Otherwise, append new items
      localSkuList.value = [...localSkuList.value, ...newSkuList]
    }

    // Update total items if we received less than expected
    if (newSkuList.length < 30) {
      totalItems.value = (apiPageNumber - 1) * 30 + newSkuList.length
    }
  } catch (error) {
    console.error('Failed to fetch SKU list:', error)
    isLoading.value = false
    localSkuList.value = []
    totalItems.value = 0
  } finally {
    isLoading.value = false
  }
}

// Update the watch function for selectedColumnsData
watch(() => selectedColumnsData.value, async (newData) => {
  if (!newData || newData.length === 0) return
  currentPage.value = 1 // Reset to first page when selection changes
  isLoading.value = true // Set loading before fetching new data
  await fetchSkuListData()
}, { deep: true })

// Add watcher for selectedDays
watch(() => selectedDays.value, async () => {
  await fetchDailySales()
  if (selectedColumnsData.value.length > 0) {
    currentPage.value = 1 // Reset to first page when days change
    await fetchSkuListData()
  }
})

</script>
