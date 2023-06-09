<script lang="ts" setup>
const appConfig = useAppConfig()
</script>

<template>
  <div class="flex justify-between max-w-screen-2xl p-4 py-4 mx-auto sm:px-8">
    <!-- Copyright -->
    <span class="text-primary-400">© {{ new Date().getFullYear() }} Daniel van der Merwe</span>
    <!-- Social icons & Color Mode -->
    <div class="space-x-3 transition text-primary-500">
      <a v-if="appConfig.socials?.twitter" :href="`https://twitter.com/${appConfig.socials?.twitter}`" title="Twitter" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:twitter" class="w-5 h-5" /></a>
      <a v-if="appConfig.socials?.github" :href="`https://github.com/${appConfig.socials?.github}`" title="GitHub" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:github" class="w-5 h-5" /></a>
      <a v-if="appConfig.socials?.linkedin" :href="`https://www.linkedin.com/in/${appConfig.socials?.linkedin}`" title="LinkedIn" class="dark:text-primary-100 hover:text-primary-700 dark:hover:text-primary-300"><Icon name="fa-brands:linkedin" class="w-5 h-5" /></a>
    </div>
  </div>
</template>
