<template>
  <div>
    <!-- Column Selection -->
    <div class="mb-4 p-4 bg-white rounded-lg border border-gray-100">
      <h3 class="text-sm font-medium text-gray-700 mb-2">Select Columns</h3>
      <div class="flex flex-wrap gap-2">
        <label v-for="column in availableColumns" :key="column.key"
          class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
          <input type="checkbox" :checked="selectedColumns.includes(column.key)" @change="toggleColumn(column.key)"
            class="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500 cursor-pointer">
          <span class="text-sm font-medium text-gray-700">{{ column.label }}</span>
        </label>
      </div>
    </div>

    <div class="overflow-x-auto rounded-lg border border-gray-100">
      <div v-if="isLoading" class="flex justify-center items-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
      <table v-else class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th v-if="selectedColumns.includes('image')" scope="col"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Image
            </th>
            <th v-if="selectedColumns.includes('productName')" scope="col"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Product
            </th>
            <th v-if="selectedColumns.includes('sku')" scope="col"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              SKU
            </th>
            <th v-if="selectedColumns.includes('asin')" scope="col"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              ASIN
            </th>
            <th v-if="selectedColumns.includes('qty')" scope="col"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {{ hasComparison ? 'Quantity (1/2)' : 'Quantity' }}
            </th>
            <th v-if="selectedColumns.includes('amount')" scope="col"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {{ hasComparison ? 'Amount (1/2)' : 'Amount' }}
            </th>
            <th v-if="selectedColumns.includes('shippingAmount')" scope="col"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              {{ hasComparison ? 'Shipping Amount (1/2)' : 'Shipping Amount' }}
            </th>
            <th v-if="selectedColumns.includes('refundPercantage')" scope="col" style="text-align:end;"
              class="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
              Refund Rate
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-if="skuList.length === 0 || skuRefundRate?.Data.length === 0" class="hover:bg-gray-50">
            <td :colspan="selectedColumns.length" class="px-6 py-8 text-center text-sm text-gray-500">
              No results found
            </td>
          </tr>
          <tr v-else v-for="(item, i) in skuList" :key="item.sku" class="hover:bg-gray-50 transition-colors">
            <td v-if="selectedColumns.includes('image')" class="px-6 py-4 whitespace-nowrap">
              <img :src="item.imageUrl" :alt="item.productName"
                class="h-16 w-16 object-contain rounded-lg border border-gray-100" />
            </td>
            <td v-if="selectedColumns.includes('productName')" class="px-6 py-4">
              <div class="text-sm font-medium text-gray-900 max-w-[300px] whitespace-normal break-words">{{
                item.productName }}</div>
            </td>
            <td v-if="selectedColumns.includes('sku')" class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{
              item.sku }}</td>
            <td v-if="selectedColumns.includes('asin')" class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{{
              item.asin }}</td>
            <td v-if="selectedColumns.includes('qty')"
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ item.qty }} {{ hasComparison ? `/ ${item.qty2}` : '' }}
            </td>
            <td v-if="selectedColumns.includes('amount')"
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ currency }}{{ item.amount.toFixed(2) }} {{ hasComparison ? `/ ${currency}${item.amount2.toFixed(2)}` :
                '' }}
            </td>
            <td v-if="selectedColumns.includes('shippingAmount')"
              class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ currency }}{{ item.shippingAmount.toFixed(2) }} {{ hasComparison ? `/
              ${currency}${item.shippingAmount2.toFixed(2)}` : '' }}
            </td>
            <td v-if="selectedColumns.includes('refundPercantage')"
              class="text-end px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              {{ skuRefundRate?.Data[i]?.refundRate }}%
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination Controls -->
      <div v-if="totalItems > 0"
        class="flex items-center justify-between mt-6 px-4 py-4 bg-white border-t border-gray-100">
        <div class="text-sm text-gray-700">
          Showing {{ ((currentPage - 1) * itemsPerPage) + 1 }} to {{ Math.min(currentPage * itemsPerPage, totalItems)
          }} of {{ totalItems }} results
        </div>
        <div class="flex items-center space-x-2">
          <button @click="handlePageChange(currentPage - 1)" :disabled="currentPage === 1"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Previous
          </button>
          <button v-for="page in totalPages" :key="page" @click="handlePageChange(page)" :class="[
            'px-4 py-2 text-sm font-medium rounded-md',
            currentPage === page
              ? 'bg-indigo-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          ]">
            {{ page }}
          </button>
          <button @click="handlePageChange(currentPage + 1)" :disabled="currentPage === totalPages"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { SkuListItem } from '../store/types/dailySalesSkuList'
import type { SkuRefundRateResponse } from '../store/types/skuRefundRate'

interface Props {
  skuList: SkuListItem[],
  skuRefundRate: SkuRefundRateResponse | null,
  isLoading: boolean
  currency: string
  hasComparison: boolean
  currentPage: number
  itemsPerPage: number
  totalItems: number
}

const props = defineProps<Props>()
const emit = defineEmits<{
  (e: 'update:currentPage', page: number): void
}>()

const availableColumns = [
  { key: 'image', label: 'Image' },
  { key: 'productName', label: 'Product Name' },
  { key: 'sku', label: 'SKU' },
  { key: 'asin', label: 'ASIN' },
  { key: 'qty', label: 'Quantity' },
  { key: 'amount', label: 'Amount' },
  { key: 'shippingAmount', label: 'Shipping Amount' },
  { key: 'refundPercantage', label: 'Refund Rate' },
]

// Default selected columns
const selectedColumns = ref([
  'image',
  'productName',
  'sku',
  'qty',
  'amount',
  'refundPercantage'
])

const toggleColumn = (columnKey: string) => {
  const index = selectedColumns.value.indexOf(columnKey)
  if (index === -1) {
    selectedColumns.value.push(columnKey)
  } else {
    selectedColumns.value.splice(index, 1)
  }
}

const totalPages = computed(() => Math.ceil(props.totalItems / props.itemsPerPage))

const handlePageChange = (page: number) => {
  if (page < 1 || page > totalPages.value || page === props.currentPage) return
  emit('update:currentPage', page)
}
</script>