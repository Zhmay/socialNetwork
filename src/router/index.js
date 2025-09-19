import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import PeopleView from '@/views/PeopleView.vue'
import SettingsView from '@/views/SettingsView.vue'
import PostDetailView from '@/views/PostDetailView.vue'
import UserProfileView from '@/views/UserProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/people',
      name: 'people',
      component: PeopleView,
    },
    {
      path: '/settings',
      name: 'settings',
      component: SettingsView,
    },
    {
      path: '/post/:id',
      name: 'post-detail',
      component: PostDetailView,
      props: (route) => ({ id: Number(route.params.id) }),
    },
    {
      path: '/user/:id',
      name: 'user-profile',
      component: UserProfileView,
      props: (route) => ({ id: Number(route.params.id) }),
    },
    // Fallback для несуществующих маршрутов
    {
      path: '/:pathMatch(.*)*',
      redirect: '/',
    },
  ],
})

export default router
