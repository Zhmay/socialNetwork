<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { usePostsStore } from '@/stores/posts.js'
import HighlightedText from '@/components/common/HighlightedText.vue'

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
const router = useRouter()
const postsStore = usePostsStore()

// Computed
const postAuthor = computed(() => {
  // Используем данные автора из поста (предзагруженные в store)
  return props.post.author
})

// Methods
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
  <div v-if="!hideAuthor && postAuthor" class="user user--link" @click.stop="goToUserProfile">
    <div class="user-img">
      <template v-if="postAuthor?.avatar">
        <img :src="postAuthor?.avatar" :alt="postAuthor?.name" />
      </template>
      <template v-else>
        <div class="user-initials">{{ postAuthor?.name?.charAt(0) }}</div>
      </template>
    </div>

    <!-- НОВОЕ: Подсветка имени автора при поиске -->
    <HighlightedText
      :text="postAuthor?.name || `User ${post.userId}`"
      :query="postsStore.searchQuery"
      tag="span"
      :case-sensitive="false"
    />
  </div>

  <!-- Fallback если автор не загрузился -->
  <div v-else-if="!hideAuthor" class="user">
    <div class="user-img">
      <div class="user-initials">?</div>
    </div>
    <span>User {{ post.userId }}</span>
  </div>
</template>
