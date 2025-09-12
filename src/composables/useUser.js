import { ref, computed } from 'vue'
import { usersService } from '@/services/users.service.js'

// Глобальный кэш пользователей
const usersCache = ref(new Map())

export function useUser() {
  const fetchUser = async (userId) => {
    // Проверяем кэш
    if (usersCache.value.has(userId)) {
      return usersCache.value.get(userId)
    }

    try {
      const response = await usersService.getUserById(userId)
      const user = response.data

      // Сохраняем в кэш
      usersCache.value.set(userId, user)
      return user
    } catch (error) {
      console.error('Error fetching user:', error)
      return null
    }
  }

  const getUserFromCache = (userId) => {
    return usersCache.value.get(userId) || null
  }

  return {
    fetchUser,
    getUserFromCache,
    usersCache: computed(() => usersCache.value),
  }
}
