// stores/posts.js - ОБНОВЛЕННАЯ ВЕРСИЯ
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { postsService } from '@/services/posts.service.js'
import { useLikes } from '@/composables/useLikes.js'
import { useUser } from '@/composables/useUser.js' // НОВЫЙ ИМПОРТ

export const usePostsStore = defineStore('posts', () => {
  const { initializePostLikes } = useLikes()
  const { fetchUser } = useUser()

  // === STATE ===
  const posts = ref([])
  const currentPost = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const sortBy = ref('default') // 'default', 'popularity', 'alphabetical'

  // Фильтры (простые)
  const searchQuery = ref('')
  const selectedUserId = ref(null)

  // === GETTERS ===
  const totalPosts = computed(() => posts.value.length)

  // filteredPosts с поиском по авторам
  const filteredPosts = computed(() => {
    let filtered = posts.value

    // Фильтр по пользователю
    if (selectedUserId.value) {
      filtered = filtered.filter((post) => post.userId === selectedUserId.value)
    }

    // Поиск по тексту
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim()
      filtered = filtered.filter((post) => {
        const titleMatch = post.title
          ? post.title
              .toLowerCase()
              .split(/\s+/)
              .some((word) => word === query)
          : false
        const bodyMatch = post.body
          ? post.body
              .toLowerCase()
              .split(/\s+/)
              .some((word) => word === query)
          : false

        const authorNameMatch = post.author?.name
          ? post.author.name.toLowerCase().includes(query)
          : false
        const authorUsernameMatch = post.author?.username
          ? post.author.username.toLowerCase().includes(query)
          : false
        const authorEmailMatch = post.author?.email
          ? post.author.email.toLowerCase().includes(query)
          : false

        return titleMatch || bodyMatch || authorNameMatch || authorUsernameMatch || authorEmailMatch
      })
    }

    // Сортировка
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy.value) {
        case 'popularity':
          return (b.likes || 0) - (a.likes || 0)
        case 'alphabetical':
          return (a.title || '').localeCompare(b.title || '')
        case 'default':
        default:
          return a.id - b.id
      }
    })

    return sorted
  })

  // === ACTIONS ===

  // fetchAllPosts с предзагрузкой авторов
  const fetchAllPosts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await postsService.getAllPosts()
      const rawPosts = response.data.map((post) => initializePostLikes(post))

      // Получаем уникальных авторов и предзагружаем их данные
      const uniqueUserIds = [...new Set(rawPosts.map((post) => post.userId))]

      // Загружаем всех авторов параллельно
      const authorsPromises = uniqueUserIds.map((userId) => fetchUser(userId))
      const authors = await Promise.all(authorsPromises)

      // Создаем мапу авторов для быстрого доступа
      const authorsMap = new Map()
      authors.forEach((author, index) => {
        if (author) {
          authorsMap.set(uniqueUserIds[index], author)
        }
      })

      // Обогащаем посты данными авторов
      posts.value = rawPosts.map((post) => ({
        ...post,
        author: authorsMap.get(post.userId) || null,
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
      const post = initializePostLikes(response.data)

      // Загружаем данные автора для отдельного поста
      const author = await fetchUser(post.userId)
      currentPost.value = {
        ...post,
        author: author || null,
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
      const newPost = initializePostLikes({
        ...response.data,
        likes: 0,
        isLiked: false,
      })

      // Добавляем данные автора для нового поста
      const author = await fetchUser(newPost.userId)
      const enrichedPost = {
        ...newPost,
        author: author || null,
      }

      // Добавляем в начало списка (оптимистичное обновление)
      posts.value.unshift(enrichedPost)
      return enrichedPost
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
    const index = posts.value.findIndex((post) => post.id === updatedPost.id)
    if (index !== -1) {
      posts.value[index] = { ...posts.value[index], ...updatedPost }
    }

    // Обновляем текущий пост, если он открыт
    if (currentPost.value && currentPost.value.id === updatedPost.id) {
      currentPost.value = { ...currentPost.value, ...updatedPost }
    }
  }

  const setSortBy = (sortType) => {
    sortBy.value = sortType
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
    // sortBy.value = 'default' // add if needed
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
    sortBy,

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
    setSortBy,
    clearFilters,
    clearCurrentPost,
    clearError,
  }
})
