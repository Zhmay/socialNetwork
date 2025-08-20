// stores/posts.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsService } from '@/services/posts.service.js'
import { useLikes } from '@/composables/useLikes.js'

export const usePostsStore = defineStore('posts', () => {
  const { initializePostLikes } = useLikes()
  
  // === STATE ===
  const posts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Фильтры (простые)  
  const searchQuery = ref('')
  const selectedUserId = ref(null)

  // === GETTERS ===
  const totalPosts = computed(() => posts.value.length)

  const filteredPosts = computed(() => {
    let filtered = posts.value

    // Фильтр по пользователю
    if (selectedUserId.value) {
      filtered = filtered.filter(post => post.userId === selectedUserId.value)
    }

    // Поиск по тексту
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter(post => {
        const titleMatch = post.title.toLowerCase().includes(query)
        const bodyMatch = post.body.toLowerCase().includes(query)
        return titleMatch || bodyMatch
      })
    }

    return filtered
  })

  // === ACTIONS ===
  const fetchAllPosts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await postsService.getAllPosts()
      posts.value = response.data.map(post => initializePostLikes(post))
    } catch (err) {
      error.value = 'Ошибка загрузки постов: ' + err.message
      console.error('Error fetching posts:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchPostById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await postsService.getPostById(id)
      currentPost.value = initializePostLikes(response.data)
      return currentPost.value
    } catch (err) {
      error.value = 'Ошибка загрузки поста: ' + err.message
      console.error('Error fetching post:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const createPost = async (postData) => {
    loading.value = true
    error.value = null

    try {
      const response = await postsService.createPost(postData)
      const newPost = initializePostLikes({
        ...response.data,
        likes: 0,
        isLiked: false
      })

      // Добавляем в начало списка (оптимистичное обновление)
      posts.value.unshift(newPost)
      return newPost
    } catch (err) {
      error.value = 'Ошибка создания поста: ' + err.message
      console.error('Error creating post:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  // Обновление поста в списке (для лайков)
  const updatePost = (updatedPost) => {
    const index = posts.value.findIndex(post => post.id === updatedPost.id)
    if (index !== -1) {
      posts.value[index] = { ...posts.value[index], ...updatedPost }
    }
    
    // Обновляем текущий пост, если он открыт
    if (currentPost.value && currentPost.value.id === updatedPost.id) {
      currentPost.value = { ...currentPost.value, ...updatedPost }
    }
  }

  // Поиск и фильтрация
  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const setUserFilter = (userId) => {
    selectedUserId.value = userId
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedUserId.value = null
  }

  // Очистка состояния
  const clearCurrentPost = () => {
    currentPost.value = null
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    posts,
    currentPost,
    loading,
    error,
    searchQuery,
    selectedUserId,

    // Getters
    totalPosts,
    filteredPosts,

    // Actions
    fetchAllPosts,
    fetchPostById,
    createPost,
    updatePost,
    setSearchQuery,
    setUserFilter,
    clearFilters,
    clearCurrentPost,
    clearError
  }
})