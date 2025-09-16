// src/composables/useComments.js
import { computed } from 'vue'
import { useCommentsStore } from '@/stores/comments.js'

export function useComments(postId) {
  const store = useCommentsStore()

  // Реактивные данные
  const comments = computed(() => store.getCommentsByPostId(postId))
  const loading = computed(() => store.loading)
  const error = computed(() => store.error)

  // Производные значения
  const commentsCount = computed(() => {
    loadCommentsIfNeeded() // Загружаем при первом обращении
    return comments.value.length
  })
  const hasComments = computed(() => commentsCount.value > 0)

  // Методы
  const loadComments = () => store.fetchCommentsByPostId(postId)
  const addComment = (commentData) => store.createComment({ ...commentData, postId })
  const loadCommentsIfNeeded = async () => {
    if (!store.comments.has(postId)) {
      await loadComments()
    }
  }

  return {
    comments,
    loading,
    error,
    commentsCount,
    hasComments,
    loadComments,
    addComment,
  }
}
