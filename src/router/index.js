import { createRouter, createWebHashHistory } from "vue-router";
import Price from "../components/FuturePrice.vue";
import DrawOne from "../components/DrawOne.vue";
import Estimate from "../components/Estimate.vue";

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
  {
    path: "/price",
    name: "Price",
    component: () => import("../components/FuturePrice.vue"),
    meta: { title: "期貨估價" },
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
export default router;
