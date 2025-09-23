<script setup>
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePagination } from '@/composables/usePagination'
import { useErrorHandling } from '@/composables/useErrorHandling'
import PostCard from '@/components/post/PostCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import PostSkeleton from '@/components/skeleton/PostSkeleton.vue'
import ErrorState from '@/components/common/ErrorState.vue'

// Props
const props = defineProps({
  posts: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: [Object, String, null],
    default: null,
  },
  postsPerPage: {
    type: Number,
    default: 10,
  },
  showStats: {
    type: Boolean,
    default: true,
  },
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  retryFunction: {
    type: Function,
    required: true,
  },
  clearErrorFunction: {
    type: Function,
    default: null,
  },
})

const route = useRoute()
const router = useRouter()
const newPostIds = ref(new Set())

// Emits
const emit = defineEmits(['post-updated', 'reload'])

// Composables
const { simpleRetry } = useErrorHandling()
const {
  paginatedItems: paginatedPosts,
  currentPage,
  totalPages,
  setPage,
  nextPage,
  prevPage,
  hasNextPage,
  hasPrevPage,
} = usePagination(() => props.posts, props.postsPerPage)

// Методы
const handlePostUpdated = (updatedPost) => {
  emit('post-updated', updatedPost)
}

const handleReload = async () => {
  await simpleRetry(props.retryFunction, props.clearErrorFunction)
  emit('reload')
}

// Методы пагинации
const handlePageChange = (page) => {
  setPage(page)
  // Обновляем URL, убираем page=1
  const query = { ...route.query }
  if (page > 1) {
    query.page = page
  } else {
    delete query.page // Убираем параметр page если это первая страница
  }
  router.push({ query })
}

const handlePrevPage = () => {
  prevPage()
  const newPage = currentPage.value
  const query = { ...route.query }
  if (newPage > 1) {
    query.page = newPage
  } else {
    delete query.page
  }
  router.push({ query })
}

const handleNextPage = () => {
  nextPage()
  const newPage = currentPage.value
  const query = { ...route.query }
  if (newPage > 1) {
    query.page = newPage
  } else {
    delete query.page
  }
  router.push({ query })
}

const setPageFromUrl = (page) => {
  console.log('Setting page from URL:', page) // Для отладки
  if (page >= 1 && page <= totalPages.value) {
    setPage(page)
  }
}

// Expose метод для родительского компонента
defineExpose({
  setPageFromUrl,
})

watch(
  () => props.posts,
  (newPosts, oldPosts) => {
    // Проверяем что у нас реально были старые посты
    if (!oldPosts || oldPosts.length === 0) return

    if (newPosts.length > oldPosts.length) {
      const oldIds = new Set(oldPosts.map((p) => p.id))
      newPosts.forEach((post) => {
        if (!oldIds.has(post.id)) {
          newPostIds.value.add(post.id)
          setTimeout(() => {
            newPostIds.value.delete(post.id)
          }, 3000)
        }
      })
    }
  },
  { deep: true },
)
</script>

<template>
  <!-- Отображение ошибки -->
  <ErrorState v-if="error" :error="error" @retry="handleReload" />

  <!-- Состояния загрузки и данных -->
  <div class="content-area">
    <PostSkeleton v-if="loading && posts.length === 0" :count="postsPerPage" :show-image="true" />

    <div v-else-if="loading && posts.length > 0" class="relative">
      <div class="posts-list posts-list--loading">
        <PostCard
          v-for="post in paginatedPosts.slice(0, 3)"
          :key="post.id"
          :post="post"
          :current-page="currentPage"
          @post-updated="handlePostUpdated"
        />
      </div>

      <PostSkeleton :count="2" />
    </div>

    <div v-else-if="posts.length > 0" class="posts-loaded">
      <TransitionGroup name="post-enhanced" tag="div" class="posts-list">
        <PostCard
          v-for="post in paginatedPosts"
          :key="post.id"
          :post="post"
          :current-page="currentPage"
          :class="{ 'post-card--fresh': newPostIds.has(post.id) }"
          @post-updated="handlePostUpdated"
        />
      </TransitionGroup>

      <Pagination
        v-if="totalPages > 1"
        :current-page="currentPage"
        :total-pages="totalPages"
        :has-next-page="hasNextPage"
        :has-prev-page="hasPrevPage"
        :show-page-numbers="true"
        size="md"
        @page-change="handlePageChange"
        @prev-page="handlePrevPage"
        @next-page="handleNextPage"
      />
    </div>
  </div>
</template>

<style scoped>
.posts-list--loading {
  opacity: 0.6;
  pointer-events: none;
}

.relative {
  position: relative;
}
</style>
