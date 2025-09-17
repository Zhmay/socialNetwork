<script setup>
import { ref, reactive, watch } from 'vue'
import { useComments } from '@/composables/useComments'
import { commentValidationSchema } from '@/composables/commentValidationSchema.js'
import { useValidation } from '@/composables/useValidation.js'

// Props
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
})

// Form state
const formData = reactive({
  name: '',
  email: '',
  comment: '',
})

// Composables
const { addComment, loading, error } = useComments(props.postId)
const { errors, validateAll, clearErrors, isFormValid, validateField, hasTriedSubmit } =
  useValidation(commentValidationSchema, formData)
const isSubmitting = ref(false)
const submitError = ref(null)

// Watchers
watch(
  () => formData.name,
  () => {
    if (hasTriedSubmit.value) {
      validateField('name')
    }
  },
)

watch(
  () => formData.email,
  () => {
    // Валидируем email в реальном времени если он не пустой
    if (formData.email.trim() || hasTriedSubmit.value) {
      validateField('email')
    }
  },
)

watch(
  () => formData.comment,
  () => {
    if (hasTriedSubmit.value) {
      validateField('comment')
    }
  },
)

// Methods

const handleSubmit = async () => {
  if (!validateAll()) {
    return // Показываем ошибки, но не отправляем
  }

  isSubmitting.value = true
  submitError.value = null

  try {
    const commentData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      body: formData.comment.trim(),
    }

    const result = await addComment(commentData)

    if (result) {
      formData.name = ''
      formData.email = ''
      formData.comment = ''
      clearErrors()
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
  <form class="comments-form" @submit.prevent="handleSubmit" novalidate>
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
          v-model="formData.name"
          :disabled="isSubmitting || loading"
        />
        <div v-if="errors.name" class="field-error">{{ errors.name }}</div>
      </div>
      <div class="comments-form__inputbox">
        <label for="email" class="comments-form__label">Email</label>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Enter your email"
          v-model="formData.email"
          :disabled="isSubmitting || loading"
        />
        <div v-if="errors.email" class="field-error">{{ errors.email }}</div>
      </div>
    </div>
    <div class="comments-form__inputbox">
      <label for="comment" class="comments-form__label">Comment</label>
      <textarea
        id="comment"
        name="comment"
        placeholder="Enter your comment"
        v-model="formData.comment"
        :disabled="isSubmitting || loading"
      ></textarea>
      <div v-if="errors.comment" class="field-error">{{ errors.comment }}</div>
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
