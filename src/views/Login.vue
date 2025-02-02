<script setup lang="ts">
import { ref, computed } from 'vue'
import { useStore } from '../store'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()
const email = ref('homework@eva.guru')
const password = ref('Homeworkeva1**')
const rememberMe = ref(false)
const error = computed(() => store.getters.error)

const handleLogin = async () => {
    const success = await store.dispatch('login', {
        email: email.value,
        password: password.value,
        rememberMe: rememberMe.value
    })

    if (success) {
        router.push('/dashboard')
    }
}
</script>

<template>
    <div class="p-8">
        <div class="space-y-6">
            <div>
                <h2 class="text-center text-2xl font-bold tracking-tight text-gray-900">
                    Sign in to your account
                </h2>
            </div>
            <form class="space-y-6" @submit.prevent="handleLogin">
                <div class="space-y-4">
                    <div>
                        <label for="email" class="block text-sm font-medium text-gray-700">Email address</label>
                        <input id="email" v-model="email" type="email" required
                            class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
                            placeholder="Enter your email" />
                    </div>
                    <div>
                        <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                        <input id="password" v-model="password" type="password" required
                            class="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 focus:outline-none sm:text-sm"
                            placeholder="Enter your password" />
                    </div>
                </div>

                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <input id="remember" type="checkbox" v-model="rememberMe"
                            class="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded" />
                        <label for="remember" class="ml-2 block text-sm text-gray-700">Remember me</label>
                    </div>
                    <a href="#" class="text-sm text-emerald-600 hover:text-emerald-500">Forgot password?</a>
                </div>

                <div v-if="error" class="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">
                    {{ error }}
                </div>

                <div>
                    <button type="submit"
                        class="w-full flex justify-center py-2.5 px-4 rounded-lg text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200">
                        Sign in
                    </button>
                </div>
            </form>

            <p class="text-center text-sm text-gray-600">
                Don't have an account?
                <a href="#" class="text-emerald-600 hover:text-emerald-500 font-medium">Create an account</a>
            </p>
        </div>
    </div>
</template>