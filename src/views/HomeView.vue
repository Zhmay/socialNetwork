<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import { usePostsStore } from '@/stores/posts'
import PostList from '@/components/post/PostList.vue'
import SearchBox from '@/components/common/SearchBox.vue'
import SortSelect from '@/components/common/sortSelect.vue'

// Router
const route = useRoute()

// Store
const postsStore = usePostsStore()

// Ref для PostList компонента
const postListRef = ref(null)
const isPostsLoaded = ref(false)
const retryLoadPosts = () => postsStore.fetchAllPosts()
const clearPostsError = () => postsStore.clearError()

// Computed для передачи в SearchBox
const searchResults = computed(() => ({
  total: postsStore.filteredPosts.length,
  query: postsStore.searchQuery,
  isSearching: postsStore.loading,
}))

// Методы
const loadPosts = async () => {
  await postsStore.fetchAllPosts()
  isPostsLoaded.value = true

  // После загрузки постов проверяем URL параметры
  await nextTick()
  const pageFromUrl = parseInt(route.query.page) || 1
  if (pageFromUrl > 1 && postListRef.value) {
    postListRef.value.setPageFromUrl(pageFromUrl)
  }
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

const handleSortChange = (sortType) => {
  postsStore.setSortBy(sortType)
}

// Отслеживаем изменения query параметров только после загрузки постов
watch(
  () => route.fullPath,
  (newPath, oldPath) => {
    // Если перешли на чистый "/" с другого пути
    if (newPath === '/' && oldPath !== '/' && postListRef.value) {
      postListRef.value.setPageFromUrl(1)
    }
  },
)

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
        placeholder="Search by title, content, author...."
        :debounce="400"
        :search-results="searchResults"
        @search="handleSearch"
      />

      <SortSelect :model-value="postsStore.sortBy" @update:model-value="handleSortChange" />
    </div>

    <PostList
      ref="postListRef"
      :posts="postsStore.filteredPosts"
      :loading="postsStore.loading"
      :error="postsStore.error"
      :retry-function="retryLoadPosts"
      :clear-error-function="clearPostsError"
      :posts-per-page="14"
      :show-stats="true"
      @post-updated="handlePostUpdated"
      @reload="handleReload"
    />
  </div>
</template>

<style scoped lang="scss">
.home-header {
  margin-bottom: 30px;
}
</style>
