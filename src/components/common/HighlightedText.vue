<script setup>
import { computed } from 'vue'
import { useHighlight } from '@/composables/useHighlight'

const props = defineProps({
  // Текст для подсветки
  text: {
    type: String,
    required: true
  },
  // Поисковый запрос
  query: {
    type: String,
    default: ''
  },
  // Тег для обертки (по умолчанию span)
  tag: {
    type: String,
    default: 'span'
  },
  // Опции подсветки
  caseSensitive: {
    type: Boolean,
    default: false
  },
  wholeWords: {
    type: Boolean,
    default: false
  },
  // CSS класс для подсвеченных элементов
  highlightClass: {
    type: String,
    default: 'text-highlight'
  },
  // Максимальная длина для обрезки текста
  maxLength: {
    type: Number,
    default: null
  },
  // Показывать обрезанный текст с контекстом вокруг найденного
  showExcerpt: {
    type: Boolean,
    default: false
  },
  // Размер контекста вокруг найденного (для excerpt)
  contextPadding: {
    type: Number,
    default: 30
  }
})

const { createHighlightedFragments, createHighlightedExcerpt } = useHighlight()

// Обрабатываем текст в зависимости от настроек
const processedText = computed(() => {
  if (props.showExcerpt && props.query) {
    return createHighlightedExcerpt(props.text, props.query, {
      maxLength: props.maxLength || 150,
      contextPadding: props.contextPadding,
      caseSensitive: props.caseSensitive
    })
  }
  
  if (props.maxLength && props.text.length > props.maxLength) {
    return props.text.slice(0, props.maxLength) + '...'
  }
  
  return props.text
})

// Создаем фрагменты для подсветки
const highlightedFragments = computed(() => {
  return createHighlightedFragments(processedText.value, props.query, {
    caseSensitive: props.caseSensitive,
    wholeWords: props.wholeWords
  })
})
</script>

<template>
  <component :is="tag" class="highlighted-text">
    <template v-for="(fragment, index) in highlightedFragments" :key="index">
      <mark 
        v-if="fragment.highlighted" 
        :class="highlightClass"
      >
        {{ fragment.text }}
      </mark>
      <span v-else>{{ fragment.text }}</span>
    </template>
  </component>
</template>

<style scoped>
.highlighted-text {
  .text-highlight {
    background: var(--highlight-bg, #fef08a);
    color: var(--highlight-color, #854d0e);
    padding: 0.125rem 0.25rem;
    border-radius: 0.25rem;
    
    /* Плавная анимация появления */
    animation: highlight-appear 0.3s ease-out;
  }
}

@keyframes highlight-appear {
  from {
    background-color: var(--highlight-animation-from, #facc15);
    transform: scale(1.05);
  }
  to {
    background-color: var(--highlight-bg, #fef08a);
    transform: scale(1);
  }
}

/* Альтернативные стили подсветки */
.highlighted-text {
  &.highlight-accent .text-highlight {
    background: var(--accent-color-light, rgba(99, 102, 241, 0.2));
    color: var(--accent-color-dark, #4338ca);
  }
  
  &.highlight-success .text-highlight {
    background: var(--success-color-light, rgba(34, 197, 94, 0.2));
    color: var(--success-color-dark, #15803d);
  }
  
  &.highlight-minimal .text-highlight {
    background: transparent;
    color: inherit;
    border-bottom: 2px solid var(--accent-color, #6366f1);
    border-radius: 0;
    padding: 0;
  }
}
</style>