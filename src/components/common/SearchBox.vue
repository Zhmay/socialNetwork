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
    if (searchQuery.value.trim()) {
      emit('search', searchQuery.value.trim())
    }
  }, props.debounce)
}

const handleEnter = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim())
  }
}

const clearSearch = () => {
  searchQuery.value = ''
  emit('clear')
  emit('search', '') // Сбрасываем результаты поиска
}
</script>

<template>
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
        aria-label="Очистить поиск"
    >
        <SvgIcon name="close" :size="18" />
    </button>
  </div>
</template>

<style scoped lang="scss">
    .search-box {
        width: 100%;
        margin-bottom: 30px;
        position: relative;

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
</style>