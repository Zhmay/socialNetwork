// stores/users.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usersService } from '@/services/users.service.js'
import { useLikes } from '@/composables/useLikes.js'

export const useUsersStore = defineStore('users', () => {
  // === STATE ===
  const users = ref([])
  const currentUser = ref(null)
  const userPosts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const searchQuery = ref('')

  // === GETTERS ===
  const totalUsers = computed(() => users.value.length)

  const getUserById = computed(() => (id) => {
    return users.value.find((user) => user.id === parseInt(id))
  })

  // Улучшенный фильтр пользователей с поиском по имени, username, email, компании и городу
  const filteredUsers = computed(() => {
    if (!searchQuery.value.trim()) {
      return users.value
    }

    const query = searchQuery.value.toLowerCase().trim()

    return users.value.filter((user) => {
      // Поиск по имени (целые слова)
      const nameMatch = user.name ? user.name.toLowerCase().includes(query) : false

      // Поиск по username и email (подстроки)
      const usernameMatch = user.username ? user.username.toLowerCase().includes(query) : false

      const emailMatch = user.email ? user.email.toLowerCase().includes(query) : false

      // Поиск по компании
      const companyMatch = user.company?.name
        ? user.company.name.toLowerCase().includes(query)
        : false

      // Поиск по городу
      const cityMatch = user.address?.city ? user.address.city.toLowerCase().includes(query) : false

      return nameMatch || usernameMatch || emailMatch || companyMatch || cityMatch
    })
  })

  // === ACTIONS ===
  const fetchAllUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await usersService.getAllUsers()
      users.value = response.data
    } catch (err) {
      error.value = 'Ошибка загрузки пользователей: ' + err.message
      console.error('Error fetching users:', err)
    } finally {
      loading.value = false
    }
  }

  const fetchUserById = async (id) => {
    loading.value = true
    error.value = null

    try {
      const response = await usersService.getUserById(id)
      currentUser.value = response.data
      return currentUser.value
    } catch (err) {
      error.value = 'Ошибка загрузки пользователя: ' + err.message
      console.error('Error fetching user:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const clearCurrentUser = () => {
    currentUser.value = null
  }

  const clearError = () => {
    error.value = null
  }

  const fetchUserPosts = async (userId) => {
    loading.value = true
    error.value = null

    try {
      const response = await usersService.getUserPosts(userId)
      // Инициализируем лайки для каждого поста
      const { initializePostLikes } = useLikes()
      const postsWithLikes = response.data.map((post) => initializePostLikes(post))

      userPosts.value = postsWithLikes
      return postsWithLikes
    } catch (err) {
      error.value = 'Ошибка загрузки постов пользователя: ' + err.message
      console.error('Error fetching user posts:', err)
      return []
    } finally {
      loading.value = false
    }
  }

  const clearUserPosts = () => {
    userPosts.value = []
  }

  const setSearchQuery = (query) => {
    searchQuery.value = query
  }

  const clearSearch = () => {
    searchQuery.value = ''
  }

  return {
    // State
    users,
    currentUser,
    userPosts,
    loading,
    error,
    searchQuery,

    // Getters
    totalUsers,
    getUserById,
    filteredUsers,

    // Actions
    fetchAllUsers,
    fetchUserById,
    clearCurrentUser,
    clearError,
    fetchUserPosts,
    clearUserPosts,
    setSearchQuery,
    clearSearch,
  }
})
