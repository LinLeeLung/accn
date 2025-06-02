import { createRouter, createWebHashHistory } from "vue-router";
import Q from "../components/Q.vue";
import DrawOne from "../components/DrawOne.vue";

const routes = [
  {
    path: "/drawone",
    name: "DrawOne",
    component: () => import("../components/DrawOne.vue"),
  },
  {
    path: "/drawiland",
    name: "DrawIland.vue",
    component: () => import("../components/DrawIland.vue"),
  },
  {
    path: "/",
    name: "QMain",
    component: Q,
  },
  {
    path: "/share",
    name: "ShareView",
    component: () => import("../components/ShareView.vue"),
  },
  {
    path: "/arc",
    name: "Test.vue",
    component: () => import("../components/Test.vue"),
  },
];

const router = createRouter({
  history: createWebHashHistory("/accn/"), // ✅ 改用 Hash 模式並指定 base
  routes,
});

export default router;
