// composables/usePagination.js
import { ref, computed, watch } from 'vue'

export function usePagination(items, itemsPerPage = 10, options = {}) {
  const currentPage = ref(1)
  const perPage = ref(itemsPerPage)
  
  // Опции для настройки поведения
  const { 
    resetOnChange = true, // Сбрасывать ли пагинацию при изменении данных
    debounceReset = 0     // Задержка для сброса (если нужна)
  } = options

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

  // Watcher для автоматического сброса пагинации
  let resetTimeout = null

  watch(
    () => totalItems.value,
    (newTotal, oldTotal) => {
      // Сбрасываем пагинацию при изменении количества элементов
      if (resetOnChange && newTotal !== oldTotal) {
        // Очищаем предыдущий timeout если есть
        if (resetTimeout) {
          clearTimeout(resetTimeout)
        }
        
        // Сбрасываем с задержкой если указана
        if (debounceReset > 0) {
          resetTimeout = setTimeout(() => {
            resetPagination()
          }, debounceReset)
        } else {
          resetPagination()
        }
      }
    }
  )

  // ✨ Дополнительная проверка - если текущая страница больше общего количества
  watch(
    () => totalPages.value,
    (newTotalPages) => {
      // Если текущая страница больше доступных страниц, переходим на последнюю
      if (currentPage.value > newTotalPages && newTotalPages > 0) {
        currentPage.value = newTotalPages
      }
    }
  )

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

  // Метод для временного отключения автосброса
  const withoutAutoReset = (callback) => {
    const originalReset = resetOnChange
    resetOnChange = false
    callback()
    resetOnChange = originalReset
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
    setItemsPerPage,
    withoutAutoReset
  }
}