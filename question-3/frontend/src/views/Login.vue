<script lang="ts" setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import validator from "validator";
import { authState } from "@/store/auth";
import { fetchClient } from "@/api/fetch-client";

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMsg = ref("");

const handleSubmit = async (e: Event) => {
  e.preventDefault();
  errorMsg.value = "";

  const trimmedUsername = username.value.trim();
  if (!/^[A-Za-z0-9_]+$/.test(trimmedUsername)) {
    errorMsg.value =
      "Username can only contain letters, numbers, and underscore.";
    return false;
  }

  if (!validator.isLength(password.value, { min: 6, max: 30 })) {
    errorMsg.value = "Password must be 6-30 characters.";
    return;
  }

  try {
    const res = await fetchClient("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: username.value,
        password: password.value,
      }),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Login failed");
    }

    const data = await res.json();
    authState.isLogin = true;
    authState.user = { id: data.data.id, username: data.data.username };

    router.push("/dashboard");
  } catch (err: any) {
    errorMsg.value = err.message;
  }
};
</script>

<template>
  <div>
    <h2>Login</h2>
    <form @submit="handleSubmit">
      <div v-if="errorMsg" style="color: red">{{ errorMsg }}</div>

      <div>
        <label>Username</label>
        <input v-model="username" placeholder="Enter username" />
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          v-model="password"
          placeholder="Enter password"
        />
      </div>

      <button type="submit">Login</button>
    </form>

    <p>
      Don't have an account? <router-link to="/register">Register</router-link>
    </p>
  </div>
</template>
