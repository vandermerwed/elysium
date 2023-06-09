<script setup lang="ts">
const { cover } = useAppConfig()
</script>

<template>
  <div class="h-screen">
    <Html lang="en"></Html>
    <Meta property="og:image" :content="cover" />
    <Meta name="twitter:card" content="summary_large_image" />
    <AppLoadingBar />
    <AppNavbar />
    <slot></slot>
    <AppFooter />
  </div>
</template>

<style lang="postcss">
body {
  @apply bg-primary-50 text-black dark:bg-primary-900 dark:text-white;
}
</style>
