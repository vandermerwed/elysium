export default defineNuxtSchema({
  appConfig: {
    /** Default OG image path */
    cover: '/cover.jpg',
    /**
     * Social media icons displayed in the navbar
     */
    socials: {
      /**
       * Twitter handle
       * 
       * @example 'vandermerwed'
       * @studioIcon simple-icons:twitter
       * */
      twitter: '',
      /**
       * Github porfile name
       * @example 'nuxt/framework'
       * @studioIcon simple-icons:github
       * */
      github: '',
      /**
       * LinkedIn porfile name
       * @example 'vandermerwed'
       * @studioIcon simple-icons:linkedin
       * */
      linkedin: ''
    }
  }
})
