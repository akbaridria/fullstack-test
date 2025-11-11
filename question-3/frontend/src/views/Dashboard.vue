<script setup lang="ts">
import { authState } from "@/store/auth";
import { useRouter } from "vue-router";
import { fetchClient } from "@/api/fetch-client";

const router = useRouter();

const logout = async () => {
    try {
        await fetchClient("/logout", {
            method: "POST",
            credentials: "include",
        });
    } catch (err) {
        console.error("Logout failed:", err);
    } finally {
        authState.isLogin = false;
        authState.user = null;
        router.push({ name: "Login" });
    }
};
</script>

<template>
    <div>
        <div v-if="authState.isLogin && authState.user">
            <h2>Welcome, {{ authState.user.username }}</h2>
            <p>Your ID: {{ authState.user.id }}</p>
            <button @click="logout">Logout</button>
        </div>
        <div v-else>
            <p>Loading user info...</p>
        </div>
    </div>
</template>
