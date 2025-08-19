// composables/usePagination.js
import { ref, computed } from 'vue'

export function usePagination(items, itemsPerPage = 10) {
  const currentPage = ref(1)
  const perPage = ref(itemsPerPage)

  // Поддерживаем как ref/reactive, так и функции
  const itemsValue = computed(() => {
    if (typeof items === 'function') {
      return items()
    }
    return items.value || items
  })

  // Computed свойства
  const totalItems = computed(() => {
    const itemsArray = itemsValue.value
    return Array.isArray(itemsArray) ? itemsArray.length : 0
  })
  
  const totalPages = computed(() => {
    return totalItems.value > 0 ? Math.ceil(totalItems.value / perPage.value) : 1
  })

  const paginatedItems = computed(() => {
    const itemsArray = itemsValue.value
    
    // Проверяем, что items готов и это массив
    if (!Array.isArray(itemsArray)) {
      return []
    }
    
    const start = (currentPage.value - 1) * perPage.value
    const end = start + perPage.value
    return itemsArray.slice(start, end)
  })

  const hasNextPage = computed(() => currentPage.value < totalPages.value)
  const hasPrevPage = computed(() => currentPage.value > 1)

  // Методы
  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (hasNextPage.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (hasPrevPage.value) {
      currentPage.value--
    }
  }

  const resetPagination = () => {
    currentPage.value = 1
  }

  const setItemsPerPage = (count) => {
    perPage.value = count
    resetPagination()
  }

  return {
    // State
    currentPage,
    perPage,
    
    // Computed
    totalItems,
    totalPages,
    paginatedItems,
    hasNextPage,
    hasPrevPage,
    
    // Methods
    setPage,
    nextPage,
    prevPage,
    resetPagination,
    setItemsPerPage
  }
}