<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts.js'
import PostDetail from '@/components/post/PostDetail.vue'
import CommentsList from '@/components/comments/CommentsList.vue'
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
const goBackHandler = () => {
  router.back()
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

    <!-- Контент -->
    <div class="post-detail-view__content">
      <!-- Loading состояние -->
      <LoadingSpinner v-if="postsStore.loading" size="lg" center />

      <!-- Error состояние -->
      <div v-else-if="postsStore.error" class="post-detail-view__error">
        {{ postsStore.error }}
      </div>

      <!-- Детальная информация о посте -->
      <PostDetail
        v-else-if="postsStore.currentPost"
        :post="postsStore.currentPost"
        :goBack="goBackHandler"
        @post-updated="postsStore.updatePost"
      />
    </div>

    <CommentsList v-if="postsStore.currentPost" :post-id="postsStore.currentPost.id" />
  </div>
</template>

<style scoped lang="scss">
.post-detail-view {
  &__content {
    margin-bottom: 50px;
  }
}
</style>
