<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUser } from '@/composables/useUser.js'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  hideAuthor: {
    type: Boolean,
    default: false,
  },
})

// Composables
const { fetchUser, getUserFromCache } = useUser()

// Data
const router = useRouter()
const postAuthor = ref(null)

// Metods
const goToUserProfile = () => {
  if (postAuthor.value) {
    router.push({
      name: 'user-profile',
      params: { id: postAuthor.value.id },
    })
  }
}

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
</script>

<template>
  <div v-if="!hideAuthor" class="user" @click.stop="goToUserProfile">
    <div class="user-img">
      <template v-if="postAuthor?.avatar">
        <img :src="postAuthor?.avatar" :alt="postAuthor?.name" />
      </template>
      <template v-else>
        <div class="user-initials">{{ postAuthor?.name.charAt(0) }}</div>
      </template>
    </div>
    <span>{{ postAuthor?.name || `User ${post.userId}` }}</span>
  </div>
</template>

<style lang="scss" scoped>
.user {
  display: inline-flex;
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
    transition: var(--transition);
  }

  &:hover span {
    color: var(--accent-color);
  }
}
</style>
