<script setup>
// Здесь позже будет логика для загрузки постов
</script>

<template>
  <div class="home">
    <h1>Главная страница</h1>
    <p>Добро пожаловать в ZHNetwork!</p>
    
    <!-- Здесь позже будет лента постов -->
    <div class="posts-placeholder">
      <div class="post-card">
        <h3>Пример поста 1</h3>
        <p>Это примерный пост. Скоро здесь будут реальные данные из API.</p>
        <small>👤 Автор • ⏰ 2 часа назад</small>
      </div>
      
      <div class="post-card">
        <h3>Пример поста 2</h3>
        <p>Еще один тестовый пост для демонстрации.</p>
        <small>👤 Другой автор • ⏰ 5 часов назад</small>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home {
  padding: var(--spacing-lg);
}

.posts-placeholder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.post-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.post-card h3 {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-primary);
}

.post-card p {
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--text-secondary);
}

.post-card small {
  color: var(--text-muted);
}
</style>