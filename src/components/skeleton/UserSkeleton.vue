<script setup>
const props = defineProps({
  count: {
    type: Number,
    default: 1,
  },
  showImage: {
    type: Boolean,
    default: true,
  },
})
</script>

<template>
  <div v-for="n in count" :key="n" class="skeleton-user">
    <!-- Изображение skeleton -->
    <div class="skeleton-user__avatar">
      <div class="skeleton-shimmer"></div>
    </div>

    <div class="skeleton-user__name">
      <div class="skeleton-shimmer"></div>
    </div>
    <div class="skeleton-user__nickname">
      <div class="skeleton-shimmer"></div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-user {
  background: #fff;
  padding: 16px;
  border-radius: var(--border-radius);
  margin-bottom: 20px;
  box-shadow: var(--box-shadow);
  transition: all 0.2s ease;
  position: relative;
}

.skeleton-user__avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-bottom: 12px;
  margin: 0 auto 10px;
  background: #f3f4f6;
  position: relative;
  overflow: hidden;
}

.skeleton-user__name {
  height: 20px;
  width: 95%;
  background: #f3f4f6;
  border-radius: 4px;
  margin: 0 auto 5px;
  position: relative;
  overflow: hidden;
}
.skeleton-user__nickname {
  height: 16px;
  width: 65%;
  background: #f3f4f6;
  border-radius: 4px;
  margin: 0 auto;
  position: relative;
  overflow: hidden;
}

.skeleton-user__line {
  height: 16px;
  background: #f3f4f6;
  border-radius: 4px;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
}

/* Адаптивность */
@media (max-width: 768px) {
  .skeleton-user {
    padding: 16px;
    margin-bottom: 16px;
  }

  .skeleton-user__image {
    height: 150px;
    margin-bottom: 12px;
  }

  .skeleton-user__title {
    height: 24px;
    margin-bottom: 12px;
  }

  .skeleton-user__avatar {
    width: 36px;
    height: 36px;
  }
}
</style>
