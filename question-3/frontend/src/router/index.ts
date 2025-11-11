import { watch } from "vue";
import { authState } from "@/store/auth";
import { createRouter, createWebHistory } from "vue-router";
import Login from "@/views/Login.vue";
import Register from "@/views/Register.vue";
import Dashboard from "@/views/Dashboard.vue";

const routes = [
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register },
  {
    path: "/dashboard",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true },
  },
  { path: "/:pathMatch(.*)*", redirect: "/login" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  if (!authState.checked) {
    // wait for /me fetching endpoint to finish
    const unwatch = watch(
      () => authState.checked,
      (checked) => {
        if (checked) {
          unwatch();
          handleAuthRedirect(to, next);
        }
      }
    );
  } else {
    handleAuthRedirect(to, next);
  }
});

function handleAuthRedirect(to: any, next: any) {
  const isLogin = authState.isLogin;

  if (to.meta.requiresAuth && !isLogin) {
    // un authenticated user shouldn't access the dashboard page
    return next({ name: "Login" });
  }

  if ((to.name === "Login" || to.name === "Register") && isLogin) {
    // login user cannot access the login/register page
    return next({ name: "Dashboard" });
  }

  next();
}

export default router;
