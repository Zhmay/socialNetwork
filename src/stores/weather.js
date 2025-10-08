import { defineStore } from 'pinia'
import { getCurrentWeather } from '@/services/weather.service'
import { getWeatherIcon } from '@/utils/weatherIcons'

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    currentWeather: null,
    isLoading: false,
    error: null,
    lastUpdate: null,
    city: 'Kharkiv',
    cacheTimeout: 10 * 60 * 1000, // 1 час в миллисекундах
  }),

  getters: {
    formattedTemperature: (state) => {
      if (!state.currentWeather) return null
      return `${state.currentWeather.temperature}`
    },

    formattedLastUpdate: (state) => {
      if (!state.lastUpdate) return null
      return new Date(state.lastUpdate).toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    weatherIconName: (state) => {
      if (!state.currentWeather?.icon) return null
      return getWeatherIcon(state.currentWeather.icon)
    },

    formattedSunrise: (state) => {
      if (!state.currentWeather?.sunrise) return null
      const date = new Date(state.currentWeather.sunrise * 1000)
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    formattedSunset: (state) => {
      if (!state.currentWeather?.sunset) return null
      const date = new Date(state.currentWeather.sunset * 1000)
      return date.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit',
      })
    },

    weatherCountry: (state) => {
      if (!state.currentWeather?.country) return null
      return state.currentWeather.country
    },

    weatherHumidity: (state) => {
      if (!state.currentWeather?.humidity) return null
      return `${state.currentWeather.humidity}%`
    },

    weatherWindSpeed: (state) => {
      if (!state.currentWeather?.windSpeed) return null
      return `${state.currentWeather.windSpeed} m/s`
    },

    weatherDescription: (state) => {
      if (!state.currentWeather?.description) return null
      return state.currentWeather.description
    },

    weatherPressure: (state) => {
      if (!state.currentWeather?.pressure) return null
      return `${state.currentWeather.pressure} hPa`
    },

    weatherFeelsLike: (state) => {
      if (!state.currentWeather?.feelsLike) return null
      return `${state.currentWeather.feelsLike}°`
    },

    weatherDate: (state) => {
      if (!state.currentWeather?.timestamp) return null
      const date = new Date(state.currentWeather.timestamp)
      return date.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    },

    weatherDayOfWeek: (state) => {
      if (!state.currentWeather?.timestamp) return null
      const date = new Date(state.currentWeather.timestamp)
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
      })
    },
  },

  actions: {
    checkShouldRefresh() {
      if (!this.lastUpdate) return true
      const now = new Date().getTime()
      const lastUpdateTime = new Date(this.lastUpdate).getTime()
      const timeDiff = now - lastUpdateTime
      const shouldRefresh = timeDiff > this.cacheTimeout

      return shouldRefresh
    },

    async fetchWeather(city = this.city, force = false) {
      // Проверяем кеш, если force не true
      if (!force && !this.checkShouldRefresh() && this.currentWeather) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const weatherData = await getCurrentWeather(city)
        this.currentWeather = weatherData
        this.lastUpdate = new Date().toISOString()
        this.city = city
      } catch (error) {
        this.error = error.message
        console.error('Error fetching weather:', error)
      } finally {
        this.isLoading = false
      }
    },

    async refreshWeather() {
      await this.fetchWeather(this.city, true) // force = true
    },

    clearError() {
      this.error = null
    },
  },
})
