<script setup lang="ts">
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const store = useStore()
const router = useRouter()

onMounted(() => {
  if (store.state.isAuthenticated && router.currentRoute.value.path === '/') {
    router.push('/dashboard')
  }
})

</script>

<template></template>
