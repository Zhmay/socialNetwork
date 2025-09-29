<script setup></script>

<template>
  <div class="weather-skeleton">
    <div class="weather-skeleton__head">
      <div class="weather-skeleton__head-box">
        <div class="skeleton-title"></div>
        <div class="skeleton-button"></div>
      </div>
      <div class="skeleton-day"></div>
      <div class="skeleton-date"></div>
    </div>

    <div class="weather-skeleton__main">
      <div class="weather-skeleton__main-details">
        <div class="skeleton-detail-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-text-group">
            <div class="skeleton-text skeleton-text--small"></div>
            <div class="skeleton-text skeleton-text--tiny"></div>
          </div>
        </div>
        <div class="skeleton-detail-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-text-group">
            <div class="skeleton-text skeleton-text--small"></div>
            <div class="skeleton-text skeleton-text--tiny"></div>
          </div>
        </div>
      </div>

      <div class="weather-skeleton__main-info">
        <div class="skeleton-weather-icon"></div>
        <div class="skeleton-temperature"></div>
        <div class="skeleton-description"></div>
      </div>
    </div>

    <div class="weather-skeleton__details">
      <div class="skeleton-sunrise-sunset">
        <div class="skeleton-sun-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-text skeleton-text--small"></div>
          <div class="skeleton-text skeleton-text--tiny"></div>
        </div>
        <div class="skeleton-sun-item">
          <div class="skeleton-icon"></div>
          <div class="skeleton-text skeleton-text--small"></div>
          <div class="skeleton-text skeleton-text--tiny"></div>
        </div>
      </div>
    </div>

    <div class="skeleton-update-text"></div>
  </div>
</template>

<style scoped lang="scss">
.weather-skeleton {
  background-color: #8c86d1;
  position: relative;
  overflow: hidden;
  color: #fff;

  &__head {
    &-box {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 10px;
    }
  }

  &__main {
    display: flex;
    align-items: center;
    margin: 0 0 20px;

    &-details {
      width: 40%;
    }

    &-info {
      width: 60%;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }

  &__details {
    margin-bottom: 30px;
  }
}

.skeleton-title {
  width: 120px;
  height: 21px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.skeleton-button {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.skeleton-day {
  width: 90px;
  height: 18px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 5px;
}

.skeleton-date {
  width: 140px;
  height: 16px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.skeleton-detail-item {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 10px;
}

.skeleton-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
}

.skeleton-text-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.skeleton-text {
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);

  &--small {
    width: 50px;
    height: 16px;
  }

  &--tiny {
    width: 40px;
    height: 12px;
  }
}

.skeleton-weather-icon {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 20px;
}

.skeleton-temperature {
  width: 120px;
  height: 34px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;
}

.skeleton-description {
  width: 150px;
  height: 20px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.skeleton-sunrise-sunset {
  display: flex;
  justify-content: space-between;
  gap: 10px;
  padding-top: 20px;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    height: 100%;
    border-width: 3px;
    border-style: solid;
    border-color: rgba(255, 255, 255, 0.3) transparent transparent;
    border-radius: 50% / 56px 56px 0 0;
  }
}

.skeleton-sun-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.skeleton-update-text {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 100px;
  height: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

// Анимация пульсации
.skeleton-title,
.skeleton-button,
.skeleton-day,
.skeleton-date,
.skeleton-icon,
.skeleton-text,
.skeleton-weather-icon,
.skeleton-temperature,
.skeleton-description,
.skeleton-update-text {
  animation: skeleton-pulse 1.5s ease-in-out infinite;
}

@keyframes skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
