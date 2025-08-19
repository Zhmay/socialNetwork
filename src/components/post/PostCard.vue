<script setup>
import { useLikes } from '@/composables/useLikes.js'
import { usePostsStore } from '@/stores/posts.js'
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
const postsStore = usePostsStore()

// Методы
const handleLike = () => {
  const updatedPost = togglePostLike(props.post)
  
  // Обновляем пост в store
  postsStore.updatePost(updatedPost)
  
  // Уведомляем родительский компонент
  emit('post-updated', updatedPost)
}

</script>

<template>
  <div class="post">
    <div class="post__title">{{ post.title }}</div>
    <div class="post__content">{{ post.body }}</div>
    <div class="post__footer">
      <div class="post__user">
        <div class="post__user-img">
          <SvgIcon name="user" size="20" />
        </div>
        <span>Username {{ post.userId }}</span>
      </div>
      <button 
        @click="handleLike"
        :class="['post__like-btn', { 'post__like-btn--liked': post.isLiked }]"
        :title="post.isLiked ? 'Like' : 'Dislike'"
      >
        <SvgIcon name="heart" size="20" />
        <span class="post__like-count">{{ post.likes }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 16px;
  margin-bottom: 16px;
  background-color: #fff;

  &__title {
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: capitalize;
  }

  &__content {
    margin-bottom: 12px;
    color: #333;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    grid-gap: 10px;
  }

  &__user {
    display: flex;
    align-items: center;
    grid-gap: 10px;

    &-img {
      width: 40px;
      height: 40px;
      background-color: var(--border-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-color);
    }

    span {
      font-weight: 500;
      color: var(--text-main-color);
    }
  }

  &__like-btn {
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    color: var(--text-main-color);

    svg {
      fill: none;
    }

    &--liked {
      color: var(--accent-color);

      svg {
        fill: var(--accent-color);
      }
    }

    &:hover svg {
      color: var(--accent-color);
    }

    .post__like-count {
      margin-left: 5px;
      font-weight: 500;
    }
  }
}
</style>