<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users.js'
import UserDetail from '@/components/user/UserDetail.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import SvgIcon from '@/components/common/SvgIcon.vue'
import PostCard from '@/components/post/PostCard.vue'

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const router = useRouter()
const usersStore = useUsersStore()

onMounted(async () => {
  await usersStore.fetchUserById(props.id)
  await usersStore.fetchUserPosts(props.id)
})

onUnmounted(() => {
  usersStore.clearCurrentUser()
  usersStore.clearUserPosts()
})

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="user-datails-view">
    <div class="user-datails-view__head">
      <button @click="goBack" class="user-datails-view__back-btn">
        <div class="icon">
          <SvgIcon name="arrow-small" size="14" />
        </div>
        <span>Back</span>
      </button>
    </div>
    <!-- Loading состояние -->
    <LoadingSpinner v-if="usersStore.loading" size="lg" center />

    <!-- Error состояние -->
    <div v-else-if="usersStore.error" class="error-message">
      <p><strong>Ошибка:</strong> {{ usersStore.error }}</p>
    </div>

    <!-- Пользователь найден -->
    <template v-else-if="usersStore.currentUser">
      <UserDetail :user="usersStore.currentUser" />

      <div class="user-posts-section">
        <h3 class="user-posts-section__title">Users posts ({{ usersStore.userPosts.length }})</h3>

        <div v-if="usersStore.userPosts.length > 0" class="user-posts-list">
          <PostCard
            v-for="post in usersStore.userPosts"
            :key="post.id"
            :post="post"
            :hide-author="true"
          />
        </div>

        <div v-else class="no-posts-message">
          <p>User has no posts</p>
        </div>
      </div>
    </template>

    <!-- Если пользователь не найден -->
    <div v-else class="error-message">
      <p>Пользователь не найден</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.user-datails-view {
  &__head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 18px;
    border-bottom: 1px solid var(--border-color);
  }

  &__back-btn {
    display: flex;
    align-items: center;
    grid-gap: 10px;
    transition: var(--transition);
    cursor: pointer;
    font-weight: 500;
    font-size: 16px;

    &:hover {
      color: var(--accent-color);

      .icon {
        background-color: rgba(#fff, 1);
      }
    }

    .icon {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: rgba(#fff, 0.8);
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: var(--box-shadow);
      transition: var(--transition);

      svg {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
