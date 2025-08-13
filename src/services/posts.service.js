import api from './api.js'

export const postsService = {
  // Получить все посты
  getAllPosts() {
    return api.get('/posts')
  },

  // Получить пост по ID
  getPostById(id) {
    return api.get(`/posts/${id}`)
  },

  // Получить комментарии к посту
  getPostComments(postId) {
    return api.get(`/posts/${postId}/comments`)
  },

  // Создать пост (эмуляция)
  createPost(postData) {
    return api.post('/posts', postData)
  }
}