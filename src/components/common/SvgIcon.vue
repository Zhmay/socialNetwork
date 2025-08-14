<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  // Имя иконки (обязательный параметр)
  name: {
    type: String,
    required: true
  },
  // Размер иконки (опциональный)
  size: {
    type: [String, Number],
    default: 24
  },
  // CSS класс (опциональный)
  class: {
    type: String,
    default: ''
  }
})

// Стили для размера
const iconStyles = computed(() => {
  const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size
  return {
    width: sizeValue,
    height: sizeValue
  }
})
</script>

<template>
  <svg
    :class="['svg-icon', props.class]" 
    :style="iconStyles"
    :aria-label="props.name"
  >
    <use :href="`#icon-${props.name}`"></use>
  </svg>
</template>

<style scoped>
.svg-icon {
  fill: currentColor;
  display: inline-block;
  vertical-align: middle;
  flex-shrink: 0;
}
</style>