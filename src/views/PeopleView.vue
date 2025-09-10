<script setup>
import SearchBox from '@/components/common/SearchBox.vue'
import UserList from '@/components/user/UserList.vue'
</script>

<template>
  <div class="people">
    <SearchBox />
    <UserList :loadingText="'Loading users...'" />
  </div>
</template>

<style scoped></style>
