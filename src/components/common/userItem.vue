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
  <div v-if="!hideAuthor" class="user user--link" @click.stop="goToUserProfile">
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
