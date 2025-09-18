<template>
  <!-- Встроенный SVG спрайт - невидимый -->
  <svg xmlns="http://www.w3.org/2000/svg" style="display: none">
    <!-- Search icon -->
    <symbol id="icon-search" viewBox="0 0 24 24">
      <path
        d="M21 21L16.514 16.506M19 10.5A8.5 8.5 0 1 1 10.5 2a8.5 8.5 0 0 1 8.5 8.5Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </symbol>

    <!-- Close/X icon -->
    <symbol id="icon-close" viewBox="0 0 24 24">
      <path
        d="M18 6L6 18M6 6l12 12"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </symbol>

    <!-- Home icon -->
    <symbol id="icon-home" viewBox="0 0 24 24">
      <path
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </symbol>

    <!-- Users/People icon -->
    <symbol id="icon-users" viewBox="0 0 24 24">
      <path
        d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75M13 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </symbol>

    <symbol id="icon-user" viewBox="0 0 24 24">
      <path
        d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
      <circle
        cx="12"
        cy="7"
        r="4"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </symbol>

    <!-- Messages icon -->
    <symbol id="icon-messages" viewBox="0 0 24 24">
      <path
        d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </symbol>

    <!-- Settings icon -->
    <symbol id="icon-settings" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="3" stroke="currentColor" stroke-width="2" fill="none" />
      <path
        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1 1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </symbol>

    <!-- Heart/Like icon -->
    <symbol id="icon-heart" viewBox="0 0 24 24">
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </symbol>

    <!-- Plus/Add icon -->
    <symbol id="icon-plus" viewBox="0 0 24 24">
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </symbol>

    <symbol id="icon-arrow-small" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 14">
      <path
        d="M1 1l6 6-6 6"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </symbol>

    <symbol id="icon-comments" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <path
        d="M 4.0019531 3 C 2.9088903 3 2.0019531 3.9069372 2.0019531 5 L 2.0019531 17 C 2.0019531 18.093063 2.9088903 19 4.0019531 19 L 18.001953 19 L 22.001953 23 L 21.990234 4.9980469 C 21.990235 3.9049841 21.082089 3 19.990234 3 L 4.0019531 3 z M 4.0019531 5 L 19.990234 5 L 19.998047 18.167969 L 18.830078 17 L 4.0019531 17 L 4.0019531 5 z M 7 8 L 7 10 L 17 10 L 17 8 L 7 8 z M 7 12 L 7 14 L 14 14 L 14 12 L 7 12 z"
      />
    </symbol>

    <symbol id="icon-photo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <path
        d="M 19.265625 3 C 17.510922 3 15.879726 3.9224619 14.976562 5.4277344 L 13.433594 8 L 5.8183594 8 C 2.6180531 8 1.1842379e-15 10.618053 0 13.818359 L 0 36.183594 C 0 39.383104 2.6180531 42 5.8183594 42 L 44.183594 42 C 47.383104 42 50 39.381947 50 36.181641 L 50 13.818359 C 50 10.618053 47.381947 8 44.181641 8 L 36.566406 8 L 35.019531 5.421875 C 34.118597 3.9211502 32.492938 3 30.742188 3 L 19.265625 3 z M 19.265625 5 L 30.742188 5 C 31.793436 5 32.763621 5.5498967 33.304688 6.4511719 L 35.433594 10 L 44.181641 10 C 46.299334 10 48 11.700666 48 13.818359 L 48 36.181641 C 48 38.299334 46.300084 40 44.183594 40 L 5.8183594 40 C 3.7006656 40 2 38.300084 2 36.183594 L 2 13.818359 C 2 11.700666 3.7006656 10 5.8183594 10 L 14.566406 10 L 14.857422 9.5136719 L 16.691406 6.4570312 C 17.234243 5.5523038 18.210328 5 19.265625 5 z M 25 12 C 17.832139 12 12 17.832144 12 25 C 12 32.167856 17.832139 38 25 38 C 32.167861 38 38 32.167856 38 25 C 38 17.832144 32.167861 12 25 12 z M 25 14 C 31.086982 14 36 18.913022 36 25 C 36 31.086978 31.086982 36 25 36 C 18.913018 36 14 31.086978 14 25 C 14 18.913022 18.913018 14 25 14 z M 25 16.5 C 20.317422 16.5 16.5 20.317425 16.5 25 C 16.5 29.682575 20.317422 33.5 25 33.5 C 29.682578 33.5 33.5 29.682575 33.5 25 C 33.5 20.317425 29.682578 16.5 25 16.5 z M 25 18.5 C 28.601699 18.5 31.5 21.398304 31.5 25 C 31.5 28.601696 28.601699 31.5 25 31.5 C 21.398301 31.5 18.5 28.601696 18.5 25 C 18.5 21.398304 21.398301 18.5 25 18.5 z"
      />
    </symbol>
  </svg>
</template>
