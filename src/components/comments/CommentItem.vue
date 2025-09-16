<script setup>
const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="comment">
    <p class="comment__text">{{ comment.body }}</p>
    <div class="comment__meta">
      <div class="user">
        <div class="user-img">
          <template v-if="comment?.avatar">
            <img :src="comment?.avatar" :alt="comment.email" />
          </template>
          <template v-else>
            <div class="user-initials">{{ comment.email.charAt(0) }}</div>
          </template>
        </div>
        <span>{{ comment.email }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.comment {
  &:not(:last-child) {
    padding-bottom: 15px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 30px;
  }

  &__text {
    background-color: antiquewhite;
    padding: 10px;
    border-radius: var(--border-radius);
    margin-bottom: 10px;
  }
}
</style>
