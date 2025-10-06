import { ref, computed, reactive } from 'vue'

const validationRules = {
  required: (value) => Boolean(value?.trim()),
  minLength: (value, min) => value?.length >= min,
  maxLength: (value, max) => value?.length <= max,
  email: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
}

export function useValidation(schema, formData) {
  const errors = ref({})
  const touched = ref({})
  const hasTriedSubmit = ref(false)

  // Валидация одного поля
  const validateField = (fieldName) => {
    const fieldSchema = schema[fieldName]
    const fieldValue = formData[fieldName]

    if (!fieldSchema) return true

    for (const rule of fieldSchema) {
      const isValid = validationRules[rule.rule](fieldValue, rule.value)
      if (!isValid) {
        errors.value[fieldName] = rule.message
        return false
      }
    }

    delete errors.value[fieldName]
    return true
  }

  // Валидация всех полей
  const validateAll = () => {
    hasTriedSubmit.value = true
    let isValid = true
    Object.keys(schema).forEach((fieldName) => {
      touched.value[fieldName] = true
      if (!validateField(fieldName)) {
        isValid = false
      }
    })
    return isValid
  }

  const isFormValid = computed(() => Object.keys(errors.value).length === 0)

  const clearFieldError = (fieldName) => {
    if (errors.value[fieldName]) {
      delete errors.value[fieldName]
    }
  }

  const clearErrors = () => {
    errors.value = {}
    touched.value = {}
    hasTriedSubmit.value = false
  }

  const resetValidation = () => {
    errors.value = {}
  }

  return {
    errors,
    touched,
    hasTriedSubmit,
    validateField,
    validateAll,
    isFormValid,
    clearFieldError,
    clearErrors,
    resetValidation,
  }
}
