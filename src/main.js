import { createApp } from "vue";

import App from "./App.vue";
import "./assets/style.css";

import router from "./router";
//引入pinia
import { createPinia } from "pinia";
import { auth } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
//創建 pinia
const pinia = createPinia();
//使用 pinia

// 等待 Firebase 登入狀態確認後才啟動 App
let app;
onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App);
    app.use(pinia);
    app.use(router).mount("#app");
  }
});
