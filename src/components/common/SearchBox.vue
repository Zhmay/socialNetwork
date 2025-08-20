<script setup>
import { ref, watch } from 'vue'
import SvgIcon from './SvgIcon.vue'

// Props
const props = defineProps({
  placeholder: {
    type: String,
    default: 'Search...'
  },
  // Задержка перед отправкой события (debounce)
  debounce: {
    type: Number,
    default: 300
  },
  // Начальное значение
  modelValue: {
    type: String,
    default: ''
  },
  // Результаты поиска для отображения статистики
  searchResults: {
    type: Object,
    default: () => ({
      total: 0,
      query: '',
      isSearching: false
    })
  },
  // Показывать ли индикатор результатов
  showResults: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'search', 'clear'])

// Состояние
const searchQuery = ref(props.modelValue)
const isFocused = ref(false)
let debounceTimeout = null

// Синхронизация с v-model
watch(() => props.modelValue, (newValue) => {
  searchQuery.value = newValue
})

watch(searchQuery, (newValue) => {
  emit('update:modelValue', newValue)
})

// Обработчики
const handleInput = () => {
  // Debounce для оптимизации поиска
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
  }
  
  debounceTimeout = setTimeout(() => {
    emit('search', searchQuery.value.trim())
  }, props.debounce)
}

const handleEnter = () => {
  emit('search', searchQuery.value.trim())
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('search', '') // Отправляем пустой поисковый запрос
}
</script>

<template>
  <div class="search-container">
    <div class="search-box">
      <SvgIcon 
          name="search" 
          class="icon-search" 
          :size="20"
      />
      <input
          v-model="searchQuery"
          type="text"
          :placeholder="placeholder"
          @input="handleInput"
          @keydown.enter="handleEnter"
          @focus="isFocused = true"
          @blur="isFocused = false"
      />
      <button
          v-if="searchQuery"
          @click="clearSearch"
          class="search-box__clear"
          type="button"
          aria-label="Clear search"
      >
          <SvgIcon name="close" :size="18" />
      </button>
    </div>

    <!-- Индикатор результатов поиска -->
    <Transition name="search-results">
      <div 
        v-if="showResults && searchResults.query" 
        class="search-results-info"
      >
        <div v-if="searchResults.total > 0" class="search-results-elem results-found">
          Found <b>{{ searchResults.total }}</b>
          {{ searchResults.total === 1 ? 'post' : searchResults.total < 5 ? 'posts' : 'posts' }}
          by query <b>"{{ searchResults.query }}"</b>
        </div>
        
        <div v-else-if="!searchResults.isSearching" class="search-results-elem no-results">
          Posts not found for query <b>"{{ searchResults.query }}"</b> 
        </div>
        
        <div v-else class="searching">
          Searching...
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped lang="scss">
.search-container {
  width: 100%;
  margin-bottom: 30px;
  position: relative;
}

.search-box {
  position: relative;
  margin-bottom: 12px;

  &:focus-within {
    .icon-search {
      color: var(--accent-color);
    }
  }

  & > input {
    padding: 0 20px 0 40px;
  }

  & > .icon-search {
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    transition: var(--transition);
    color: var(--placeholder-color);
  }

  &__clear {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    cursor: pointer;

    &:hover {
      color: var(--accent-color);
    }
  }
}

// Стили для результатов поиска
.search-results-info {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  padding: 8px 0;
  border-radius: 6px;
  font-size: 12px;
  display: flex;
  align-items: center;
  grid-gap: 4px;
}

.search-results-elem {
  display: flex;
  align-items: center;
  grid-gap: 4px;
  padding: 0 12px;
  border-radius: var(--border-radius);
}

.results-found {
  background: var(--success-bg, rgba(34, 197, 94, 0.1));
  color: var(--success-color, #16a34a);
}

.no-results {
  background: var(--warning-bg, rgba(251, 191, 36, 0.1));
  color: var(--warning-color, #d97706);
}

.searching {
  background: var(--info-bg, rgba(59, 130, 246, 0.1));
  color: var(--info-color, #3b82f6);
}

// Анимации
.search-results-enter-active,
.search-results-leave-active {
  transition: all 0.3s ease;
}

.search-results-enter-from,
.search-results-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>