<script lang="ts">
import { defineComponent } from 'vue'
import MainLayout from './layouts/MainLayout.vue'
import AuthLayout from './layouts/AuthLayout.vue'

export default defineComponent({
  name: 'App',
  components: {
    MainLayout,
    AuthLayout
  }
})
</script>

<template>
  <component :is="$route.meta.layout + '-layout'">
    <router-view />
  </component>
</template>

<style>
/* Eski CSS'i kaldırıyoruz çünkü artık Tailwind kullanıyoruz */
</style>
