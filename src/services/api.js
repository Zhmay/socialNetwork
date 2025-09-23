import axios from 'axios'

// Создаем базовый instance Axios
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Константы для retry
const MAX_RETRIES = 2
const RETRY_DELAY = 1000 // 1 секунда

// Типы ошибок
export const ERROR_TYPES = {
  NETWORK: 'network',
  TIMEOUT: 'timeout',
  NOT_FOUND: 'not_found',
  SERVER: 'server',
  VALIDATION: 'validation',
  UNKNOWN: 'unknown',
}

// Функция для задержки
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

// Определение типа ошибки
const getErrorType = (error) => {
  if (!error.response) {
    if (error.code === 'ECONNABORTED') return ERROR_TYPES.TIMEOUT
    return ERROR_TYPES.NETWORK
  }

  const status = error.response.status
  if (status === 404) return ERROR_TYPES.NOT_FOUND
  if (status >= 400 && status < 500) return ERROR_TYPES.VALIDATION
  if (status >= 500) return ERROR_TYPES.SERVER
  return ERROR_TYPES.UNKNOWN
}

// Человекочитаемые сообщения
const getErrorMessage = (errorType, originalMessage) => {
  const messages = {
    [ERROR_TYPES.NETWORK]: 'Network connection failed. Please check your internet connection.',
    [ERROR_TYPES.TIMEOUT]: 'Request timed out. Please try again.',
    [ERROR_TYPES.NOT_FOUND]: 'The requested resource was not found.',
    [ERROR_TYPES.SERVER]: 'Server error occurred. Please try again later.',
    [ERROR_TYPES.VALIDATION]: 'Invalid request data.',
    [ERROR_TYPES.UNKNOWN]: 'An unexpected error occurred.',
  }

  return messages[errorType] || originalMessage || 'Something went wrong'
}

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor с автоматическими retry
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const config = error.config
    const errorType = getErrorType(error)
    const errorMessage = getErrorMessage(errorType, error.message)

    console.log('API Error detected:', {
      type: errorType,
      message: errorMessage,
      url: config?.url,
      attempt: (config._retryCount || 0) + 1,
    })

    // Проверяем нужно ли делать retry
    const shouldRetry =
      config && [ERROR_TYPES.NETWORK, ERROR_TYPES.TIMEOUT, ERROR_TYPES.SERVER].includes(errorType)

    if (shouldRetry) {
      config._retryCount = config._retryCount || 0

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount++
        const delayTime = RETRY_DELAY * config._retryCount

        console.log(
          `Auto-retry ${config._retryCount}/${MAX_RETRIES} after ${delayTime}ms for: ${config.url}`,
        )

        await delay(delayTime)
        return api(config)
      }

      console.log(`All ${MAX_RETRIES} auto-retry attempts failed for: ${config.url}`)
    }

    // Создаем стандартизированную ошибку
    const standardError = {
      type: errorType,
      message: errorMessage,
      status: error.response?.status,
      originalError: error,
      retryable: [ERROR_TYPES.NETWORK, ERROR_TYPES.TIMEOUT, ERROR_TYPES.SERVER].includes(errorType),
      retriesAttempted: config._retryCount || 0,
    }

    return Promise.reject(standardError)
  },
)

export default api
