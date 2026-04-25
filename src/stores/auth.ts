import { defineStore } from "pinia";
import { ref, computed } from "vue";
import router from "@/router";
import type { User, LoginCredentials } from "@/types/auth";

const DEMO_USER: User = {
    id: "u1",
    username: "demouser",
    email: "demo@gamestore.com",
    role: "superadmin",
    createdAt: "2024-01-01T00:00:00Z"
};

export const useAuthStore = defineStore("auth", () => {
    const user = ref<User | null>(null);
    const token = ref<string | null>(null);
    const isLoading = ref(false);
    const error = ref<string | null>(null);

    const isAuthenticated = computed(() => !!token.value && !!user.value);

    function restore() {
        const storedToken = localStorage.getItem("erp_token");
        const storedUser = localStorage.getItem("erp_user");
        if (storedToken && storedUser) {
            token.value = storedToken;
            user.value = JSON.parse(storedUser) as User;
        } else {
            token.value = null;
            user.value = null;
        }
    }

    async function login(creds: LoginCredentials) {
        isLoading.value = true;
        error.value = null;
        await new Promise((r) => setTimeout(r, 600));
        if (creds.username === "demouser" && creds.password === "demouser") {
            const fakeToken = "demo-token-" + Date.now();
            token.value = fakeToken;
            user.value = DEMO_USER;
            localStorage.setItem("erp_token", fakeToken);
            localStorage.setItem("erp_user", JSON.stringify(DEMO_USER));
            isLoading.value = false;
            return true;
        }
        error.value = "Invalid username or password.";
        isLoading.value = false;
        return false;
    }

    function logout() {
        token.value = null;
        user.value = null;
        localStorage.removeItem("erp_token");
        localStorage.removeItem("erp_user");
        router.push("/login");
    }

    return { user, token, isAuthenticated, isLoading, error, restore, login, logout };
});
