<script setup>
    import { onMounted } from 'vue'
    import { usePostsStore } from '@/stores/posts'
    import { usePagination } from '@/composables/usePagination'
    import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
    import PostCard from '@/components/post/PostCard.vue'
    import Pagination from '@/components/common/Pagination.vue'

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
    } = usePagination(() => postsStore.filteredPosts, 14) // Количество постов на странице

    // Методы
    const loadPosts = async () => {
    await postsStore.fetchAllPosts()
    }

    const handlePostUpdated = (updatedPost) => {
        console.log('Post updated:', updatedPost)
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

    // Автозагрузка при монтировании
    onMounted(() => {
        loadPosts()
    })
</script>

<template>
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
      <div v-else-if="postsStore.posts.length > 0" class="posts-loaded">
        <!-- Статистика -->
        <div class="posts-stats">
          <p>Всего постов: {{ postsStore.totalPosts }}</p>
          <p>Найдено: {{ postsStore.filteredPosts.length }}</p>
          <p>На странице: {{ paginatedPosts.length }}</p>
          <p>Страница {{ currentPage }} из {{ totalPages }}</p>
        </div>

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

      <!-- Пустое состояние -->
      <div v-else class="empty-state">
        <h3>Нет постов</h3>
        <button @click="loadPosts" class="reload-btn">
          Загрузить посты
        </button>
      </div>
    </div>
</template>