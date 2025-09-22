<script setup>
import { useRoute } from 'vue-router'
import Navbar from './components/common/Navbar.vue'
import Sidebar from './components/common/Sidebar.vue'
import SvgSprite from './components/common/SvgSprite.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const route = useRoute()

// Функция для определения типа перехода
const getTransitionName = (route) => {
  if (route.name === 'PostDetail') return 'slide-up'
  if (route.name === 'UserProfile') return 'slide-left'
  if (route.name === 'Settings') return 'slide-right'
  return 'fade'
}
</script>

<template>
  <div class="wrapper">
    <Navbar />
    <main class="main">
      <div class="content">
        <router-view v-slot="{ Component, route }">
          <transition :name="getTransitionName(route)" mode="out-in" appear>
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </div>
      <Sidebar />
    </main>
    <SvgSprite />
    <ToastContainer />
  </div>
</template>

<style scoped></style>
