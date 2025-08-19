<script setup>
import { computed } from 'vue'
import { useLikes } from '@/composables/useLikes.js'
import { usePostsStore } from '@/stores/posts.js'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true
  },
  showFullContent: {
    type: Boolean,
    default: false
  },
  maxContentLength: {
    type: Number,
    default: 150
  }
})

// Emits
const emit = defineEmits(['post-updated'])

// Composables
const { togglePostLike } = useLikes()
const postsStore = usePostsStore()

// Методы
const handleLike = () => {
  const updatedPost = togglePostLike(props.post)
  
  // Обновляем пост в store
  postsStore.updatePost(updatedPost)
  
  // Уведомляем родительский компонент
  emit('post-updated', updatedPost)
}

// Вычисляемые свойства
const displayContent = computed(() => {
  if (props.showFullContent || props.post.body.length <= props.maxContentLength) {
    return props.post.body
  }
  return props.post.body.substring(0, props.maxContentLength) + '...'
})

const isContentTruncated = computed(() => {
  return !props.showFullContent && props.post.body.length > props.maxContentLength
})
</script>

<template>
  <article class="post-card">
    <header class="post-card__header">
      <h3 class="post-card__title">{{ post.title }}</h3>
      <button 
        @click="handleLike"
        :class="['post-card__like-btn', { 'post-card__like-btn--liked': post.isLiked }]"
        :title="post.isLiked ? 'Убрать лайк' : 'Поставить лайк'"
      >
        <span class="post-card__like-icon">❤️</span>
        <span class="post-card__like-count">{{ post.likes }}</span>
      </button>
    </header>

    <div class="post-card__content">
      <p class="post-card__body">{{ displayContent }}</p>
      
      <button 
        v-if="isContentTruncated" 
        class="post-card__read-more"
        @click="$emit('show-full', post.id)"
      >
        Читать далее
      </button>
    </div>

    <footer class="post-card__footer">
      <div class="post-card__meta">
        <span class="post-card__author">👤 User {{ post.userId }}</span>
        <span class="post-card__id">ID: {{ post.id }}</span>
      </div>
    </footer>
  </article>
</template>

<style scoped>
/* Стили можешь добавить сам */
</style>