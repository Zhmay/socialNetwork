import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import PeopleView from '@/views/PeopleView.vue'
import MessagesView from '@/views/MessagesView.vue'
import SettingsView from '@/views/SettingsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/people',
      name: 'people', 
      component: PeopleView
    },
    {
      path: '/messages',
      name: 'messages',
      component: MessagesView
    },
    {
      path: '/settings', 
      name: 'settings',
      component: SettingsView
    },
    // Fallback для несуществующих маршрутов
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

export default router