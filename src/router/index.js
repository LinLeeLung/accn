import { createRouter, createWebHashHistory } from "vue-router";
import Price from "../components/FuturePrice.vue";
import DrawOne from "../components/DrawOne.vue";
import Estimate from "../components/Estimate.vue";
import { auth } from "@/firebase"; // ✅ 加這行
const routes = [
  {
    path: "/drawone",
    name: "DrawOne",
    component: () => import("../components/DrawOne.vue"),
    meta: { title: "一字型繪圖" },
  },
  {
    path: "/drawiland",
    name: "DrawIland.vue",
    component: () => import("../components/DrawIland.vue"),
  },
  {
    path: "/",
    name: "QMain",
    component: Estimate,
    meta: { requiresAuth: true },
  },
  {
    path: "/share",
    name: "ShareView",
    component: () => import("../components/ShareView.vue"),
    meta: { title: "分享估價" },
  },
  {
    path: "/arc",
    name: "Test.vue",
    component: () => import("../components/Test.vue"),
  },
  {
    path: "/price",
    name: "Price",
    component: () => import("../components/FuturePrice.vue"),
    meta: { title: "期貨估價" },
  },

  {
    path: "/login",
    name: "Login",
    component: () => import("../components/LoginGoogle.vue"),
    meta: { title: "登入" },
  },
];

const router = createRouter({
  history: createWebHashHistory("/accn/"), // ✅ 改用 Hash 模式並指定 base
  routes,
});
router.afterEach((to) => {
  const defaultTitle = "估價系統";
  document.title = to.meta.title || defaultTitle;
});
import { getAuth } from "firebase/auth";
// router/index.js
router.beforeEach((to, from, next) => {
  const user = auth.currentUser;

  const requiresAuth = to.meta.requiresAuth;

  if (requiresAuth && !user) {
    // 未登入，先記錄原始目的地，然後跳去 login
    next({
      path: "/login",
      query: { redirect: to.fullPath },
    });
  } else {
    next();
  }
});

export default router;
