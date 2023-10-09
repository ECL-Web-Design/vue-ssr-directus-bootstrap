<template>
    <div :class="{'icon-card-horz' : horizontal}" class="icon-card">
        <div class="icon">
            <slot name="icon"></slot>
        </div>
        <h3 class="heading">
            <slot name="heading"></slot>
        </h3>
        <span class="subheading">
            <slot name="subheading"></slot>
        </span>
    </div>
</template>

<script lang="ts" setup>

const props = defineProps<{
    horizontal?: boolean,
}>()

</script>

<style lang="scss" scoped>

.icon-card {
    display: grid;
    grid-template-rows: min-content min-content 1fr;
    justify-content: center;
    gap: 0.5rem;
}

.icon {
    display: flex;
    justify-content: center;
}

.heading, .subheading {
    text-align: center;
}

.heading {
}

.subheading {
    font-size: var(--font-small);
}

.icon-card-horz {
    grid-template-columns: min-content 1fr;
    grid-template-rows: min-content 1fr;

    .subheading, .heading {
        text-align: left;
    }

    .icon {
        grid-row: 1/3;
        align-items: center;
    }
}

</style>
