import { authState } from '@/store/auth';
import { fetchClient } from './fetch-client';

export async function register(username: string, password: string) {
  const res = await fetch('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Login failed');

  const data = await res.json();
  authState.isLogin = true;
  authState.user = { id: data.id, username: data.username };
  return data;
}

export async function login(username: string, password: string) {
  const res = await fetch('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error('Login failed');

  const data = await res.json();
  authState.isLogin = true;
  authState.user = { id: data.id, username: data.username };
  return data;
}

export async function logout() {
  await fetchClient('/logout', { method: 'POST', credentials: 'include' });
  authState.isLogin = false;
  authState.user = null;
}

export async function refreshToken(): Promise<boolean> {
  try {
    const res = await fetch('http://localhost:3000/refresh', { method: 'POST', credentials: 'include' });
    if (!res.ok) throw new Error('Refresh failed');

    const data = await res.json();
    authState.isLogin = true;
    authState.user = { id: data.id, username: data.username };
    return true;
  } catch {
    authState.isLogin = false;
    authState.user = null;
    return false;
  }
}
