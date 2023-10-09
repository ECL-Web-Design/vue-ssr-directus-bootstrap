<template>
    <div class="layout-split-2">
        <div class="left">
            <slot name="left">

            </slot>
        </div>
        <div class="right">
            <slot name="right">

            </slot>
        </div>
    </div>
</template>

<script lang="ts" setup>

</script>

<style lang="scss" scoped>

.layout-split-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0 var(--section-base-padding-vert);
}

</style>
