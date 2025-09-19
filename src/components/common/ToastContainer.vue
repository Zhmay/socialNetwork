<script setup>
import { useToast } from '@/composables/useToast'

const { toasts, removeToast } = useToast()
</script>

<template>
  <div class="toast-container">
    <TransitionGroup name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="['toast', `toast--${toast.type}`]"
        @click="removeToast(toast.id)"
      >
        <div class="toast__content">
          {{ toast.message }}
        </div>
        <button
          class="toast__close"
          @click.stop="removeToast(toast.id)"
          aria-label="Закрыть уведомление"
        >
          ×
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9999;
  max-width: 400px;
  width: 100%;
  pointer-events: none;
}

.toast {
  background: white;
  border-radius: 8px;
  box-shadow:
    0 4px 12px rgba(0, 0, 0, 0.1),
    0 2px 4px rgba(0, 0, 0, 0.05);
  margin-bottom: 12px;
  padding: 16px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 4px solid;
  pointer-events: auto;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.toast:hover {
  transform: translateY(-2px);
  box-shadow:
    0 6px 20px rgba(0, 0, 0, 0.15),
    0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Типы тостов */
.toast--success {
  border-left-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4 0%, #ffffff 100%);
}

.toast--error {
  border-left-color: #ef4444;
  background: linear-gradient(135deg, #fef2f2 0%, #ffffff 100%);
}

.toast--warning {
  border-left-color: #f59e0b;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 100%);
}

.toast--info {
  border-left-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #ffffff 100%);
}

.toast__content {
  flex: 1;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-primary, #1f2937);
  font-weight: 500;
}

.toast__close {
  background: none;
  border: none;
  font-size: 20px;
  color: var(--text-secondary, #6b7280);
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.toast__close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: var(--text-primary, #1f2937);
}

/* Анимация прогресс-бара */
.toast::before {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  height: 2px;
  background: currentColor;
  width: 100%;
  transform-origin: left;
  animation: toast-progress 3000ms linear forwards;
}

.toast--success::before {
  background: #10b981;
}

.toast--error::before {
  background: #ef4444;
}

.toast--warning::before {
  background: #f59e0b;
}

.toast--info::before {
  background: #3b82f6;
}

@keyframes toast-progress {
  from {
    transform: scaleX(1);
  }
  to {
    transform: scaleX(0);
  }
}

/* Transition анимации для ToastGroup */
.toast-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.toast-leave-active {
  transition: all 0.3s ease-out;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.8);
}

.toast-move {
  transition: transform 0.3s ease;
}

/* Адаптив */
@media (max-width: 480px) {
  .toast-container {
    top: 10px;
    right: 10px;
    left: 10px;
    max-width: none;
  }

  .toast {
    margin-bottom: 8px;
    padding: 12px;
  }

  .toast__content {
    font-size: 13px;
  }
}
</style>
