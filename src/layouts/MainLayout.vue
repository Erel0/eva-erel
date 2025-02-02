<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { onBeforeMount } from 'vue'

const store = useStore()
const router = useRouter()

const isAuthenticated = computed(() => store.getters.isAuthenticated)
const user = computed(() => store.getters.user)

const handleLogout = () => {
    store.dispatch('logout')
    router.push('/login')
}

onBeforeMount(() => {
    if (!store.state.isAuthenticated) {
        router.push('/login')
    }
})

</script>

<template>
    <div class="min-h-screen">
        <header class="bg-white shadow-md sticky top-0 z-50">
            <nav class="container mx-auto px-4 py-3">
                <div class="flex items-center justify-between">
                    <div class="space-x-6">
                        <router-link to="/" active-class="text-emerald-600"
                            class="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:scale-105">
                            Dashboard
                        </router-link>
                        <router-link to="/dashboard" active-class="text-emerald-600"
                            class="text-gray-700 hover:text-emerald-600 font-medium transition-all duration-200 hover:scale-105">
                            Dashboard
                        </router-link>
                    </div>

                    <div v-if="isAuthenticated" class="flex items-center space-x-6">
                        <span class="text-gray-600">
                            Welcome, {{ user?.username }}
                        </span>
                        <button @click="handleLogout"
                            class="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium transition-all duration-200">
                            Logout
                        </button>
                    </div>

                    <router-link v-else to="/login"
                        class="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 font-medium transition-all duration-200">
                        Login
                    </router-link>
                </div>
            </nav>
        </header>

        <main class="container mx-auto px-4 py-6">
            <slot></slot>
        </main>
    </div>
</template>