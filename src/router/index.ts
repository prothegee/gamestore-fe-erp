import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/login",
            name: "login",
            component: () => import("@/views/auth/LoginView.vue"),
            meta: { public: true }
        },
        {
            path: "/",
            component: () => import("@/layouts/AppLayout.vue"),
            children: [
                {
                    path: "",
                    name: "dashboard",
                    component: () => import("@/views/DashboardView.vue")
                },
                {
                    path: "products",
                    name: "products",
                    component: () => import("@/views/products/ProductsView.vue")
                },
                {
                    path: "products/:id",
                    name: "product-detail",
                    component: () => import("@/views/products/ProductDetailView.vue")
                },
                {
                    path: "orders",
                    name: "orders",
                    component: () => import("@/views/orders/OrdersView.vue")
                },
                {
                    path: "orders/:id",
                    name: "order-detail",
                    component: () => import("@/views/orders/OrderDetailView.vue")
                },
                {
                    path: "customers",
                    name: "customers",
                    component: () => import("@/views/customers/CustomersView.vue")
                },
                {
                    path: "suppliers",
                    name: "suppliers",
                    component: () => import("@/views/suppliers/SuppliersView.vue")
                },
                {
                    path: "promotions",
                    name: "promotions",
                    component: () => import("@/views/promotions/PromotionsView.vue")
                },
                {
                    path: "reports",
                    name: "reports",
                    component: () => import("@/views/reports/ReportsView.vue")
                },
                {
                    path: "media",
                    name: "media",
                    component: () => import("@/views/media/MediaView.vue")
                },
                {
                    path: "notifications",
                    name: "notifications",
                    component: () => import("@/views/notifications/NotificationsView.vue")
                },
                {
                    path: "settings",
                    name: "settings",
                    component: () => import("@/views/settings/SettingsView.vue")
                },
                {
                    path: "admin",
                    name: "admin",
                    component: () => import("@/views/admin/AdminView.vue"),
                    meta: { roles: ["superadmin"] }
                }
            ]
        },
        { path: "/:pathMatch(.*)*", redirect: "/" }
    ]
});

router.beforeEach((to) => {
    const auth = useAuthStore();
    auth.restore();

    if (!to.meta.public && !auth.isAuthenticated) return "/login";
    if (to.name === "login" && auth.isAuthenticated) return "/";

    const roles = to.meta.roles as string[] | undefined;
    if (roles && auth.user && !roles.includes(auth.user.role)) return "/";

    return true;
});

export default router;
