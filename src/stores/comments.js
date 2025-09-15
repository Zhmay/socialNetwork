// stores/comments.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { commentsService } from '@/services/comments.service.js'

export const useCommentsStore = defineStore('comments', () => {
  // === STATE ===
  const comments = ref(new Map())
  const loading = ref(false)
  const error = ref(null)

  // === GETTERS ===
  const getCommentsByPostId = computed(() => (postId) => {
    return comments.value.get(postId) || []
  })

  const totalComments = computed(() => {
    let total = 0
    comments.value.forEach((commentList) => {
      total += commentList.length
    })
    return total
  })

  // === ACTIONS ===
  const fetchCommentsByPostId = async (postId) => {
    loading.value = true
    error.value = null

    try {
      const response = await commentsService.getCommentsByPostId(postId)
      comments.value.set(postId, response.data)
    } catch (err) {
      error.value = 'Ошибка загрузки комментариев: ' + err.message
      console.error('Error fetching comments:', err)
    } finally {
      loading.value = false
    }
  }

  const createComment = async (commentData) => {
    loading.value = true
    error.value = null

    try {
      const response = await commentsService.createComment(commentData)
      const postId = commentData.postId
      if (!comments.value.has(postId)) {
        comments.value.set(postId, [])
      }
      comments.value.get(postId).push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Ошибка создания комментария: ' + err.message
      console.error('Error creating comment:', err)
      return null
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // STATE
    comments,
    loading,
    error,
    // GETTERS
    getCommentsByPostId,
    totalComments,
    // ACTIONS
    fetchCommentsByPostId,
    createComment,
    clearError,
  }
})
