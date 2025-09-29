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
      <div class="weather-widget__head">
        <div class="weather-widget__head-box">
          <h3>{{ city }}, {{ country }}</h3>
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
        <div class="weather-widget__day">{{ dayOfWeek }}</div>
        <div class="weather-widget__date">{{ date }}</div>
      </div>

      <!-- Основная информация -->
      <div class="weather-widget__main">
        <div class="weather-widget__main-details">
          <div class="weather-widget__main-item weather-widget__main-item--humidity">
            <img src="@/assets/icons/weather/humidity.svg" />
            <div>
              <strong>{{ humidity }}</strong>
              <span>humidity</span>
            </div>
          </div>
          <div class="weather-widget__main-item weather-widget__main-item--wind">
            <img src="@/assets/icons/weather/windsock.svg" />
            <div>
              <strong>{{ windSpeed }}</strong>
              <span>wind</span>
            </div>
          </div>
        </div>
        <div class="weather-widget__main-info">
          <img v-if="iconUrl" :src="iconUrl" :alt="description" class="weather-icon" />
          <div class="weather-widget__main-box">
            <div class="weather-widget__main-temperature">{{ temperature }}<sup>°C</sup></div>
            <p class="weather-widget__main-description">{{ description }}</p>
          </div>
        </div>
      </div>

      <!-- Дополнительная информация -->
      <div class="weather-widget__details">
        <div class="weather-widget__details-box weather-widget__details-box--second">
          <div class="weather-widget__details-item weather-widget__details-item--sunrise">
            <img src="@/assets/icons/weather/sunrise.svg" />
            <div>
              <strong>{{ sunrise }}</strong>
              <span>sunrise</span>
            </div>
          </div>
          <div class="weather-widget__details-item weather-widget__details-item--sunset">
            <img src="@/assets/icons/weather/sunset.svg" />
            <div>
              <strong>{{ sunset }}</strong>
              <span>sunset</span>
            </div>
          </div>
        </div>
      </div>

      <span v-if="lastUpdate" class="weather-widget__last-update">Обновлено: {{ lastUpdate }}</span>

      <div class="weather-widget__decor">
        <img src="@/assets/img/widget-bg.webp" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.weather-widget {
  background-color: #8c86d1;
  padding: 20px;
  border-radius: 10px;
  box-shadow: var(--box-shadow);
  position: relative;
  overflow: hidden;
  color: #fff;
  z-index: 1;

  &__head {
    &-box {
      display: flex;
      justify-content: space-between;
      grid-gap: 10px;
      margin-bottom: 10px;
    }
  }

  h3 {
    font-size: 20px;
    margin: 0;
  }

  &__day {
    font-style: italic;
    font-size: 16px;
    font-weight: 600;
    margin-bottom: 5px;
  }

  &__date {
    font-size: 12px;
  }

  &__main {
    text-align: center;
    margin: -10px 0 30px;
    display: flex;
    align-items: center;

    &-details {
      width: 30%;
    }

    &-info {
      width: 70%;
    }

    &-item {
      display: flex;
      align-items: center;
      text-align: left;
      white-space: nowrap;

      &:not(:last-child) {
        margin-bottom: 10px;
      }

      img {
        width: 40px;
        height: 40px;
        transform: scale(1.2);
      }

      span {
        display: block;
        text-transform: capitalize;
        font-size: 12px;
      }
    }

    .weather-icon {
      width: 180px;
      height: 180px;
    }

    &-box {
      margin: -40px 0 0;
    }

    &-temperature {
      font-size: 48px;
      font-weight: 700;
      margin: 0;

      sup {
        position: absolute;
        font-size: 22px;
        font-weight: 400;
      }
    }

    &-description {
      font-style: italic;
      text-transform: capitalize;
      font-size: 16px;
    }
  }

  &__details {
    &-box {
      display: flex;
      justify-content: space-between;
      grid-gap: 10px;
      margin-bottom: 10px;

      &--second {
        position: relative;
        padding-top: 20px;
        margin-bottom: 30px;

        &::before {
          content: '';
          position: absolute;
          top: 0px;
          left: 50%;
          transform: translateX(-50%);
          width: 90%;
          height: 100%;
          z-index: -1;
          border-width: 3px;
          border-style: solid;
          border-image: initial;
          border-color: #fff transparent transparent;
          border-radius: 50% / 56px 56px 0px 0px;
        }
      }
    }

    &-item {
      display: flex;
      align-items: center;
      grid-gap: 5px;
      font-size: 16px;

      &--sunrise,
      &--sunset {
        flex-direction: column;
        align-items: center;
        justify-content: center;
        grid-gap: 0;
      }

      img {
        width: 40px;
        height: 40px;
        transform: scale(1.2);
      }

      span {
        display: block;
        text-transform: capitalize;
        font-size: 14px;
      }
    }
  }

  &__decor {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 100%;
    opacity: 0.2;
    pointer-events: none;
    z-index: -2;

    img {
      display: block;
      width: 100%;
      height: auto;
      transform: scale(1.5);
      transform-origin: right bottom;
    }
  }

  &__refresh {
    background: none;
    color: inherit;
    border: none;
    padding: 0;
    font: inherit;
    cursor: pointer;
    outline: inherit;
    width: 26px;
    height: 26px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: var(--transition);
    background-color: #746bce;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.5;
    }

    &.updating {
      animation: spin 1s linear infinite;
    }
  }

  &__last-update {
    position: absolute;
    bottom: 10px;
    right: 10px;
    font-size: 12px;
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
