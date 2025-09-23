<script setup>
import SvgIcon from '@/components/common/SvgIcon.vue'

const props = defineProps({
  error: {
    type: Object,
    default: () => ({}),
  },
  showRetry: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'medium', // small, medium, large
    validator: (value) => ['small', 'medium', 'large'].includes(value),
  },
})

const emit = defineEmits(['retry'])

const handleRetry = () => {
  emit('retry')
}

// Определяем иконку и заголовок по типу ошибки
const getErrorConfig = () => {
  const { error } = props

  if (error.type === 'network') {
    return {
      icon: 'wifi-off',
      title: props.title || 'Connection Error',
      description: props.description || error.message,
    }
  }

  if (error.type === 'timeout') {
    return {
      icon: 'refresh-cw',
      title: props.title || 'Request Timeout',
      description: props.description || error.message,
    }
  }

  if (error.type === 'not_found') {
    return {
      icon: 'search',
      title: props.title || 'Not Found',
      description: props.description || "The content you're looking for doesn't exist.",
    }
  }

  if (error.type === 'server') {
    return {
      icon: 'server',
      title: props.title || 'Server Error',
      description: props.description || error.message,
    }
  }

  return {
    icon: 'alert-circle',
    title: props.title || 'Something went wrong',
    description: props.description || error.message || 'An unexpected error occurred.',
  }
}
</script>

<template>
  <div :class="['error-state', `error-state--${size}`]">
    <div class="error-state__icon">
      <SvgIcon :name="getErrorConfig().icon" size="48" />
    </div>

    <div class="error-state__content">
      <h3 class="error-state__title">{{ getErrorConfig().title }}</h3>
      <p class="error-state__description">{{ getErrorConfig().description }}</p>
    </div>

    <div v-if="showRetry && error.retryable" class="error-state__actions">
      <button @click="handleRetry" class="btn btn--border">
        <SvgIcon name="refresh-cw" size="20" />
        Try Again
      </button>
    </div>
  </div>
</template>

<style scoped>
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 40px 20px;
}

.error-state--small {
  padding: 20px;
}

.error-state--large {
  padding: 60px 20px;
}

.error-state__icon {
  color: #6b7280;
  margin-bottom: 16px;
}

.error-state__content {
  margin-bottom: 24px;
  max-width: 400px;
}

.error-state__title {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.error-state--small .error-state__title {
  font-size: 18px;
}

.error-state--large .error-state__title {
  font-size: 24px;
}

.error-state__description {
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

.error-state__actions .btn {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
