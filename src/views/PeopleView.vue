<script setup>
// Здесь позже будет логика для загрузки пользователей
</script>

<template>
  <div class="people">
    <h1>Пользователи</h1>
    <p>Все пользователи ZHNetwork</p>
    
    <!-- Здесь позже будет список пользователей -->
    <div class="users-placeholder">
      <div class="user-card">
        <div class="user-avatar">👤</div>
        <div class="user-info">
          <h3>Иван Петров</h3>
          <p>@ivan_petrov</p>
          <small>10 постов • 25 подписчиков</small>
        </div>
      </div>
      
      <div class="user-card">
        <div class="user-avatar">👩</div>
        <div class="user-info">
          <h3>Мария Сидорова</h3>
          <p>@maria_s</p>
          <small>7 постов • 18 подписчиков</small>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.people {
  padding: var(--spacing-lg);
}

.users-placeholder {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.user-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius);
  padding: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.user-avatar {
  width: 60px;
  height: 60px;
  background: var(--bg-secondary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.user-info h3 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
}

.user-info p {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-secondary);
}

.user-info small {
  color: var(--text-muted);
}
</style>