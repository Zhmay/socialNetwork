// composables/useHighlight.js
import { computed } from 'vue'

export function useHighlight() {
  
  /**
   * Создает массив фрагментов текста с пометками о подсветке
   * @param {string} text - Исходный текст
   * @param {string} query - Поисковый запрос
   * @param {object} options - Опции подсветки
   * @returns {Array} Массив объектов {text, highlighted}
   */
  const createHighlightedFragments = (text, query, options = {}) => {
    const {
      caseSensitive = false,
      wholeWords = false,
      maxFragments = null // Ограничение количества фрагментов для производительности
    } = options

    // Если нет запроса или текста, возвращаем исходный текст
    if (!query || !text || typeof text !== 'string') {
      return [{ text, highlighted: false }]
    }

    const searchQuery = caseSensitive ? query : query.toLowerCase()
    const searchText = caseSensitive ? text : text.toLowerCase()
    
    let regex
    if (wholeWords) {
      // Поиск только целых слов
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      regex = new RegExp(`\\b${escapedQuery}\\b`, caseSensitive ? 'g' : 'gi')
    } else {
      // Поиск подстроки
      const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      regex = new RegExp(escapedQuery, caseSensitive ? 'g' : 'gi')
    }

    const fragments = []
    let lastIndex = 0
    let matchCount = 0

    // Находим все совпадения
    text.replace(regex, (match, index) => {
      // Проверяем лимит фрагментов
      if (maxFragments && matchCount >= maxFragments) {
        return match
      }

      // Добавляем текст перед совпадением
      if (index > lastIndex) {
        fragments.push({
          text: text.slice(lastIndex, index),
          highlighted: false
        })
      }

      // Добавляем подсвеченный фрагмент
      fragments.push({
        text: match,
        highlighted: true
      })

      lastIndex = index + match.length
      matchCount++
      return match
    })

    // Добавляем оставшийся текст
    if (lastIndex < text.length) {
      fragments.push({
        text: text.slice(lastIndex),
        highlighted: false
      })
    }

    return fragments.length > 0 ? fragments : [{ text, highlighted: false }]
  }

  /**
   * Reactive функция для создания подсвеченного текста
   * @param {Ref|ComputedRef|Function} textSource - Источник текста
   * @param {Ref|ComputedRef|Function} querySource - Источник поискового запроса
   * @param {object} options - Опции подсветки
   */
  const useHighlightedText = (textSource, querySource, options = {}) => {
    return computed(() => {
      const text = typeof textSource === 'function' ? textSource() : textSource.value
      const query = typeof querySource === 'function' ? querySource() : querySource.value
      
      return createHighlightedFragments(text, query, options)
    })
  }

  /**
   * Создает обрезанный текст с подсветкой (для превью)
   * @param {string} text - Исходный текст
   * @param {string} query - Поисковый запрос
   * @param {object} options - Опции
   */
  const createHighlightedExcerpt = (text, query, options = {}) => {
    const {
      maxLength = 150,
      contextPadding = 30,
      caseSensitive = false
    } = options

    if (!query || !text) {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
    }

    const searchQuery = caseSensitive ? query : query.toLowerCase()
    const searchText = caseSensitive ? text : text.toLowerCase()
    
    // Находим первое совпадение
    const matchIndex = searchText.indexOf(searchQuery)
    
    if (matchIndex === -1) {
      return text.length > maxLength ? text.slice(0, maxLength) + '...' : text
    }

    // Вычисляем границы фрагмента
    const start = Math.max(0, matchIndex - contextPadding)
    const end = Math.min(text.length, matchIndex + query.length + contextPadding)
    
    let excerpt = text.slice(start, end)
    
    // Добавляем многоточие если нужно
    if (start > 0) excerpt = '...' + excerpt
    if (end < text.length) excerpt = excerpt + '...'
    
    return excerpt
  }

  return {
    createHighlightedFragments,
    useHighlightedText,
    createHighlightedExcerpt
  }
}