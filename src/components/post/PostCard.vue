<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useLikes } from '@/composables/useLikes.js'
import { usePostsStore } from '@/stores/posts.js'
import SvgIcon from '@/components/common/SvgIcon.vue'
import HighlightedText from '@/components/common/HighlightedText.vue'
import { useUser } from '@/composables/useUser.js'

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
const { fetchUser, getUserFromCache } = useUser()

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

const postAuthor = ref(null)
// Загружаем автора при монтировании (только если не скрыт)
onMounted(async () => {
  if (!props.hideAuthor) {
    // Сначала проверяем кэш
    const cachedUser = getUserFromCache(props.post.userId)
    if (cachedUser) {
      postAuthor.value = cachedUser
    } else {
      // Загружаем из API
      const user = await fetchUser(props.post.userId)
      postAuthor.value = user
    }
  }
})

const goToUserProfile = () => {
  if (postAuthor.value) {
    router.push({
      name: 'user-profile',
      params: { id: postAuthor.value.id },
    })
  }
}
</script>

<template>
  <div class="post">
    <div class="post__title" @click="goToPostDetail">
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
      <div v-if="!hideAuthor" class="post__user" @click="goToUserProfile">
        <div class="post__user-img">
          <template v-if="postAuthor?.avatar">
            <img :src="postAuthor?.avatar" :alt="postAuthor?.name" />
          </template>
          <template v-else>
            <div class="post__user-initials">{{ postAuthor?.name.charAt(0) }}</div>
          </template>
        </div>
        <span>{{ postAuthor?.name || `User ${post.userId}` }}</span>
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
    display: inline-flex;
    font-weight: 700;
    margin-bottom: 8px;
    text-transform: capitalize;
    cursor: pointer;
    transition: var(--transition);

    &:hover {
      color: var(--accent-color);
    }
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
  }

  &__user {
    display: flex;
    align-items: center;
    grid-gap: 10px;
    cursor: pointer;

    &-img {
      width: 40px;
      height: 40px;
      background-color: var(--border-color);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent-color);

      div {
        font-weight: 600;
        color: var(--accent-color);
      }
    }

    span {
      font-weight: 500;
      color: var(--text-main-color);
    }

    &:hover span {
      color: var(--accent-color);
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
