import { createRouter, createWebHistory } from "vue-router";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "login",
      component: () => import("./views/Login.vue"),
    },
    {
      path: "/admin",
      name: "admin",
      component: () => import("./views/Admin.vue"),
    },
    {
      path: "/ticket",
      name: "ticket",
      component: () => import("./views/AddTicket.vue"),
    },
    {
      path: "/courier",
      name: "courier",
      component: () => import("./views/Courier.vue"),
    },
    {
      path: "/clerk",
      name: "clerk",
      component: () => import("./views/Clerk.vue"),
    },
  ],
});

export default router;
