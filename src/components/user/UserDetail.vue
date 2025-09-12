<script setup>
import SvgIcon from '@/components/common/SvgIcon.vue'
// Props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <div class="user">
    <div class="user__avatar">
      <template v-if="user.avatar">
        <img :src="user.avatar" :alt="user.name" />
      </template>
      <template v-else>
        <SvgIcon name="user" size="40" />
      </template>
    </div>
    <ul class="user__info">
      <li class="user__info-item">
        <span class="user__info-label">Name:</span>
        <span class="user__info-value">{{ user.name }}</span>
      </li>
      <li class="user__info-item">
        <span class="user__info-label">Username:</span>
        <span class="user__info-value">@{{ user.username }}</span>
      </li>
      <li class="user__info-item">
        <span class="user__info-label">Email:</span>
        <span class="user__info-value">{{ user.email }}</span>
      </li>
      <li class="user__info-item">
        <span class="user__info-label">Phone:</span>
        <span class="user__info-value">{{ user.phone }}</span>
      </li>
      <li class="user__info-item">
        <span class="user__info-label">Website:</span>
        <span class="user__info-value">{{ user.website }}</span>
      </li>
      <li class="user__info-item">
        <span class="user__info-label">Address:</span>
        <span class="user__info-value"
          >{{ user.address.city }}, {{ user.address.street }}, {{ user.address.suite }}</span
        >
      </li>
    </ul>
  </div>
</template>

<style scoped lang="scss">
.user {
  background-color: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 20px;
  display: flex;
  align-items: flex-start;
  grid-gap: 20px;

  &__avatar {
    width: 200px;
    height: 260px;
    border-radius: 20px;
    overflow: hidden;
    background-color: var(--border-color);
    color: var(--accent-color);
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__info {
    padding: 0;
    margin: 0;
    list-style: none;

    &-item {
      display: flex;
      align-items: flex-start;
      grid-gap: 10px;

      &:not(:last-child) {
        margin-bottom: 10px;
      }
    }

    &-label {
      font-weight: 500;
      color: var(--placeholder-color);
    }
  }
}
</style>
