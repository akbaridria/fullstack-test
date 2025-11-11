<script setup lang="ts">
import { onMounted } from 'vue';
import { authState } from '@/store/auth';
import { fetchClient } from '@/api/fetch-client';

onMounted(async () => {
  try {
    const res = await fetchClient('/me', { credentials: "include" });
    if (res.ok) {
      const data = await res.json();
      authState.isLogin = true;
      authState.user = { id: data.id, username: data.username };
    } else {
      authState.isLogin = false;
      authState.user = null;
    }
  } catch {
    authState.isLogin = false;
    authState.user = null;
  } finally {
    authState.checked = true;
  }
});
</script>

<template>
  <div v-if="!authState.checked">Loading...</div>
  <router-view v-else></router-view>
</template>
