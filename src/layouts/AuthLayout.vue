<template>
    <div class="min-h-screen bg-white flex items-center justify-center p-4">
        <div class="w-full max-w-md">
            <div class="bg-white rounded-xl shadow-lg border border-gray-100">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineOptions({
    name: 'AuthLayout'
})
</script>