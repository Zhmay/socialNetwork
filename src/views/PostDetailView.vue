<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts.js'
import PostDetail from '@/components/post/PostDetail.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

// Props от роутера
const props = defineProps({
  id: {
    type: Number,
    required: true
  }
})

// Composables
const router = useRouter()
const postsStore = usePostsStore()

// Методы
const goBack = () => {
  const currentRoute = router.currentRoute.value
  
  // Если есть информация о странице источнике
  if (currentRoute.query.from) {
    console.log('Navigating back to:', currentRoute.query.from);
    
    router.push({
      name: currentRoute.query.from,
      query: {
        // Убираем служебные query параметры
        ...Object.fromEntries(
          Object.entries(currentRoute.query).filter(([key]) => 
            !['from'].includes(key)
          )
        )
      }
    })
  } else {
    console.log('Navigating back to home');
    // Fallback - обычный возврат назад
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
    <div class="post-detail-view__header">
      <button @click="goBack" class="post-detail-view__back-btn">
        ← Назад
      </button>
    </div>

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

<style scoped>

</style>