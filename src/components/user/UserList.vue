<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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
const router = useRouter()
const route = useRoute()
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
  <LoadingSpinner v-if="usersStore.loading" :text="loadingText" />

  <div v-else-if="usersStore.users.length > 0" class="users-list">
    <UserCard v-for="user in usersStore.users" :key="user.id" :user="user" />
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
</style>
