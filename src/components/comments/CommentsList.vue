<script setup>
import { useComments } from '@/composables/useComments'
import CommentItem from '@/components/comments/CommentItem.vue'
import CommentsForm from '@/components/comments/CommentsForm.vue'

// Props
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

// Composables
const { comments, commentsCount, error } = useComments(props.postId)
</script>

<template>
  <!-- Отображение ошибки -->
  <div v-if="error" class="error-message">
    <p><strong>Ошибка:</strong> {{ error }}</p>
  </div>

  <div>
    <h3>Comments ({{ commentsCount }})</h3>
    <CommentsForm :postId="postId" />
    <p v-if="comments.length === 0">Комментариев нет.</p>
    <div v-else class="comments-list">
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>
  </div>
</template>
<style scoped lang="scss">
.comments-list {
  display: flex;
  flex-direction: column-reverse;
}
</style>
