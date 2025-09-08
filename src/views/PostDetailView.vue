<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts.js'
import PostDetail from '@/components/post/PostDetail.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SvgIcon from '@/components/common/SvgIcon.vue'

// Props от роутера
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

// Composables
const router = useRouter()
const postsStore = usePostsStore()

// Методы
const goBack = () => {
  const currentRoute = router.currentRoute.value

  if (currentRoute.query.from) {
    const query = { ...currentRoute.query }
    delete query.from // Убираем служебный параметр

    // Если page=1, убираем его из URL
    if (query.page === '1') {
      delete query.page
    }

    router.push({
      name: currentRoute.query.from,
      query,
    })
  } else {
    router.back()
  }
}

// Lifecycle
onMounted(async () => {
  await postsStore.fetchPostById(props.id)

  // Если пост не найден, редиректим на главную
  if (!postsStore.currentPost) {
    router.push({ name: 'home' })
  }
})

onUnmounted(() => {
  // Очищаем текущий пост при уходе со страницы
  postsStore.clearCurrentPost()
})
</script>

<template>
  <div class="post-detail-view">
    <!-- Навигация -->
    <button @click="goBack" class="post-detail-view__back-btn">
      <SvgIcon name="arrow-small" size="14" />
    </button>

    <!-- Контент -->
    <div class="post-detail-view__content">
      <!-- Loading состояние -->
      <LoadingSpinner v-if="postsStore.loading" />

      <!-- Error состояние -->
      <div v-else-if="postsStore.error" class="post-detail-view__error">
        {{ postsStore.error }}
      </div>

      <!-- Детальная информация о посте -->
      <PostDetail
        v-else-if="postsStore.currentPost"
        :post="postsStore.currentPost"
        @post-updated="postsStore.updatePost"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.post-detail-view {
  &__back-btn {
    position: absolute;
    top: 30px;
    left: 30px;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.8);
    border-radius: 50%;
    box-shadow: var(--box-shadow);
    cursor: pointer;
    color: var(--accent-color);
    transform: rotate(180deg);
    transition:
      background 0.3s,
      box-shadow 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 1);
      color: var(--accent-color);
    }
  }
}
</style>
