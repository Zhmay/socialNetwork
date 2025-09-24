<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useWeatherStore } from '@/stores/weather'
import SvgIcon from '@/components/common/SvgIcon.vue'

const weatherStore = useWeatherStore()
const autoRefreshInterval = ref(null)

// Computed свойства
const weatherData = computed(() => weatherStore.currentWeather)
const isLoading = computed(() => weatherStore.isLoading)
const error = computed(() => weatherStore.error)

// Используем правильные геттеры из store
const city = computed(() => weatherStore.city)
const country = computed(() => weatherStore.weatherCountry)
const humidity = computed(() => weatherStore.weatherHumidity)
const windSpeed = computed(() => weatherStore.weatherWindSpeed)
const sunrise = computed(() => weatherStore.formattedSunrise)
const sunset = computed(() => weatherStore.formattedSunset)
const temperature = computed(() => weatherStore.formattedTemperature)
const description = computed(() => weatherStore.weatherDescription)
const iconUrl = computed(() => weatherStore.weatherIconUrl)
const date = computed(() => weatherStore.weatherDate)
const dayOfWeek = computed(() => weatherStore.weatherDayOfWeek)
const lastUpdate = computed(() => weatherStore.formattedLastUpdate)

const refreshWeather = async () => {
  await weatherStore.refreshWeather()
}

const clearError = () => {
  weatherStore.clearError()
}

const startAutoRefresh = () => {
  autoRefreshInterval.value = setInterval(
    () => {
      const shouldRefresh = weatherStore.checkShouldRefresh()

      if (shouldRefresh) {
        console.log('Auto-refreshing weather data...')
        weatherStore.fetchWeather(weatherStore.city, true)
      } else {
        console.log('Weather data is up-to-date.')
      }
    },
    5 * 60 * 1000,
  )
}

const stopAutoRefresh = () => {
  if (autoRefreshInterval.value) {
    clearInterval(autoRefreshInterval.value)
    autoRefreshInterval.value = null
  }
}

onMounted(async () => {
  await weatherStore.fetchWeather()
  startAutoRefresh()
})

onUnmounted(() => {
  stopAutoRefresh()
})
</script>

<template>
  <div class="weather-widget">
    <!-- Показываем loader только при ПЕРВОЙ загрузке -->
    <div v-if="isLoading && !weatherData" class="weather-loading">Loading weather...</div>

    <!-- Error состояние -->
    <div v-else-if="error && !weatherData" class="weather-error">
      <p>{{ error }}</p>
      <button @click="refreshWeather">Повторить</button>
    </div>

    <!-- Основной интерфейс - показываем ВСЕГДА когда есть данные -->
    <div v-else-if="weatherData" class="weather-content">
      <!-- Мини-индикатор обновления -->

      <!-- Заголовок с городом -->
      <div class="weather-header">
        <h3>{{ city }}, {{ country }}</h3>
        <span>{{ dayOfWeek }}, {{ date }}</span>
        <button
          class="weather-widget__refresh"
          @click="refreshWeather"
          :disabled="isLoading"
          :class="{ updating: isLoading }"
          aria-label="Update Weather"
        >
          <SvgIcon name="refresh-cw" size="16" />
        </button>
      </div>

      <!-- Основная информация -->
      <div class="weather-main">
        <img v-if="iconUrl" :src="iconUrl" :alt="description" />
        <div class="temperature">{{ temperature }}</div>
      </div>

      <!-- Дополнительная информация -->
      <div class="weather-details">
        <p>{{ description }}</p>
        <p>Влажность: {{ humidity }}</p>
        <p>Ветер: {{ windSpeed }}</p>
        <p>Рассвет: {{ sunrise }}</p>
        <p>Закат: {{ sunset }}</p>
        <p v-if="lastUpdate">Обновлено: {{ lastUpdate }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-widget {
  background-color: #e6bdfe;
  padding: 20px;
  border-radius: 10px;
  box-shadow: var(--box-shadow);

  &__refresh {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.updating {
      animation: spin 1s linear infinite;
    }
  }
}
.weather-content {
  transition: opacity 0.3s ease;
}

.weather-content.updating {
  opacity: 0.7;
}

.update-indicator {
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  color: #666;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.weather-main img {
  transition: opacity 0.2s ease;
}

.temperature {
  transition: all 0.3s ease;
}
</style>
