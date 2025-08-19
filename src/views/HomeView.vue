<script setup>
import { ref, onMounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import PostList from '@/components/post/PostList.vue'

// Store
const postsStore = usePostsStore()

// Локальное состояние для поиска
const searchQuery = ref('')

// Методы
const loadPosts = async () => {
  await postsStore.fetchAllPosts()
}

const handleSearch = () => {
  postsStore.setSearchQuery(searchQuery.value)
}

const handleClearSearch = () => {
  searchQuery.value = ''
  postsStore.clearFilters()
}

const handlePostUpdated = (updatedPost) => {
  postsStore.updatePost(updatedPost)
}

const handleReload = () => {
  loadPosts()
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

    <PostList 
      :posts="postsStore.filteredPosts"
      :loading="postsStore.loading"
      :error="postsStore.error"
      :posts-per-page="14"
      :show-stats="true"
      empty-state-text="Посты не найдены"
      loading-text="Загружаем посты..."
      @post-updated="handlePostUpdated"
      @reload="handleReload"
    />
  </div>
</template>

<style scoped>
/* Стили добавишь сам */
</style>