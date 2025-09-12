// stores/users.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { usersService } from '@/services/users.service.js'

export const useUsersStore = defineStore('users', () => {
  // === STATE ===
  const users = ref([])
  const currentUser = ref(null)
  const userPosts = ref([])
  const loading = ref(false)
  const error = ref(null)

  // === GETTERS ===
  const totalUsers = computed(() => users.value.length)

  const getUserById = computed(() => (id) => {
    return users.value.find((user) => user.id === parseInt(id))
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
      userPosts.value = response.data
      return response.data
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

  return {
    // State
    users,
    currentUser,
    userPosts,
    loading,
    error,

    // Getters
    totalUsers,
    getUserById,

    // Actions
    fetchAllUsers,
    fetchUserById,
    clearCurrentUser,
    clearError,
    fetchUserPosts,
    clearUserPosts,
  }
})
