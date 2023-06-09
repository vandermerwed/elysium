<template>
    <div class="max-w-5xl px-4 py-10 m-auto bg-white sm:px-8 sm:shadow dark:bg-primary-800 ring-1 ring-gray-200 dark:ring-gray-700 sm:rounded-lg">
      <main class="max-w-none">
        <slot></slot>
        <ContentList path="/notes" v-slot="{ list }">
            <div v-for="article in list" :key="article._path">
                <h2>{{ article.title }}</h2>
                <p>{{ article.description }}</p>
            </div>
        </ContentList>
      </main>
    </div>
  </template>
