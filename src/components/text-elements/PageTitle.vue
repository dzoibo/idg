<template>
    <span class="PageTitle">{{ title }}</span>
</template>
<script setup lang="ts">
defineProps<{
    title: string
}>()
</script>
<style lang="scss">
.PageTitle {
    white-space: pre-line;
    font-family: $font-primary;
    color: rgb(var(--v-theme-main-blue));
    font-size: 60px;
    font-weight: 700;
    line-height: 60px;
}
</style>