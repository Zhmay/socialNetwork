<script setup>
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { usePostsStore } from '@/stores/posts'
import { useValidation } from '@/composables/useValidation'
import { postValidationSchema } from '@/composables/postValidationSchema'
import { useToast } from '@/composables/useToast'
import SvgIcon from '@/components/common/SvgIcon.vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['close', 'created'])

const postsStore = usePostsStore()
const { success, error } = useToast()
const isSubmitting = ref(false)
const isClosing = ref(false) // Для анимации закрытия

// Форма данных
const formData = ref({
  title: '',
  body: '',
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

// Ссылки на элементы формы
const modalRef = ref(null)
const titleInput = ref(null)

const handleImageUpload = (event) => {
  const file = event.target.files[0]
  if (!file) return

  // Проверяем тип файла
  if (!file.type.startsWith('image/')) {
    error('Please select an image file')
    return
  }

  // Проверяем размер (максимум 5MB)
  if (file.size > 5 * 1024 * 1024) {
    error('File size should not exceed 5MB')
    return
  }

  formData.value.image = file

  // Создаем превью
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target.result
  }
  reader.readAsDataURL(file)

  success('Image added successfully')
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

// Плавное закрытие модального окна
const closeModal = () => {
  if (isClosing.value) return

  isClosing.value = true

  // Ждем завершения анимации закрытия
  setTimeout(() => {
    resetForm()
    isClosing.value = false
    emit('close')
  }, 300) // 300ms - время анимации закрытия
}

const handleSubmit = async () => {
  console.log('Submitting form with data:', formData.value)

  if (!validateAll() || isSubmitting.value) return

  isSubmitting.value = true

  try {
    // В реальном приложении здесь бы загружали изображение на сервер
    let imageUrl = null
    if (formData.value.image) {
      imageUrl = URL.createObjectURL(formData.value.image)
    }

    const newPost = await postsStore.createPost({
      title: formData.value.title,
      body: formData.value.body,
      userId: 1,
      image: imageUrl,
    })

    // Проверяем успешность создания
    if (!newPost) {
      error('Failed to create post. Please try again.')
      return
    }

    success('Post created successfully!')
    emit('created', newPost)

    // КЛЮЧЕВОЕ ИЗМЕНЕНИЕ: задержка перед закрытием
    // Это позволит увидеть начальную анимацию поста (зеленый фон)
    setTimeout(() => {
      closeModal()
    }, 200) // 200ms задержка для синхронизации
  } catch (err) {
    console.error('Error creating post:', err)
    error('Something went wrong. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Обработка клавиатуры
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeModal()
    return
  }
}

// Фокус на первое поле при открытии модального окна
const focusFirstInput = async () => {
  if (props.isOpen && !isClosing.value) {
    await nextTick()
    if (titleInput.value) {
      titleInput.value.focus()
    }
  }
}

// Слушатели событий клавиатуры
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})

// Следим за открытием модального окна
watch(() => props.isOpen, focusFirstInput)
</script>

<template>
  <Teleport to="body">
    <Transition name="modal" appear>
      <div
        v-if="isOpen && !isClosing"
        ref="modalRef"
        class="popup-overlay"
        @click="closeModal"
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
                ref="titleInput"
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
              <button type="submit" class="btn" :class="{ 'btn--loading': isSubmitting }">
                {{ isSubmitting ? 'Publishing...' : 'Publish' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss"></style>
