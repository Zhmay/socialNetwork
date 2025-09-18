<script setup>
import { computed } from 'vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: 'default',
  },
  options: {
    type: Array,
    default: () => [
      { value: 'default', label: 'Default', icon: 'list' },
      { value: 'popularity', label: 'Most popular', icon: 'heart' },
      { value: 'alphabetical', label: 'A-Z', icon: 'sort-alpha' },
    ],
  },
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Computed
const selectedOption = computed(() => {
  return props.options.find((option) => option.value === props.modelValue)
})

// Methods
const handleChange = (event) => {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="sort-select">
    <div class="sort-select__label">Sort by:</div>

    <select :value="modelValue" @change="handleChange" class="sort-select__dropdown">
      <option v-for="option in options" :key="option.value" :value="option.value">
        {{ option.label }}
      </option>
    </select>
  </div>
</template>

<style scoped lang="scss">
.sort-select {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-gap: 10px;

  &__label {
    display: flex;
    align-items: center;
    grid-gap: 5px;
    font-size: 14px;
    color: #555;
  }

  &__dropdown {
    width: 150px;
    height: 32px;
    padding: 4px 8px;
    font-size: 14px;
    cursor: pointer;
  }
}
</style>
