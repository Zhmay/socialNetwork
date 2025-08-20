<script setup>
import { ref, onMounted, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import PostList from '@/components/post/PostList.vue'
import SearchBox from '@/components/common/SearchBox.vue'

// Store
const postsStore = usePostsStore()

// Computed для передачи в SearchBox
const searchResults = computed(() => ({
  total: postsStore.filteredPosts.length,
  query: postsStore.searchQuery,
  isSearching: postsStore.loading
}))

// Методы
const loadPosts = async () => {
  await postsStore.fetchAllPosts()
}

const handleSearch = (query) => {
  if (query.trim() === '') {
    postsStore.clearFilters()
  } else {
    postsStore.setSearchQuery(query)
  }
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
      <SearchBox
        :model-value="postsStore.searchQuery"
        placeholder="Поиск по постам..."
        :debounce="400"
        :search-results="searchResults"
        @search="handleSearch"
      />
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