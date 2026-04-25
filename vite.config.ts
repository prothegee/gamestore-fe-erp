/// <reference types="vitest" />
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
    publicDir: "public",
    base: "/",
    plugins: [vue(), vueJsx()],
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url))
        }
    },
    server: {
        port: 9006
    },
    test: {
        environment: "happy-dom",
        globals: true,
        setupFiles: ["./src/tests/setup.ts"],
        exclude: ["**/node_modules/**", "**/dist/**", "**/tests/e2e/**"]
    }
});
