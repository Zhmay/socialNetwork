<script setup>
import { useRouter } from 'vue-router'
import { useLikes } from '@/composables/useLikes.js'
import { useComments } from '@/composables/useComments'
import { usePostsStore } from '@/stores/posts.js'
import SvgIcon from '@/components/common/SvgIcon.vue'
import HighlightedText from '@/components/common/HighlightedText.vue'
import userItem from '@/components/common/userItem.vue'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
  hideAuthor: {
    type: Boolean,
    default: false,
  },
})

// Emits
const emit = defineEmits(['post-updated'])

// Composables
const router = useRouter()
const { togglePostLike } = useLikes()
const postsStore = usePostsStore()
const { commentsCount } = useComments(props.post.id)

// Методы
const handleLike = () => {
  const updatedPost = togglePostLike(props.post)

  // Обновляем пост в store
  postsStore.updatePost(updatedPost)

  // Уведомляем родительский компонент
  emit('post-updated', updatedPost)
}

const goToPostDetail = () => {
  // Получаем текущий маршрут для сохранения контекста
  const currentRoute = router.currentRoute.value

  router.push({
    name: 'post-detail',
    params: { id: props.post.id },
    query: {
      ...currentRoute.query,
      from: currentRoute.name,
      page: props.currentPage, // Используем prop
    },
  })
}
</script>

<template>
  <div class="post" @click="goToPostDetail" :id="post.id">
    <div class="post__img">
      <img v-if="post.image" :src="post.image" alt="Post Image" />
      <SvgIcon v-else name="photo" size="80" />
    </div>
    <div class="post__body">
      <div class="post__title">
        <HighlightedText
          :text="post.title"
          :query="postsStore.searchQuery"
          tag="span"
          :case-sensitive="false"
          :whole-words="true"
        />
      </div>
      <div class="post__content">
        <HighlightedText
          :text="post.body"
          :query="postsStore.searchQuery"
          tag="p"
          :show-excerpt="!!postsStore.searchQuery"
          :max-length="200"
          :context-padding="40"
        />
      </div>
      <div class="post__footer" :class="{ 'post__footer--no-author': hideAuthor }">
        <userItem v-if="!hideAuthor" :post="post" />

        <div class="post__footer-box">
          <div class="post__comments">
            <SvgIcon name="comments" size="22" />
            <span>{{ commentsCount }}</span>
          </div>
          <button
            @click.stop="handleLike"
            :class="['post__like-btn', { 'post__like-btn--liked': post.isLiked }]"
            :title="post.isLiked ? 'Like' : 'Dislike'"
          >
            <SvgIcon name="heart" size="20" />
            <span class="post__like-count">{{ post.likes }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.post {
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  margin-bottom: 16px;
  background-color: #fff;
  cursor: pointer;

  &:hover {
    .post__title {
      color: var(--accent-color);
    }
  }

  &__img {
    width: 100%;
    height: 200px;
    margin-bottom: 12px;
    border-radius: 10px 10px 0 0;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #e4e8ed;
    color: var(--placeholder-color);

    img {
      width: 100%;
      object-position: top center;
      object-fit: cover;
    }
  }

  &__body {
    padding: 0 16px 16px;
  }

  &__title {
    display: inline-flex;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: capitalize;
    transition: var(--transition);
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

    &--no-author {
      justify-content: flex-end;
    }

    &-box {
      display: flex;
      align-items: center;
      grid-gap: 15px;
    }
  }

  &__comments {
    display: flex;
    align-items: center;
    color: var(--placeholder-color);

    svg {
      margin-right: 5px;
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
