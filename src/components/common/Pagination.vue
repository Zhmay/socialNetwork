<script setup>
import { computed } from 'vue'
import SvgIcon from '@/components/common/SvgIcon.vue'

// Props
const props = defineProps({
  currentPage: {
    type: Number,
    required: true
  },
  totalPages: {
    type: Number,
    required: true
  },
  hasNextPage: {
    type: Boolean,
    required: true
  },
  hasPrevPage: {
    type: Boolean,
    required: true
  },
  // Показывать ли номера страниц
  showPageNumbers: {
    type: Boolean,
    default: false
  },
  // Максимальное количество видимых номеров страниц
  maxVisiblePages: {
    type: Number,
    default: 5
  },
  // Размер компонента
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
})

// Emits
const emit = defineEmits(['page-change', 'prev-page', 'next-page'])

// Вычисляемые свойства для номеров страниц
const visiblePages = computed(() => {
  if (!props.showPageNumbers || props.totalPages <= 1) {
    return []
  }

  const pages = []
  const half = Math.floor(props.maxVisiblePages / 2)
  
  let start = Math.max(1, props.currentPage - half)
  let end = Math.min(props.totalPages, start + props.maxVisiblePages - 1)
  
  // Корректировка если в конце
  if (end - start + 1 < props.maxVisiblePages) {
    start = Math.max(1, end - props.maxVisiblePages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Методы
const goToPage = (page) => {
  if (page !== props.currentPage && page >= 1 && page <= props.totalPages) {
    emit('page-change', page)
  }
}

const goToPrevPage = () => {
  if (props.hasPrevPage) {
    emit('prev-page')
  }
}

const goToNextPage = () => {
  if (props.hasNextPage) {
    emit('next-page')
  }
}

const goToFirstPage = () => {
  if (props.currentPage !== 1) {
    goToPage(1)
  }
}

const goToLastPage = () => {
  if (props.currentPage !== props.totalPages) {
    goToPage(props.totalPages)
  }
}
</script>

<template>
  <nav 
    v-if="totalPages > 1" 
    :class="['pagination', `pagination--${size}`]"
    aria-label="Pagination"
  >
    <!-- Простая пагинация (по умолчанию) -->
    <div v-if="!showPageNumbers" class="pagination__holder">
        <button 
            @click="goToPrevPage"
            :disabled="!hasPrevPage"
            class="pagination__btn pagination__btn--prev"
            aria-label="Previous page"
        >
            <SvgIcon name="arrow-small" size="12"/>
            <span>Prev</span>
        </button>
      
        <div class="pagination__info">
            {{ currentPage }} / {{ totalPages }}
        </div>
      
        <button 
            @click="goToNextPage"
            :disabled="!hasNextPage"
            class="pagination__btn pagination__btn--next"
            aria-label="Next page"
        >
            <SvgIcon name="arrow-small" size="12"/>
            <span>Next</span>
        </button>
    </div>

    <!-- Расширенная пагинация с номерами страниц -->
    <div v-else class="pagination__holder">
        <!-- Предыдущая -->
        <button 
            @click="goToPrevPage"
            :disabled="!hasPrevPage"
            class="pagination__btn pagination__btn--nav pagination__btn--prev"
            aria-label="Previous page"
        >
            <SvgIcon name="arrow-small" size="12"/>
        </button>

        <!-- Кнопка "В начало" -->
        <button 
            v-if="currentPage > 3"
            @click="goToFirstPage"
            class="pagination__btn pagination__btn--edge"
        >
            1
        </button>
      
        <span v-if="currentPage > 3" class="pagination__ellipsis">...</span>

    
        <!-- Номера страниц -->
        <button
            v-for="page in visiblePages"
            :key="page"
            @click="goToPage(page)"
            :class="[
                'pagination__btn', 
                'pagination__btn--page',
                { 'pagination__btn--current': page === currentPage }
            ]"
            :aria-label="`Page ${page}`"
            :aria-current="page === currentPage ? 'page' : undefined"
        >
            {{ page }}
        </button>

        <span v-if="currentPage < totalPages - 3" class="pagination__ellipsis">...</span>
      
        <!-- Кнопка "В конец" -->
        <button 
            v-if="currentPage < totalPages - 2"
            @click="goToLastPage"
            class="pagination__btn pagination__btn--edge"
        >
            {{ totalPages }}
        </button>

        <!-- Следующая -->
        <button 
            @click="goToNextPage"
            :disabled="!hasNextPage"
            class="pagination__btn pagination__btn--nav"
            aria-label="Next page"
        >
            <SvgIcon name="arrow-small" size="12"/>
        </button>
    </div>
  </nav>
</template>

<style scoped lang="scss">
.pagination {
    padding-top: 20px;
    margin-top: 20px;
    border-top: 1px solid var(--border-color);

    &__holder {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-gap: 10px;
    }

    &__btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 32px;
        height: 32px;
        box-shadow: var(--box-shadow);
        border-radius: 6px;
        background-color: #fff;

        &--current {
            background-color: var(--accent-color);
            color: #fff;
        }

        &--prev svg {
            transform: rotate(180deg);
        }

        &[disabled] {
            opacity: .5;
            cursor: not-allowed;
        }

        &:hover:not(.pagination__btn--current, [disabled]) {
            color: var(--accent-color);
        }
    }
}
</style>