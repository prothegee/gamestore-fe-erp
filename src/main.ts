import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import "./styles/global.css";

const app = createApp(App);
app.use(createPinia());
app.use(router);

// Handle Vite's "Unable to preload CSS" or chunk load errors
// This typically happens when a new version is deployed and old assets are gone
window.addEventListener("error", (e) => {
    if (e.message.includes("Unable to preload CSS") || e.message.includes("Failed to fetch dynamically imported module")) {
        window.location.reload();
    }
}, true);

window.addEventListener("unhandledrejection", (e) => {
    const message = e.reason?.message || "";
    if (message.includes("Unable to preload CSS") || message.includes("Failed to fetch dynamically imported module")) {
        window.location.reload();
    }
});

app.config.errorHandler = (err, _instance, info) => {
    console.error("[App Error]", info, err);
};

app.mount("#app");
