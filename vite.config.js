import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import postcss from "@tailwindcss/postcss";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [vue()],
  base: "/accn/", // ✅這裡要設定正確 repo 名
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  css: {
    postcss: {
      plugins: [postcss()],
    },
  },
});
