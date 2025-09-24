import axios from 'axios'

const API_KEY = '689b976106192d25ebc9c0a6a4e33175'
const BASE_URL = 'https://api.openweathermap.org/data/2.5'

// Функция для retry логики
const retryRequest = async (fn, maxRetries = 3, delay = 1000) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      // Если это последняя попытка или ошибка не сетевая - пробрасываем
      if (
        attempt === maxRetries ||
        error.response?.status === 404 ||
        error.response?.status === 401
      ) {
        throw error
      }

      console.warn(`Попытка ${attempt} неуспешна, повторяем через ${delay}мс...`)
      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= 2 // Увеличиваем задержку экспоненциально
    }
  }
}

export const getCurrentWeather = async (city = 'Kharkiv') => {
  const makeRequest = async () => {
    const response = await axios.get(
      `${BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric&lang=en`,
    )

    return {
      city: response.data.name,
      country: response.data.sys.country,
      temperature: Math.round(response.data.main.temp),
      feelsLike: Math.round(response.data.main.feels_like),
      description: response.data.weather[0].description,
      icon: response.data.weather[0].icon,
      humidity: response.data.main.humidity,
      windSpeed: Math.round(response.data.wind.speed),
      windDirection: response.data.wind.deg,
      sunrise: response.data.sys.sunrise,
      sunset: response.data.sys.sunset,
      pressure: response.data.main.pressure,
      timestamp: new Date().toISOString(),
    }
  }

  try {
    return await retryRequest(makeRequest)
  } catch (error) {
    console.error('Weather API Error:', error)

    if (error.response) {
      const status = error.response.status
      switch (status) {
        case 404:
          throw new Error('Город не найден')
        case 401:
          throw new Error('Неверный API ключ')
        case 429:
          throw new Error('Превышен лимит запросов')
        default:
          throw new Error('Ошибка получения данных о погоде')
      }
    } else if (error.request) {
      throw new Error('Проблемы с сетью')
    } else {
      throw new Error('Неизвестная ошибка')
    }
  }
}

export const getIconUrl = (iconCode) => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}
