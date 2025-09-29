// Соответствие кодов OpenWeatherMap иконкам Meteocons
export const weatherIconMap = {
  // Clear - Ясно
  '01d': 'clear-day.svg',
  '01n': 'clear-night.svg',

  // Clouds - Облачность
  '02d': 'partly-cloudy-day.svg',
  '02n': 'partly-cloudy-night.svg',
  '03d': 'cloudy.svg',
  '03n': 'cloudy.svg',
  '04d': 'overcast.svg',
  '04n': 'overcast.svg',

  // Rain - Дождь
  '09d': 'rain.svg',
  '09n': 'rain.svg',
  '10d': 'partly-cloudy-day-rain.svg',
  '10n': 'partly-cloudy-night-rain.svg',

  // Thunderstorm - Гроза
  '11d': 'thunderstorms-day.svg',
  '11n': 'thunderstorms-night.svg',

  // Snow - Снег
  '13d': 'snow.svg',
  '13n': 'snow.svg',

  // Atmosphere - Туман
  '50d': 'fog.svg',
  '50n': 'fog.svg',
}

export const getWeatherIcon = (iconCode) => {
  return weatherIconMap[iconCode] || 'not-available.svg'
}
