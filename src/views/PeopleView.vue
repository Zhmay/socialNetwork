<script setup>
import SearchBox from '@/components/common/SearchBox.vue'
import UserList from '@/components/user/UserList.vue'
</script>

<template>
  <div class="people">
    <SearchBox />
    <!-- Здесь позже будет список пользователей -->
    <UserList />
  </div>
</template>

<style scoped></style>
