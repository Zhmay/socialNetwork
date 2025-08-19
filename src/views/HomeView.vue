<script setup>
import { ref } from 'vue'
import { usePostsStore } from '@/stores/posts'
import PostList from '@/components/post/PostList.vue'

// Store
const postsStore = usePostsStore()

// Локальное состояние для поиска
const searchQuery = ref('')

// Методы

const handleSearch = () => {
  postsStore.setSearchQuery(searchQuery.value)
  // Пагинация автоматически сбросится через реактивность filteredPosts
}

const handleClearSearch = () => {
  searchQuery.value = ''
  postsStore.clearFilters()
}

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
      @post-updated="postsStore.updatePost"
    />
  </div>
</template>

<style scoped>

</style>