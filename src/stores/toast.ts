import { defineStore } from "pinia";
import { ref } from "vue";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
    id: number;
    type: ToastType;
    message: string;
}

let _id = 0;

export const useToastStore = defineStore("toast", () => {
    const toasts = ref<Toast[]>([]);

    function add(payload: { type: ToastType; message: string }, duration = 4000) {
        const id = ++_id;
        toasts.value.push({ id, ...payload });
        setTimeout(() => remove(id), duration);
    }

    function remove(id: number) {
        toasts.value = toasts.value.filter((t) => t.id !== id);
    }

    return { toasts, add, remove };
});
