<script setup lang="ts">
import { useStore } from '../store'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue'

const store = useStore()
const router = useRouter()

onMounted(() => {
  if (store.state.auth && router.currentRoute.value.path === '/') {
    router.push('/dashboard')
  }
})

</script>

<template></template>
