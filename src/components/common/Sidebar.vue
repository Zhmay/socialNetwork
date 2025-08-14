<script setup></script>

<template>
    <aside class="sidebar">
        <div class="sidebar__top">
            <button class="add-post">+</button>
            <div class="sidebar__user">
                <div class="sidebar__user-img"></div>
                <span class="sidebar__user-name">Username</span>
            </div>
        </div>
    </aside>
</template>

<style scoped lang="scss">
    .sidebar {
        display: flex;
        flex-direction: column;
        width: 340px;
        flex-shrink: 0;
        background-color: #fff;
        height: 100%;
        padding: 20px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);

        &__top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid var(--border-color);
            margin-bottom: 20px;
        }

        .add-post {
            background-color: var(--accent-color);
            color: white;
            border: none;
            border-radius: 50%;
            width: 32px;
            height: 32px;
            font-size: 24px;
            cursor: pointer;
        }

        &__user {
            display: flex;
            align-items: center;
            gap: 10px;

            &-img {
                width: 40px;
                height: 40px;
                background-color: var(--border-color);
                border: 2px solid var(--accent-color);
                border-radius: 50%;
            }

            &-name {
                font-weight: 700;
                color: var(--text-main-color);
            }
        }
    }
</style>