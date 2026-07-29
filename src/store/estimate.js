// stores/estimate.js
import { defineStore } from "pinia";
import axios from "axios";
import defaultItems from "@/items";

function createDefaultItemList() {
  return defaultItems.map((item) => ({ ...item }));
}

export const useEstimateStore = defineStore("stonePrice", {
  state: () => ({
    price: [
      { color: "cs-201", price: 75 },
      { color: "cs-102", price: 85 },
    ],
    itemList: [],
    priceList: [],
    loading: false,
    error: null,
  }),

  actions: {
    async fetchData() {
      this.loading = true;
      this.error = null;
      this.itemList = createDefaultItemList();
      try {
        const res2 = await axios.get(
          "https://script.google.com/macros/s/AKfycbweY4uKhj-NmmqmaKMD401ePMjVrGEE7_fuYNSmEYAOk4I4pW2garBtDCtYehV-I0oX/exec"
        );
        this.priceList = res2.data;
      } catch (error) {
        this.error = "資料抓取失敗，請稍後再試";
        this.priceList = [];
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
});
