<template>
    <div class="login-page">
        <div class="login-card">
            <div class="login-card__brand">
                <div class="login-card__logo">GS</div>
                <h1 class="login-card__title">GameStore ERP</h1>
                <p class="login-card__sub">Operations Management System</p>
            </div>

            <form class="login-form" @submit.prevent="submit">
                <FormInput
                    v-model="creds.username"
                    label="Username"
                    placeholder="Enter username"
                    required
                    :error="authStore.error || undefined"
                />
                <FormInput
                    v-model="creds.password"
                    label="Password"
                    type="password"
                    placeholder="Enter password"
                    required
                />

                <div class="login-form__demo">
                    <AppIcon name="notifications" :size="13" />
                    Demo credentials: <strong>demouser / demouser</strong>
                </div>

                <button class="login-form__submit" type="submit" :disabled="authStore.isLoading">
                    <span v-if="authStore.isLoading" class="login-form__spinner" />
                    <span v-else>Sign In</span>
                </button>
            </form>
        </div>

        <div class="login-bg" />
    </div>
</template>

<script setup lang="ts">
import { reactive } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import FormInput from "@/components/ui/FormInput.vue";
import AppIcon from "@/components/ui/AppIcon.vue";

const authStore = useAuthStore();
const router = useRouter();

const creds = reactive({ username: "", password: "" });

async function submit() {
    const ok = await authStore.login(creds);
    if (ok) router.push("/");
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--color-bg);
    position: relative;
    overflow: hidden;
}
.login-bg {
    position: absolute;
    inset: 0;
    background: linear-gradient(
        135deg,
        var(--color-primary) 0%,
        var(--color-secondary) 50%,
        var(--color-accent) 100%
    );
    opacity: 0.08;
    z-index: 0;
}
.login-card {
    background: var(--color-surface);
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-lg);
    padding: 40px;
    width: 380px;
    position: relative;
    z-index: 1;
}
.login-card__brand {
    text-align: center;
    margin-bottom: 32px;
}
.login-card__logo {
    width: 52px;
    height: 52px;
    border-radius: 12px;
    background: var(--color-primary);
    color: var(--color-warm);
    font-size: 18px;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 14px;
}
.login-card__title {
    font-size: 22px;
    font-weight: 800;
    color: var(--color-text-primary);
    margin-bottom: 4px;
}
.login-card__sub {
    font-size: 13px;
    color: var(--color-text-muted);
}
.login-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}
.login-form__demo {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    color: var(--color-text-muted);
    background: var(--color-surface-2);
    border: 1px solid var(--color-border-light);
    border-radius: var(--border-radius);
    padding: 8px 12px;
}
.login-form__submit {
    width: 100%;
    height: 42px;
    background: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: var(--border-radius);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: opacity var(--transition);
    margin-top: 4px;
}
.login-form__submit:hover:not(:disabled) {
    opacity: 0.88;
}
.login-form__submit:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}
.login-form__spinner {
    width: 18px;
    height: 18px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
}
@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}
</style>
