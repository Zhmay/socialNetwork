<script setup>
import Navbar from './components/common/Navbar.vue'
import Sidebar from './components/common/Sidebar.vue'
import SvgSprite from './components/common/SvgSprite.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'
</script>

<template>
  <div class="wrapper">
    <Navbar />
    <main class="main">
      <div class="content">
        <router-view />
      </div>
      <Sidebar />
    </main>
    <SvgSprite />
    <ToastContainer />
  </div>
</template>

<style scoped></style>
