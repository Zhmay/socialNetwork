<script setup>
import { computed } from 'vue'
import { useUsersStore } from '@/stores/users.js'
import SearchBox from '@/components/common/SearchBox.vue'
import UserList from '@/components/user/UserList.vue'

// Store
const usersStore = useUsersStore()

const retryLoadUsers = () => usersStore.fetchAllUsers()
const clearUsersError = () => usersStore.clearError()

// Computed для SearchBox
const searchResults = computed(() => ({
  total: usersStore.filteredUsers.length,
  query: usersStore.searchQuery,
  isSearching: usersStore.loading,
}))

// Methods
const handleSearch = (query) => {
  usersStore.setSearchQuery(query)
}
</script>

<template>
  <div class="people">
    <div class="people__header">
      <SearchBox
        :model-value="usersStore.searchQuery"
        placeholder="Search by name, username, email, company..."
        :debounce="400"
        :search-results="searchResults"
        @search="handleSearch"
      />
    </div>
    <UserList
      :error="usersStore.error"
      :retry-function="retryLoadUsers"
      :clear-error-function="clearUsersError"
      :loadingText="'Loading users...'"
    />
  </div>
</template>

<style scoped lang="scss">
.people {
  &__header {
    margin-bottom: 30px;
  }
}
</style>
