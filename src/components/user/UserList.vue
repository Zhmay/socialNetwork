<script setup>
import { onMounted } from 'vue'
import { useUsersStore } from '@/stores/users.js'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import UserCard from '@/components/user/UserCard.vue'

// Props
const props = defineProps({
  loadingText: {
    type: String,
    default: 'Loading...',
  },
})

// Composables
const usersStore = useUsersStore()

// Lifecycle
onMounted(async () => {
  await usersStore.fetchAllUsers()
})
</script>
<template>
  <!-- Отображение ошибки -->
  <div v-if="usersStore.error" class="error-message">
    <p><strong>Ошибка:</strong> {{ error }}</p>
  </div>

  <!-- Состояния загрузки и данных -->
  <LoadingSpinner v-if="usersStore.loading" center size="lg" show-text :text="props.loadingText" />

  <div v-else-if="usersStore.filteredUsers.length > 0" class="users-list">
    <UserCard v-for="user in usersStore.filteredUsers" :key="user.id" :user="user" />
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
