<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 1,
  },
  variant: {
    type: String,
    default: 'card', // 'card' или 'detail'
    validator: (value) => ['card', 'detail'].includes(value),
  },
})
</script>

<template>
  <div v-for="n in count" :key="n" :class="['skeleton-post', `skeleton-post--${variant}`]">
    <!-- Изображение skeleton -->
    <div class="skeleton-post__image">
      <div class="skeleton-shimmer"></div>
    </div>

    <div class="skeleton-post__body">
      <!-- Заголовок skeleton -->
      <div class="skeleton-post__title">
        <div class="skeleton-shimmer"></div>
      </div>

      <!-- Текст skeleton -->
      <div class="skeleton-post__text">
        <div class="skeleton-post__line">
          <div class="skeleton-shimmer"></div>
        </div>
        <div class="skeleton-post__line skeleton-post__line--short">
          <div class="skeleton-shimmer"></div>
        </div>
      </div>

      <!-- Автор и действия skeleton -->
      <div class="skeleton-post__footer">
        <div class="skeleton-post__author">
          <div class="skeleton-post__avatar">
            <div class="skeleton-shimmer"></div>
          </div>
          <div class="skeleton-post__author-info">
            <div class="skeleton-post__author-name">
              <div class="skeleton-shimmer"></div>
            </div>
          </div>
        </div>

        <!-- Кнопки действий skeleton -->
        <div class="skeleton-post__actions">
          <div class="skeleton-post__action-btn">
            <div class="skeleton-shimmer"></div>
          </div>
          <div class="skeleton-post__action-btn">
            <div class="skeleton-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-post {
  background: #fff;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  box-shadow: var(--box-shadow);
  transition: all 0.2s ease;
}

.skeleton-post__image {
  width: 100%;
  height: 200px;
  border-radius: 10px 10px 0 0;
  margin-bottom: 12px;
  background: #f3f4f6;
  position: relative;
  overflow: hidden;
}

.skeleton-post__body {
  padding: 0 20px 20px;
}

.skeleton-post__title {
  height: 28px;
  width: 75%;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 16px;
  position: relative;
  overflow: hidden;
}

.skeleton-post__text {
  margin-bottom: 16px;
}

.skeleton-post__line {
  height: 16px;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

.skeleton-post__line--short {
  width: 60%;
}

.skeleton-post__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.skeleton-post__author {
  display: flex;
  align-items: center;
  grid-gap: 12px;
}

.skeleton-post__avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #f3f4f6;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.skeleton-post__author-info {
  display: flex;
  flex-direction: column;
  grid-gap: 6px;
}

.skeleton-post__author-name {
  width: 100px;
  height: 16px;
  background: #f3f4f6;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-post__author-meta {
  width: 80px;
  height: 14px;
  background: #f3f4f6;
  border-radius: 4px;
  position: relative;
  overflow: hidden;
}

.skeleton-post__actions {
  display: flex;
  grid-gap: 15px;
}

.skeleton-post__action-btn {
  width: 32px;
  height: 24px;
  background: #f3f4f6;
  border-radius: 6px;
  position: relative;
  overflow: hidden;
}

/* Основная анимация shimmer */
.skeleton-shimmer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.4) 20%,
    rgba(255, 255, 255, 0.8) 50%,
    rgba(255, 255, 255, 0.4) 80%,
    rgba(255, 255, 255, 0) 100%
  );
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* Адаптивность */
@media (max-width: 768px) {
  .skeleton-post {
    padding: 16px;
    margin-bottom: 16px;
  }

  .skeleton-post__image {
    height: 150px;
    margin-bottom: 12px;
  }

  .skeleton-post__title {
    height: 24px;
    margin-bottom: 12px;
  }

  .skeleton-post__avatar {
    width: 36px;
    height: 36px;
  }
}

/* Темная тема */
@media (prefers-color-scheme: dark) {
  .skeleton-post {
    background: #1f2937;
    border-color: #374151;
  }

  .skeleton-post__image,
  .skeleton-post__title,
  .skeleton-post__line,
  .skeleton-post__avatar,
  .skeleton-post__author-name,
  .skeleton-post__author-meta,
  .skeleton-post__action-btn {
    background: #374151;
  }

  .skeleton-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.1) 20%,
      rgba(255, 255, 255, 0.2) 50%,
      rgba(255, 255, 255, 0.1) 80%,
      rgba(255, 255, 255, 0) 100%
    );
  }
}
</style>
