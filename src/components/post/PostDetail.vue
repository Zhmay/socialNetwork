<script setup>
import { useLikes } from '@/composables/useLikes.js'
import SvgIcon from '@/components/common/SvgIcon.vue'
import userItem from '@/components/common/userItem.vue'

// Props
const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
})

// Emits
const emit = defineEmits(['post-updated'])

// Composables
const { togglePostLike } = useLikes()

// Методы
const handleLike = () => {
  const updatedPost = togglePostLike(props.post)
  emit('post-updated', updatedPost)
}
</script>

<template>
  <article class="post">
    <!-- Заголовок -->
    <div class="post__hero">
      <div class="post__hero-img">
        <img src="@/assets/img/post-img.webp" alt="" />
        <button
          @click="handleLike"
          :class="['post__like-btn', { 'post__like-btn--liked': post.isLiked }]"
          :title="post.isLiked ? 'Unlike' : 'Like'"
        >
          <SvgIcon name="heart" size="20" />
          <span class="post__like-count">{{ post.likes }}</span>
        </button>
      </div>
      <h1 class="post__hero-title">{{ post.title }}</h1>
    </div>

    <!-- Контент поста -->
    <div class="post__content">
      <p class="post__text">{{ post.body }}</p>
      <p class="post__text">
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit, in cum autem quam provident
        nulla ex ipsa voluptatum fuga officia laudantium possimus natus eligendi magnam quod
        obcaecati odio hic velit.
      </p>
      <p class="post__text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quod.
      </p>
      <p class="post__text">
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempore dolor ab alias cumque
        commodi soluta distinctio consectetur quos? Ullam earum ratione est pariatur omnis libero
        amet. Quo placeat libero illum, repellat nam quasi iure provident maiores. Quaerat, velit
        at. Sunt cupiditate distinctio expedita laborum est impedit quidem iusto atque, asperiores
        eligendi mollitia, dolores unde saepe, nostrum magnam et veniam. Voluptatum?
      </p>
      <p class="post__text">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod minus exercitationem dolorum
        eaque sunt nihil magni consequuntur velit unde voluptatem, cumque doloremque officiis
        laborum magnam quam, impedit architecto alias animi provident hic error. Ipsa molestias unde
        mollitia totam eos similique, natus, minima illum molestiae repellendus ducimus hic!
        Mollitia, ex. Consectetur, vitae delectus, consequatur dignissimos nulla iste harum voluptas
        voluptates soluta assumenda culpa sunt nisi consequuntur officia facere a laudantium
        recusandae velit corrupti dolorem maiores eius. Tenetur vitae at corrupti quidem aspernatur
        sunt omnis, dignissimos est, repellat, ea provident enim! Accusamus unde quisquam aut
        quibusdam impedit quae quo, maiores eaque similique.
      </p>
    </div>

    <div class="post__bottom">
      <userItem :post="post" />
    </div>
  </article>
</template>

<style scoped lang="scss">
.post {
  &__hero {
    position: relative;
    margin-bottom: 20px;
  }

  &__hero-img {
    position: relative;
    width: 100%;
    height: 300px;
    border-radius: var(--border-radius);
    overflow: hidden;
    margin-bottom: 20px;
    box-shadow:
      0 1px 3px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.1);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &__hero-title {
    text-transform: capitalize;
    margin-bottom: 10px;
  }

  &__like-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(255, 255, 255, 0.8);
    border: none;
    border-radius: 10px;
    padding: 0 8px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background 0.3s;
    box-shadow: var(--box-shadow);

    &:hover {
      background: rgba(255, 255, 255, 1);
    }

    svg {
      fill: none;
    }

    &--liked {
      color: var(--accent-color);

      svg {
        fill: var(--accent-color);
      }
    }

    .post__like-count {
      margin-left: 5px;
      font-size: 14px;
    }
  }

  &__content {
    margin-bottom: 20px;

    .post__text {
      margin-bottom: 15px;
      line-height: 1.6;
      color: #333;
    }
  }

  &__bottom {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
    border-top: 1px solid var(--border-color);
    padding-top: 15px;
  }
}
</style>
