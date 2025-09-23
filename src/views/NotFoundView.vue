<script setup>
import { useRouter } from 'vue-router'
import ErrorState from '@/components/common/ErrorState.vue'

const router = useRouter()

const goHome = () => {
  router.push('/')
}

const goBack = () => {
  router.go(-1)
}

const mockNotFoundError = {
  type: 'not_found',
  message: "The page you're looking for doesn't exist.",
  retryable: false,
}
</script>

<template>
  <div class="not-found-page">
    <ErrorState
      :error="mockNotFoundError"
      title="404 - Page Not Found"
      description="The page you're looking for doesn't exist or has been moved."
      size="large"
      :show-retry="false"
    />

    <div class="not-found-actions">
      <button @click="goHome" class="btn">Go Home</button>
      <button @click="goBack" class="btn btn--border">Go Back</button>
    </div>
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.not-found-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .not-found-actions {
    flex-direction: column;
    width: 200px;
  }
}
</style>
