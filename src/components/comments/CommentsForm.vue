<script setup>
import { ref, computed } from 'vue'
import { useComments } from '@/composables/useComments'

// Props
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

// Composables
const { addComment, loading, error } = useComments(props.postId)

// Form state
const name = ref('')
const email = ref('')
const comment = ref('')
const isSubmitting = ref(false)
const submitError = ref(null)
const showValidationErrors = ref(false)

// Computed
const isFormValid = computed(() => {
  return (
    name.value.trim() && email.value.trim() && comment.value.trim() && isValidEmail(email.value)
  )
})

const canSubmit = computed(() => {
  return isFormValid.value && !isSubmitting.value && !loading.value
})

// Methods
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const resetForm = () => {
  name.value = ''
  email.value = ''
  comment.value = ''
  submitError.value = null
}

const handleSubmit = async () => {
  showValidationErrors.value = true

  if (!isFormValid.value) {
    return // Показываем ошибки, но не отправляем
  }

  if (!canSubmit.value) return

  isSubmitting.value = true
  submitError.value = null

  try {
    const commentData = {
      name: name.value.trim(),
      email: email.value.trim(),
      body: comment.value.trim(),
    }

    const result = await addComment(commentData)

    if (result) {
      resetForm()
      showValidationErrors.value = false
      // Можно добавить уведомление об успехе
    } else {
      submitError.value = 'Не удалось отправить комментарий'
    }
  } catch (err) {
    submitError.value = 'Произошла ошибка при отправке'
    console.error('Comment submit error:', err)
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <form class="comments-form" @submit.prevent="handleSubmit">
    <!-- Отображение ошибок -->
    <div v-if="submitError || error" class="error-message">
      {{ submitError || error }}
    </div>
    <div class="comments-form__row">
      <div class="comments-form__inputbox">
        <label for="name" class="comments-form__label">Name</label>
        <input
          id="name"
          type="text"
          name="name"
          placeholder="Enter your name"
          v-model="name"
          :disabled="isSubmitting || loading"
        />
        <div v-if="showValidationErrors && !name.trim()" class="field-error">Name is required</div>
      </div>
      <div class="comments-form__inputbox">
        <label for="email" class="comments-form__label">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          v-model="email"
          :disabled="isSubmitting || loading"
        />
        <div v-if="showValidationErrors && !email.trim()" class="field-error">
          Email is required
        </div>
        <div v-else-if="showValidationErrors && email && !isValidEmail(email)" class="field-error">
          Please enter a valid email address
        </div>
      </div>
    </div>
    <div class="comments-form__inputbox">
      <label for="comment" class="comments-form__label">Comment</label>
      <textarea
        id="comment"
        name="comment"
        placeholder="Enter your comment"
        v-model="comment"
        :disabled="isSubmitting || loading"
      ></textarea>
      <div v-if="showValidationErrors && !comment.trim()" class="field-error">
        Comment is required
      </div>
    </div>
    <div class="comments-form__ctrl">
      <button
        type="submit"
        class="btn comments-form__btn"
        :disabled="isSubmitting"
        :class="{ loading: isSubmitting }"
      >
        {{ isSubmitting ? 'Sending...' : 'Send Comment' }}
      </button>
    </div>
  </form>
</template>

<style scoped lang="scss">
.comments-form {
  margin-bottom: 30px;

  &__row {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(2, 1fr);
  }

  &__inputbox {
    position: relative;
    padding-bottom: 20px;
  }

  &__label {
    display: block;
    margin-bottom: 8px;
    font-weight: 600;
  }

  &__ctrl {
    text-align: right;
  }
}
</style>
