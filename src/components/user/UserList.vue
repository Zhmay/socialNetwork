<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users.js'
import { useErrorHandling } from '@/composables/useErrorHandling'
import UserSkeleton from '@/components/skeleton/UserSkeleton.vue'
import UserCard from '@/components/user/UserCard.vue'
import ErrorState from '@/components/common/ErrorState.vue'

// Props
const props = defineProps({
  loadingText: {
    type: String,
    default: 'Loading...',
  },
  usersPerPage: {
    type: Number,
    default: 10,
  },
  error: {
    type: [Object, String, null],
    default: null,
  },
  retryFunction: {
    type: Function,
    required: true,
  },
  clearErrorFunction: {
    type: Function,
    default: null,
  },
})

// Composables
const usersStore = useUsersStore()
const { simpleRetry } = useErrorHandling()

// Methods
const handleReload = async () => {
  await simpleRetry(props.retryFunction, props.clearErrorFunction)
  emit('reload')
}

// Lifecycle
onMounted(async () => {
  await usersStore.fetchAllUsers()
})
</script>
<template>
  <!-- Отображение ошибки -->
  <ErrorState v-if="usersStore.error" :error="usersStore.error" @retry="handleReload" />

  <!-- Состояния загрузки и данных -->
  <div v-if="usersStore.loading" class="users-list">
    <UserSkeleton :count="props.usersPerPage" />
  </div>

  <div v-else-if="usersStore.filteredUsers.length > 0">
    <TransitionGroup name="item-fade" tag="div" class="users-list">
      <UserCard v-for="user in usersStore.filteredUsers" :key="user.id" :user="user" />
    </TransitionGroup>
  </div>
  <div v-else-if="usersStore.searchQuery" class="no-results">
    No users found for "{{ usersStore.searchQuery }}"
  </div>
</template>
<style scoped lang="scss">
.users-list {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 20px;

  @media (max-width: 1365px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 1280px) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.no-results {
  text-align: center;
  padding: 40px 20px;
  color: #666;
}
</style>
