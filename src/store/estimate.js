import { defineStore } from "pinia";
export const useEstimateStore = defineStore("stonePrice", {
  //真正存儲數據的地方
  state() {
    return {
      price: [
        { color: "cs-201", price: 75 },
        { color: "cs-102", price: 85 },
      ],
    };
  },
});
