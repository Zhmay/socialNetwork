<script setup>
import { ref } from 'vue'
import SvgIcon from './SvgIcon.vue'
import PostCreateModal from '@/components/post/PostCreateModal.vue'
import WeatherWidget from '@/components/common/WeatherWidget.vue'

// Состояние модального окна
const isCreateModalOpen = ref(false)

// Методы для работы с модальным окном
const openCreateModal = () => {
  isCreateModalOpen.value = true
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
}

const handlePostCreated = (newPost) => {
  console.log('Новый пост создан:', newPost)
  // Здесь можно добавить дополнительную логику:
  // - показать уведомление об успешном создании
  // - обновить счетчики
  // - перенаправить на созданный пост
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar__top">
      <button class="add-post" @click="openCreateModal" aria-label="Создать новый пост">
        <SvgIcon name="plus" size="20" />
      </button>
      <div class="sidebar__user">
        <div class="sidebar__user-img"></div>
        <span class="sidebar__user-name">Bogdan</span>
      </div>
    </div>

    <!-- Виджет погоды -->
    <WeatherWidget />

    <!-- Модальное окно создания поста -->
    <PostCreateModal
      :isOpen="isCreateModalOpen"
      @close="closeCreateModal"
      @created="handlePostCreated"
    />
  </aside>
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  width: 340px;
  flex-shrink: 0;
  background-color: #fff;
  height: 100%;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

  &__top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 1px solid var(--border-color);
    margin-bottom: 20px;
  }

  .add-post {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--accent-color);
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    color: #fff;
    cursor: pointer;
  }

  &__user {
    display: flex;
    align-items: center;
    gap: 10px;

    &-img {
      width: 40px;
      height: 40px;
      background-color: var(--border-color);
      border: 2px solid var(--accent-color);
      border-radius: 50%;
    }

    &-name {
      font-weight: 700;
      color: var(--text-main-color);
    }
  }
}
</style>
