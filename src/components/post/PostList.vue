<script setup>
import { useRoute, useRouter } from 'vue-router'
import { usePagination } from '@/composables/usePagination'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import PostCard from '@/components/post/PostCard.vue'
import Pagination from '@/components/common/Pagination.vue'

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
    type: String,
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
})

const route = useRoute()
const router = useRouter()

// Emits
const emit = defineEmits(['post-updated', 'reload'])

// Composables
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

const handleReload = () => {
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

// const handlePrevPage = () => {
//   prevPage()
//   const newPage = currentPage.value
//   router.push({
//     query: { ...route.query, page: newPage > 1 ? newPage : undefined }
//   })
// }

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

// const handleNextPage = () => {
//   nextPage()
//   const newPage = currentPage.value
//   router.push({
//     query: { ...route.query, page: newPage > 1 ? newPage : undefined }
//   })
// }

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
</script>

<template>
  <!-- Отображение ошибки -->
  <div v-if="error" class="error-message">
    <p><strong>Ошибка:</strong> {{ error }}</p>
  </div>

  <!-- Состояния загрузки и данных -->
  <div class="content-area">
    <!-- Полноэкранная загрузка (первая загрузка) -->
    <LoadingSpinner
      v-if="loading && posts.length === 0"
      center
      size="lg"
      show-text
      :text="loadingText"
    />

    <div v-else-if="loading && posts.length > 0" class="relative">
      <div class="posts-list">
        <PostCard
          v-for="post in paginatedPosts.slice(0, 3)"
          :key="post.id"
          :post="post"
          :current-page="currentPage"
          @post-updated="handlePostUpdated"
        />
      </div>

      <LoadingSpinner class="loading-spinner--overlay" size="md" show-text text="Updating..." />
    </div>

    <div v-else-if="posts.length > 0" class="posts-loaded">
      <div class="posts-list">
        <PostCard
          v-for="post in paginatedPosts"
          :key="post.id"
          :post="post"
          :current-page="currentPage"
          @post-updated="handlePostUpdated"
        />
      </div>

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

<style scoped></style>
