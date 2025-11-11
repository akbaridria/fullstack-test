<script setup lang="ts">
// imports
import UserProfile from './components/UserProfile.vue';
import ThemeProvider from './providers/ThemeProvider.vue';
import { Toaster } from '@/components/ui/sonner'
import 'vue-sonner/style.css'

</script>

<template>
  <ThemeProvider>
    <UserProfile />
    <Toaster position="top-center" />
  </ThemeProvider>
</template>

<style scoped></style>
