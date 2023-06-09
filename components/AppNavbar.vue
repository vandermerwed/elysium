<script lang="ts" setup>
const { navigation } = useContent()
const appConfig = useAppConfig()
</script>

<template>
  <div class="flex justify-between max-w-screen-2xl p-4 py-4 mx-auto sm:px-8">
    <!-- Navigation -->
    <div class="text-primary-700 dark:text-primary-200">
      <NuxtLink to="/" active-class="font-bold" class="mr-6 font-bold text-orange-500">daniel.</NuxtLink>
    </div>
    <div>
      <NuxtLink
        v-for="link of navigation"
        :key="link._path"
        :to="link._path"
        active-class="font-bold"
        class="ml-6 dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"
      >
        {{ link.title }}
      </NuxtLink>
      <ColorModeSwitch class="ml-5 dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300" />
    </div>
  </div>
</template>
