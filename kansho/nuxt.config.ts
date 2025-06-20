// https://nuxt.com/docs/api/configuration/nuxt-config

// Nuxt
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss',
  ],
})