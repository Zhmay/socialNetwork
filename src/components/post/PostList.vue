<script setup>
import { usePagination } from '@/composables/usePagination'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import PostCard from '@/components/post/PostCard.vue'
import Pagination from '@/components/common/Pagination.vue'

// Props
const props = defineProps({
  posts: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  },
  postsPerPage: {
    type: Number,
    default: 10
  },
  showStats: {
    type: Boolean,
    default: true
  },
  loadingText: {
    type: String,
    default: 'Загружаем посты...'
  }
})

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
  hasPrevPage
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
}

const handlePrevPage = () => {
  prevPage()
}

const handleNextPage = () => {
  nextPage()
}
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

    <!-- Загрузка поверх существующих данных -->
    <div v-else-if="loading && posts.length > 0" class="relative">
      <div class="posts-list">
        <PostCard 
          v-for="post in paginatedPosts.slice(0, 3)" 
          :key="post.id" 
          :post="post"
          @post-updated="handlePostUpdated"
        />
      </div>
      
      <!-- Overlay спиннер -->
      <LoadingSpinner 
        class="loading-spinner--overlay" 
        size="md"
        show-text
        text="Обновляем..."
      />
    </div>

    <!-- Успешно загруженные данные -->
    <div v-else-if="posts.length > 0" class="posts-loaded">
      <!-- Список постов -->
      <div class="posts-list">
        <PostCard 
          v-for="post in paginatedPosts" 
          :key="post.id" 
          :post="post"
          @post-updated="handlePostUpdated"
        />
      </div>

      <!-- Пагинация -->
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