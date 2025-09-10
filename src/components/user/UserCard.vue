<script setup>
import { useRouter } from 'vue-router'
import { useUsersStore } from '@/stores/users.js'
import SvgIcon from '@/components/common/SvgIcon.vue'
import HighlightedText from '@/components/common/HighlightedText.vue'

// Props
const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
  currentPage: {
    type: Number,
    default: 1,
  },
})

// Composables
const router = useRouter()
const usersStore = useUsersStore()

// Methods
const goToProfile = () => {
  const currentRoute = router.currentRoute.value

  router.push({
    name: 'user-profile',
    params: { id: props.user.id },
    query: {
      ...currentRoute.query,
      from: currentRoute.name,
      page: props.currentPage,
    },
  })
}
</script>
<template>
  <div class="user-card">
    <div class="user-card__avatar">
      <SvgIcon name="user" size="36" />
    </div>
    <div class="user-card__name">
      {{ user.name }}
    </div>
    <span class="user-card__username">@{{ user.username }}</span>
  </div>
</template>
<style scoped lang="scss">
.user-card {
  background-color: #fff;
  border-radius: var(--border-radius);
  box-shadow: var(--box-shadow);
  padding: 16px;
  text-align: center;
  cursor: pointer;
  transition: var(--transition);

  &:hover {
    .user-card__name {
      color: var(--accent-color);
    }
  }

  &__avatar {
    width: 80px;
    height: 80px;
    background-color: var(--border-color);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent-color);
    margin: 0 auto 10px;

    svg {
      fill: var(--accent-color);
    }
  }

  &__name {
    font-size: 16px;
    font-weight: 700;
    margin-bottom: 5px;
    transition: var(--transition);
  }

  &__username {
    font-size: 14px;
    color: var(--placeholder-color);
  }
}
</style>
