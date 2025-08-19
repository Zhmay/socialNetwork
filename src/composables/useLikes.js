export function useLikes() {
  // Получение лайков из localStorage
  const getLikesFromStorage = (postId) => {
    const likes = localStorage.getItem(`post_likes_${postId}`)
    return likes ? parseInt(likes, 10) : Math.floor(Math.random() * 50) // Фейковые лайки для демо
  }

  // Проверка, лайкнут ли пост
  const getIsLikedFromStorage = (postId) => {
    const isLiked = localStorage.getItem(`post_liked_${postId}`)
    return isLiked === 'true'
  }

  // Сохранение лайков
  const saveLikesToStorage = (postId, likes) => {
    localStorage.setItem(`post_likes_${postId}`, likes.toString())
  }

  // Сохранение статуса лайка
  const saveIsLikedToStorage = (postId, isLiked) => {
    localStorage.setItem(`post_liked_${postId}`, isLiked.toString())
  }

  // Переключение лайка для отдельного поста
  const togglePostLike = (post) => {
    if (post.isLiked) {
      post.likes = Math.max(0, post.likes - 1)
      post.isLiked = false
    } else {
      post.likes += 1
      post.isLiked = true
    }

    // Сохраняем в localStorage
    saveLikesToStorage(post.id, post.likes)
    saveIsLikedToStorage(post.id, post.isLiked)

    return post
  }

  // Инициализация лайков для поста
  const initializePostLikes = (post) => {
    return {
      ...post,
      likes: getLikesFromStorage(post.id),
      isLiked: getIsLikedFromStorage(post.id)
    }
  }

  return {
    getLikesFromStorage,
    getIsLikedFromStorage,
    saveLikesToStorage,
    saveIsLikedToStorage,
    togglePostLike,
    initializePostLikes
  }
}