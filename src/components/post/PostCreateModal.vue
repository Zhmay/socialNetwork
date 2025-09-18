<script setup>
import { ref, computed } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useValidation } from '@/composables/useValidation'
import { postValidationSchema } from '@/composables/postValidationSchema'
import SvgIcon from '@/components/common/SvgIcon.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'created'])

const postsStore = usePostsStore()
const isSubmitting = ref(false)

// Форма данных
const formData = ref({
  title: '',
  body: '', // используем 'body' для консистентности с API
  image: null,
})

// Валидация
const { errors, isValid, validateField, validateAll } = useValidation(
  postValidationSchema,
  formData.value,
)

// Для работы с изображениями
const imagePreview = ref(null)
const fileInput = ref(null)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Проверяем тип файла
  if (!file.type.startsWith('image/')) {
    alert('Пожалуйста, выберите изображение')
    return
  }

  // Проверяем размер (максимум 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert('Размер файла не должен превышать 5MB')
    return
  }

  formData.value.image = file

  // Создаем превью
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)
}

const removeImage = () => {
  formData.value.image = null
  imagePreview.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const resetForm = () => {
  formData.value = {
    title: '',
    body: '',
    image: null,
  }
  imagePreview.value = null
  errors.value = {}
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const closeModal = () => {
  resetForm()
  emit('close')
}

const handleSubmit = async () => {
  console.log('Submitting form with data:', formData.value) // Debug log;

  if (!validateAll() || isSubmitting.value) return
  console.log('Form is valid, proceeding with submission') // Debug log;

  isSubmitting.value = true

  try {
    // В реальном приложении здесь бы загружали изображение на сервер
    // Пока просто эмулируем URL изображения
    let imageUrl = null
    if (formData.value.image) {
      // Эмуляция загрузки - в реальности здесь был бы API вызов
      imageUrl = URL.createObjectURL(formData.value.image)
    }

    const newPost = await postsStore.createPost({
      title: formData.value.title,
      body: formData.value.body,
      userId: 1, // Пока захардкодим ID текущего пользователя
      image: imageUrl, // добавляем изображение в локальном состоянии
    })

    // Проверяем успешность создания
    if (!newPost) {
      // Если store вернул null (ошибка), показываем уведомление
      alert('Произошла ошибка при создании поста. Попробуйте еще раз.')
      return
    }

    emit('created', newPost)
    closeModal()
  } catch (error) {
    console.error('Ошибка создания поста:', error)
  } finally {
    isSubmitting.value = false
  }
}

// Закрытие по Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeModal()
  }
}

// Фокус на модальное окно при открытии
const modalRef = ref(null)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isOpen"
      ref="modalRef"
      class="popup-overlay"
      @click="closeModal"
      @keydown="handleKeydown"
      tabindex="0"
    >
      <div class="popup popup--medium" @click.stop>
        <div class="popup__header">
          <h2>Create new post</h2>
          <button class="popup__close" @click="closeModal" type="button" aria-label="close">
            <SvgIcon name="close" size="24" />
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="popup__form">
          <div class="popup__form-group">
            <label class="popup__form-label" for="title">Title:</label>
            <input
              id="title"
              v-model="formData.title"
              type="text"
              placeholder="What's on your mind?"
              :class="{ error: errors.title }"
              @blur="validateField('title')"
              @input="errors.title = ''"
            />
            <span v-if="errors.title" class="field-error">
              {{ errors.title }}
            </span>
          </div>

          <div class="popup__form-group">
            <label class="popup__form-label" for="body">Message:</label>
            <textarea
              id="body"
              v-model="formData.body"
              placeholder="Write your post here..."
              :class="{ error: errors.body }"
              @blur="validateField('body')"
              @input="errors.body = ''"
            ></textarea>
            <span v-if="errors.body" class="field-error">
              {{ errors.body }}
            </span>
          </div>

          <div class="popup__form-group">
            <label class="popup__form-label">Image (optional):</label>
            <div class="add-photo">
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleImageUpload"
                class="add-photo__input"
                id="image-upload"
              />

              <div v-if="imagePreview" class="add-photo__preview">
                <img :src="imagePreview" alt="Preview" />
                <button
                  type="button"
                  @click="removeImage"
                  class="add-photo__preview-remove"
                  aria-label="remove"
                >
                  <SvgIcon name="close" size="16" />
                </button>
              </div>

              <label v-else for="image-upload" class="add-photo__holder">
                <SvgIcon name="photo" size="36" />
                <span>Add Photo</span>
              </label>
            </div>
          </div>

          <!-- Кнопки действий -->
          <div class="popup__form-ctrl">
            <button type="button" class="btn btn--border" @click="closeModal">Cancel</button>
            <button type="submit" class="btn">
              {{ isSubmitting ? 'Publishing...' : 'Publish' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss"></style>
