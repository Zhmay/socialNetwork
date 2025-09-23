import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

export function useErrorHandling() {
  const { error: showErrorToast, success } = useToast()
  const retryCount = ref(0)
  const maxRetries = ref(3)

  const handleRetry = async (retryFn, options = {}) => {
    const {
      maxAttempts = 3,
      onSuccess = null,
      onError = null,
      showToast = true,
      successMessage = 'Data loaded successfully',
    } = options

    retryCount.value++

    try {
      console.log(`Retry attempt ${retryCount.value}/${maxAttempts}`)

      const result = await retryFn()

      // Успешный retry
      retryCount.value = 0

      if (showToast) {
        success(successMessage)
      }

      if (onSuccess) {
        onSuccess(result)
      }

      return result
    } catch (err) {
      console.error(`Retry ${retryCount.value} failed:`, err)

      if (retryCount.value >= maxAttempts) {
        // Все попытки исчерпаны
        retryCount.value = 0

        if (showToast) {
          showErrorToast(`Failed after ${maxAttempts} attempts`)
        }

        if (onError) {
          onError(err)
        }

        throw err
      }

      // Еще есть попытки
      if (showToast) {
        showErrorToast(`Attempt ${retryCount.value} failed, retrying...`)
      }

      // Рекурсивный retry с задержкой
      await new Promise((resolve) => setTimeout(resolve, 1000 * retryCount.value))
      return handleRetry(retryFn, options)
    }
  }

  // Простая функция retry без рекурсии (для кнопки "Try Again")
  const simpleRetry = async (retryFn, clearErrorFn = null) => {
    try {
      if (clearErrorFn) {
        clearErrorFn()
      }

      console.log('Manual retry triggered')
      await retryFn()
    } catch (err) {
      console.error('Manual retry failed:', err)
      // Ошибка уже обработана в store
    }
  }

  return {
    retryCount,
    maxRetries,
    handleRetry,
    simpleRetry,
  }
}
