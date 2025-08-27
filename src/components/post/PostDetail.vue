<script setup>
import { useLikes } from '@/composables/useLikes.js'
import SvgIcon from '@/components/common/SvgIcon.vue'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true
  }
})

// Emits
const emit = defineEmits(['post-updated'])

// Composables
const { togglePostLike } = useLikes()

// Методы
const handleLike = () => {
  const updatedPost = togglePostLike(props.post)
  emit('post-updated', updatedPost)
}
</script>

<template>
  <article class="post-detail">
    <!-- Заголовок -->
    <header class="post-detail__header">
      <h1 class="post-detail__title">{{ post.title }}</h1>
      
      <!-- Мета информация -->
      <div class="post-detail__meta">
        <div class="post-detail__author">
          <div class="post-detail__author-avatar">
            <SvgIcon name="user" size="24" />
          </div>
          <span class="post-detail__author-name">Username {{ post.userId }}</span>
        </div>
        
        <div class="post-detail__stats">
          <span class="post-detail__post-id">Post #{{ post.id }}</span>
        </div>
      </div>
    </header>

    <!-- Контент поста -->
    <div class="post-detail__content">
      <p class="post-detail__text">{{ post.body }}</p>
    </div>

    <!-- Действия -->
    <footer class="post-detail__actions">
      <button 
        @click="handleLike"
        :class="['post-detail__like-btn', { 'post-detail__like-btn--liked': post.isLiked }]"
        :title="post.isLiked ? 'Unlike' : 'Like'"
      >
        <SvgIcon name="heart" size="20" />
        <span class="post-detail__like-count">{{ post.likes }}</span>
      </button>
    </footer>
  </article>
</template>

<style scoped>
</style>