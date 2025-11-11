import { reactive } from "vue";

interface User {
  id: string;
  username: string;
}

export const authState = reactive({
  isLogin: false,
  user: null as User | null,
  checked: false,
});
