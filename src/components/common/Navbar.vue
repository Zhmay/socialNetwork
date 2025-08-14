<script setup></script>

<template>
    <aside class="navbar">
        <div class="navbar__top">
            <a href="#" class="navbar__logo">ZHNetwork</a>
        </div>
        <nav class="navbar__list">
            <a href="#" class="navbar__link active">Home</a>
            <a href="#" class="navbar__link">People</a>
            <a href="#" class="navbar__link">Messages</a>
            <a href="#" class="navbar__link">Settings</a>
        </nav>
    </aside>
</template>

<style scoped lang="scss">
    .navbar {
        display: flex;
        flex-direction: column;
        width: 220px;
        flex-shrink: 0;
        height: 100%;
        padding: 20px 0;

        &__top {
            padding: 0 20px;
            margin-bottom: 40px;
        }

        &__logo {
            font-size: 24px;
            font-weight: 700;
            color: var(--accent-color);
        }

        &__list {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        &__link {
            display: flex;
            align-items: center;
            height: 44px;
            gap: 10px;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 40px 0 0 40px;
            color: var(--text-main-color);
            transition: all .3s ease;

            &.active {
                background-color: var(--content-color);
            }
        }
    }
</style>