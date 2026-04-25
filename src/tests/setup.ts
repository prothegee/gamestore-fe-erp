import { createPinia, setActivePinia } from "pinia";
import { beforeEach } from "vitest";

beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
});
