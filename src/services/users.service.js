import api from './api'

export const usersService = {
  // Получить всех пользователей
  getAllUsers() {
    return api.get('/users')
  },

  // Получить пользователя по ID
  getUserById(id) {
    return api.get(`/users/${id}`)
  },

  // Получить посты пользователя
  getUserPosts(id) {
    return api.get(`/users/${id}/posts`)
  },
}
