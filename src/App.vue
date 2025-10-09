<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import Navbar from './components/common/Navbar.vue'
import Sidebar from './components/common/Sidebar.vue'
import SvgSprite from './components/common/SvgSprite.vue'
import ToastContainer from '@/components/common/ToastContainer.vue'

const route = useRoute()
const contentRef = ref(null)

// Функция скролла вверх
const scrollToTop = () => {
  if (contentRef.value) {
    contentRef.value.scrollTo({
      top: 0,
      behavior: 'instant',
    })
  }

  window.scrollTo({
    top: 0,
    behavior: 'instant',
  })
}

// Для навигации между страницами (срабатывает transition)
const onBeforeLeave = () => {
  scrollToTop()
}

// Для пагинации (НЕ срабатывает transition, только query меняется)
watch(
  () => route.query,
  () => {
    scrollToTop()
  },
  { deep: true },
)

// Функция для определения типа перехода
const getTransitionName = (route) => {
  if (route.name === 'home') return 'slide-right'
  if (route.name === 'people') return 'slide-right'
  if (route.name === 'settings') return 'slide-right'
  if (route.name === 'post-detail') return 'slide-left'
  if (route.name === 'user-profile') return 'slide-left'
  return 'fade'
}
</script>

<template>
  <div class="wrapper">
    <Navbar />
    <main class="main">
      <div class="content" ref="contentRef">
        <router-view v-slot="{ Component, route }">
          <transition
            :name="getTransitionName(route)"
            mode="out-in"
            appear
            @before-leave="onBeforeLeave"
          >
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
