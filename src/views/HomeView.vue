<script setup>
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { usePagination } from '@/composables/usePagination'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import PostCard from '@/components/common/PostCard.vue'

// Store
const postsStore = usePostsStore()

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
} = usePagination(() => postsStore.filteredPosts, 10)

// Локальное состояние для поиска
const searchQuery = ref('')

// Методы
const loadPosts = async () => {
  await postsStore.fetchAllPosts()
}

const handleSearch = () => {
  postsStore.setSearchQuery(searchQuery.value)
  // Пагинация автоматически сбросится через реактивность filteredPosts
}

const handleClearSearch = () => {
  searchQuery.value = ''
  postsStore.clearFilters()
}

const handlePostUpdated = (updatedPost) => {
  console.log('Post updated:', updatedPost)
}

// Автозагрузка при монтировании
onMounted(() => {
  loadPosts()
})
</script>

<template>
  <div class="home">
    <div class="home-header">
      <h1>Главная страница</h1>
      
      <!-- Поиск -->
      <div class="search-section">
        <input 
          v-model="searchQuery" 
          @input="handleSearch"
          type="text" 
          placeholder="Поиск по постам..."
          class="search-input"
        >
        <button 
          v-if="searchQuery" 
          @click="handleClearSearch"
          class="clear-search-btn"
        >
          Очистить
        </button>
      </div>
    </div>

    <!-- Отображение ошибки -->
    <div v-if="postsStore.error" class="error-message">
      <p><strong>Ошибка:</strong> {{ postsStore.error }}</p>
    </div>

    <!-- Состояния загрузки и данных -->
    <div class="content-area">
      <!-- Полноэкранная загрузка (первая загрузка) -->
      <LoadingSpinner 
        v-if="postsStore.loading && postsStore.posts.length === 0"
        center
        size="lg" 
        show-text 
        text="Загружаем посты..." 
      />

      <!-- Загрузка поверх существующих данных -->
      <div v-else-if="postsStore.loading && postsStore.posts.length > 0" class="relative">
        <div class="posts-grid">
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
      <div v-else-if="postsStore.posts.length > 0" class="posts-loaded">
        <!-- Статистика -->
        <div class="posts-stats">
          <p>Всего постов: {{ postsStore.totalPosts }}</p>
          <p>Найдено: {{ postsStore.filteredPosts.length }}</p>
          <p>На странице: {{ paginatedPosts.length }}</p>
          <p>Страница {{ currentPage }} из {{ totalPages }}</p>
        </div>

        <!-- Список постов -->
        <div class="posts-grid">
          <PostCard 
            v-for="post in paginatedPosts" 
            :key="post.id" 
            :post="post"
            @post-updated="handlePostUpdated"
          />
        </div>

        <!-- Пагинация -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="prevPage"
            :disabled="!hasPrevPage"
            class="pagination-btn"
          >
            ← Предыдущая
          </button>
          
          <div class="pagination-info">
            {{ currentPage }} / {{ totalPages }}
          </div>
          
          <button 
            @click="nextPage"
            :disabled="!hasNextPage"
            class="pagination-btn"
          >
            Следующая →
          </button>
        </div>
      </div>

      <!-- Пустое состояние -->
      <div v-else class="empty-state">
        <h3>Нет постов</h3>
        <button @click="loadPosts" class="reload-btn">
          Загрузить посты
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: var(--spacing-lg);
  max-width: 800px;
  margin: 0 auto;
}

.home-header {
  margin-bottom: var(--spacing-xl);
}

.test-controls {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
  flex-wrap: wrap;
}

.btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  border-radius: var(--border-radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-base);
}

.btn--primary {
  background-color: var(--primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background-color: var(--primary-dark);
}

.btn--secondary {
  background-color: var(--secondary);
  color: white;
}

.btn--danger {
  background-color: #dc2626;
  color: white;
}

.btn--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background-color: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  color: #dc2626;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content-area {
  position: relative;
  min-height: 300px;
}

.posts-stats {
  background: var(--bg-secondary);
  padding: var(--spacing-md);
  border-radius: var(--border-radius);
  margin-bottom: var(--spacing-lg);
}

.search-section {
  margin-bottom: var(--spacing-lg);
}

.posts-preview {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.post-card-preview {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-sm);
}

.post-card-preview h4 {
  margin: 0;
  color: var(--text-primary);
  flex: 1;
}

.post-card-preview p {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-secondary);
  line-height: 1.5;
}

.post-card-preview small {
  color: var(--text-muted);
}

.like-btn {
  background: none;
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-xs) var(--spacing-sm);
  cursor: pointer;
  transition: var(--transition-base);
  font-size: var(--font-size-sm);
}

.like-btn:hover {
  border-color: var(--primary);
  background-color: var(--bg-secondary);
}

.like-btn.liked {
  background-color: #fee2e2;
  border-color: #fecaca;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: var(--spacing-xl);
  color: var(--text-muted);
}

.relative {
  position: relative;
}
</style>