<template>
    <RouterView />
    <ToastNotification />
</template>

<script setup lang="ts">
import { RouterView } from "vue-router";
import ToastNotification from "@/components/ui/ToastNotification.vue";
</script>
