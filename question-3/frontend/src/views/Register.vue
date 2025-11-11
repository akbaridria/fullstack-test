<script lang="ts" setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import validator from 'validator';
import { fetchClient } from '@/api/fetch-client';

const router = useRouter();
const username = ref('');
const password = ref('');
const confirmPassword = ref('');
const errorMsg = ref('');
const successMsg = ref('');

const validateInputs = () => {
  const trimmedUsername = username.value.trim();

  if (!/^[A-Za-z0-9_]+$/.test(trimmedUsername)) {
    errorMsg.value = 'Username can only contain letters, numbers, and underscore.';
    return false;
  }

  if (!validator.isLength(password.value, { min: 6, max: 30 })) {
    errorMsg.value = 'Password must be 6-30 characters.';
    return false;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Passwords do not match.';
    return false;
  }

  errorMsg.value = '';
  return true;
};

const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!validateInputs()) return;

    try {
        const res = await fetchClient('/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ username: username.value, password: password.value }),
        });

        if (!res.ok) {
            const data = await res.json();
            throw new Error(data.message || 'Registration failed');
        }

        successMsg.value = 'Registration successful! Redirecting to login...';
        setTimeout(() => router.push('/login'), 1500);
    } catch (err: any) {
        errorMsg.value = err.message;
    }
};
</script>

<template>
    <div>
        <h2>Register</h2>
        <form @submit="handleSubmit">
            <div v-if="errorMsg" style="color:red">{{ errorMsg }}</div>
            <div v-if="successMsg" style="color:green">{{ successMsg }}</div>

            <div>
                <label>Username</label>
                <input v-model="username" placeholder="Enter username" />
            </div>

            <div>
                <label>Password</label>
                <input type="password" v-model="password" placeholder="Enter password" />
            </div>

            <div>
                <label>Confirm Password</label>
                <input type="password" v-model="confirmPassword" placeholder="Confirm password" />
            </div>

            <button type="submit">Register</button>
        </form>

        <p>
            Already have an account? <router-link to="/login">Login</router-link>
        </p>
    </div>
</template>
