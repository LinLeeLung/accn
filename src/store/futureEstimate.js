import { defineStore } from "pinia";
import axios from "axios";
export const useEstimateStore = defineStore("estimate", {
  state: () => ({
    error: null,
    loading: false,
    slabCount: 0, // 大板數量
    totalCm: 0, // 公分總長度
    wagePerCm: 80, // 每公分加工費
    selectedStone: "",
    unitStonePrice: 0, // 每片石材價格
    pricePerCm: 0,
    stoneList: [],
    calcSteps: "", // 新增這一行
  }),

  actions: {
    selectStone(name) {
      const stone = this.stoneList.find((s) => s.name === name);
      if (stone) {
        this.selectedStone = stone.name;
        this.unitStonePrice = stone.price;
      }
    },
    calculatePricePerCm() {
      if (this.totalCm > 0) {
        const materialCostPerCm =
          (this.slabCount * this.unitStonePrice) / this.totalCm;
        this.pricePerCm = this.wagePerCm + materialCostPerCm;

        // ✅ 計算過程說明
        this.calcSteps =
          `公式：(${this.slabCount} × ${this.unitStonePrice}) ÷ ${this.totalCm} + ${this.wagePerCm}\n` +
          `= ${materialCostPerCm.toFixed(2)} + ${
            this.wagePerCm
          } = ${this.pricePerCm.toFixed(2)} 元/cm`;
      } else {
        this.pricePerCm = 0;
        this.calcSteps = "請輸入有效的總公分數。";
      }
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const res2 = await axios.get(
          "https://script.google.com/macros/s/AKfycbweY4uKhj-NmmqmaKMD401ePMjVrGEE7_fuYNSmEYAOk4I4pW2garBtDCtYehV-I0oX/exec"
        );
        this.stoneList = res2.data.filter((item) => item.name !== "");
      } catch (error) {
        this.error = "資料抓取失敗，請稍後再試";
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
  },
  getters: {
    totalEstimate(state) {
      return state.totalCm * state.pricePerCm;
    },
  },
});
