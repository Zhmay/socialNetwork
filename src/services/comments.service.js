import api from './api.js'

export const commentsService = {
  // Получить комментарии к посту
  getCommentsByPostId(postId) {
    return api.get(`/posts/${postId}/comments`)
  },

  // Создать комментарий (эмуляция)
  createComment(commentData) {
    return api.post('/comments', commentData)
  },
}
