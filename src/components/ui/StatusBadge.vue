<template>
    <span class="badge" :class="`badge--${color}`">{{ label }}</span>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ status: string }>();

const map: Record<string, { label: string; color: string }> = {
    active: { label: "Active", color: "green" },
    archived: { label: "Archived", color: "gray" },
    out_of_stock: { label: "Out of Stock", color: "red" },
    pending: { label: "Pending", color: "yellow" },
    processing: { label: "Processing", color: "blue" },
    shipped: { label: "Shipped", color: "teal" },
    delivered: { label: "Delivered", color: "green" },
    completed: { label: "Completed", color: "green" },
    cancelled: { label: "Cancelled", color: "red" },
    requested: { label: "Requested", color: "yellow" },
    approved: { label: "Approved", color: "teal" },
    received: { label: "Received", color: "blue" },
    refunded: { label: "Refunded", color: "green" },
    rejected: { label: "Rejected", color: "red" },
    suspended: { label: "Suspended", color: "red" },
    flagged: { label: "Flagged", color: "orange" },
    draft: { label: "Draft", color: "gray" },
    sent: { label: "Sent", color: "blue" },
    confirmed: { label: "Confirmed", color: "teal" },
    closed: { label: "Closed", color: "gray" },
    scheduled: { label: "Scheduled", color: "blue" },
    expired: { label: "Expired", color: "gray" },
    disabled: { label: "Disabled", color: "gray" }
};

const resolved = computed(() => map[props.status] ?? { label: props.status, color: "gray" });
const label = computed(() => resolved.value.label);
const color = computed(() => resolved.value.color);
</script>

<style scoped>
.badge {
    display: inline-flex;
    align-items: center;
    padding: 2px 10px;
    border-radius: 999px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    white-space: nowrap;
}
.badge--green {
    background: #c6f6d5;
    color: #276749;
}
.badge--red {
    background: #fed7d7;
    color: #9b2c2c;
}
.badge--yellow {
    background: #fefcbf;
    color: #744210;
}
.badge--blue {
    background: #bee3f8;
    color: #2a69ac;
}
.badge--teal {
    background: #b2f5ea;
    color: #285e61;
}
.badge--orange {
    background: #feebc8;
    color: #7b341e;
}
.badge--gray {
    background: #e2e8f0;
    color: #4a5568;
}
</style>
