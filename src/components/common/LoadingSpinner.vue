<script setup>
// Props для настройки спиннера
defineProps({
  // Размер спиннера: sm, md, lg
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value),
  },

  // Показывать ли текст загрузки
  showText: {
    type: Boolean,
    default: false,
  },

  // Текст загрузки
  text: {
    type: String,
    default: 'Загрузка...',
  },

  // Центрировать спиннер (для полноэкранной загрузки)
  center: {
    type: Boolean,
    default: false,
  },

  // Цвет спиннера (accent, default, white)
  color: {
    type: String,
    default: 'accent',
    validator: (value) => ['accent', 'default', 'white'].includes(value),
  },
})
</script>

<template>
  <div
    :class="[
      'loading-spinner',
      `loading-spinner--${size}`,
      { 'loading-spinner--center': center },
      `loading-spinner--color-${color}`,
    ]"
  >
    <div class="loading-spinner__circle"></div>
    <p v-if="showText" class="loading-spinner__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
}

.loading-spinner--center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}

.loading-spinner__circle {
  border-radius: 50%;
  border-style: solid;
  animation: spin 1s linear infinite;
  flex-shrink: 0;
}

/* Размеры спиннера */
.loading-spinner--sm .loading-spinner__circle {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-spinner--md .loading-spinner__circle {
  width: 32px;
  height: 32px;
  border-width: 3px;
}

.loading-spinner--lg .loading-spinner__circle {
  width: 48px;
  height: 48px;
  border-width: 4px;
}

/* Цвета спиннера */
.loading-spinner__circle {
  border-color: var(--border-color);
  border-top-color: var(--accent-color);
}

.loading-spinner--color-accent .loading-spinner__circle {
  border-top-color: var(--accent-color);
}

.loading-spinner--color-default .loading-spinner__circle {
  border-top-color: var(--text-main-color);
}

.loading-spinner--color-white .loading-spinner__circle {
  border-color: rgba(255, 255, 255, 0.3);
  border-top-color: white;
}

.loading-spinner__text {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--text-main-color);
  font-weight: 500;
}

.loading-spinner--center .loading-spinner__text {
  color: var(--accent);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Дополнительные утилитарные классы */
.loading-spinner--inline {
  display: inline-flex;
  vertical-align: middle;
}

.loading-spinner--overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(2px);
}
</style>
