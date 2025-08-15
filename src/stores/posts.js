import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsService } from '@/services/posts.service.js'

export const usePostsStore = defineStore('posts', () => {
  // === STATE ===
  const posts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const error = ref(null)

  // Пагинация
  const currentPage = ref(1)
  const postsPerPage = ref(10)

  // Поиск и фильтры
  const searchQuery = ref('')
  const selectedUserId = ref(null)

  // === GETTERS ===
  const totalPosts = computed(() => posts.value.length)

  const filteredPosts = computed(() => {
    let filtered = posts.value

    // Фильтр по пользователю
    if (selectedUserId.value) {
      filtered = filtered.filter((post) => post.userId === selectedUserId.value)
    }

    // Поиск по тексту
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) || post.body.toLowerCase().includes(query),
      )
    }

    return filtered
  })

  const paginatedPosts = computed(() => {
    const start = (currentPage.value - 1) * postsPerPage.value
    const end = start + postsPerPage.value
    return filteredPosts.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredPosts.value.length / postsPerPage.value)
  })

  // === ACTIONS ===
  const fetchAllPosts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await postsService.getAllPosts()
      posts.value = response.data.map((post) => ({
        ...post,
        likes: getLikesFromStorage(post.id), // Загружаем лайки из localStorage
        isLiked: getIsLikedFromStorage(post.id),
      }))
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
      currentPost.value = {
        ...response.data,
        likes: getLikesFromStorage(id),
        isLiked: getIsLikedFromStorage(id),
      }
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
      const newPost = {
        ...response.data,
        likes: 0,
        isLiked: false,
      }

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

  // Система лайков (localStorage)
  const toggleLike = (postId) => {
    const postIndex = posts.value.findIndex((post) => post.id === postId)

    if (postIndex !== -1) {
      const post = posts.value[postIndex]

      if (post.isLiked) {
        // Убираем лайк
        post.likes = Math.max(0, post.likes - 1)
        post.isLiked = false
      } else {
        // Ставим лайк
        post.likes += 1
        post.isLiked = true
      }

      // Сохраняем в localStorage
      saveLikesToStorage(postId, post.likes)
      saveIsLikedToStorage(postId, post.isLiked)
    }

    // Обновляем текущий пост, если он открыт
    if (currentPost.value && currentPost.value.id === postId) {
      const post = posts.value[postIndex]
      currentPost.value.likes = post.likes
      currentPost.value.isLiked = post.isLiked
    }
  }

  // Поиск и фильтрация
  const setSearchQuery = (query) => {
    searchQuery.value = query
    currentPage.value = 1 // Сбрасываем пагинацию при поиске
  }

  const setUserFilter = (userId) => {
    selectedUserId.value = userId
    currentPage.value = 1
  }

  const clearFilters = () => {
    searchQuery.value = ''
    selectedUserId.value = null
    currentPage.value = 1
  }

  // Пагинация
  const setPage = (page) => {
    if (page >= 1 && page <= totalPages.value) {
      currentPage.value = page
    }
  }

  const nextPage = () => {
    if (currentPage.value < totalPages.value) {
      currentPage.value++
    }
  }

  const prevPage = () => {
    if (currentPage.value > 1) {
      currentPage.value--
    }
  }

  // === UTILS (localStorage для лайков) ===
  const getLikesFromStorage = (postId) => {
    const likes = localStorage.getItem(`post_likes_${postId}`)
    return likes ? parseInt(likes, 10) : Math.floor(Math.random() * 50) // Фейковые лайки для демо
  }

  const getIsLikedFromStorage = (postId) => {
    const isLiked = localStorage.getItem(`post_liked_${postId}`)
    return isLiked === 'true'
  }

  const saveLikesToStorage = (postId, likes) => {
    localStorage.setItem(`post_likes_${postId}`, likes.toString())
  }

  const saveIsLikedToStorage = (postId, isLiked) => {
    localStorage.setItem(`post_liked_${postId}`, isLiked.toString())
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
    currentPage,
    postsPerPage,
    searchQuery,
    selectedUserId,

    // Getters
    totalPosts,
    filteredPosts,
    paginatedPosts,
    totalPages,

    // Actions
    fetchAllPosts,
    fetchPostById,
    createPost,
    toggleLike,
    setSearchQuery,
    setUserFilter,
    clearFilters,
    setPage,
    nextPage,
    prevPage,
    clearCurrentPost,
    clearError,
  }
})
