<template>
  <div class="bg-white p-1 rounded-lg shadow-md w-full min-w-0">
    <!-- 頂部選項列 -->
    <div class="flex flex-wrap gap-2 mb-2 items-center text-sm">
      <!-- <input type="checkbox" v-model="isEnabled" class="h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded" /> -->
      <h2 class="font-semibold text-gray-700">一字型</h2>

      <label class="whitespace-nowrap">顏色</label>
      <input
        v-model="form.color"
        type="text"
        class="w-[64px] p-1 border rounded-md focus:ring-1 focus:ring-green-500"
      />

      <label class="whitespace-nowrap">摘要</label>
      <input
        v-model="form.sumary"
        type="text"
        class="w-[80px] p-1 border rounded-md"
      />

      <label class="whitespace-nowrap">單開</label>
      <input
        v-model="form.oneOpen"
        @change="form.duOpen = false"
        type="checkbox"
        class="h-4 w-4"
      />

      <label class="whitespace-nowrap">雙開</label>
      <input
        v-model="form.duOpen"
        @change="form.oneOpen = false"
        type="checkbox"
        class="h-4 w-4"
      />
    </div>

    <!-- 表格改為 Grid -->
    <div class="grid grid-cols-5 gap-2 text-sm">
      <label class="text-gray-600 text-center">長度</label>
      <label class="text-gray-600 text-center">深度</label>
      <label class="text-gray-600 text-center">前沿</label>
      <label class="text-gray-600 text-center">背牆</label>
      <label class="text-gray-600 text-center">倒包</label>

      <input
        v-model.number="form.length"
        type="number"
        class="p-1 border rounded-md"
        min="1"
      />
      <input
        v-model.number="form.depth"
        type="number"
        class="p-1 border rounded-md"
        min="1"
      />
      <input
        v-model.number="form.frontEdge"
        type="number"
        class="p-1 border rounded-md"
        min="1"
      />
      <input
        v-model.number="form.backWall"
        type="number"
        class="p-1 border rounded-md"
        min="1"
      />
      <input
        v-model.number="form.wrapBack"
        type="number"
        class="p-1 border rounded-md"
        min="1"
      />
    </div>

    <!-- 下方選項列 -->
    <div class="flex flex-wrap gap-4 mt-4 text-sm">
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">板材極限 (cm)</label>
        <input
          v-model.number="form.limit"
          type="number"
          class="w-[60px] p-1 border rounded-md"
          min="60"
        />
      </div>
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">單價</label>
        <input
          v-model.number="form.unitPrice"
          type="number"
          class="w-[72px] p-1 border rounded-md"
        />
      </div>
      <div class="flex items-center space-x-1">
        <label class="whitespace-nowrap">備註</label>
        <input
          v-model="form.note"
          type="text"
          class="w-[100px] p-1 border rounded-md"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  name: "One",
  props: {
    sepPrice: { type: Number, default: 750 },
    index: { type: [String, Number], required: true },
    initialValue: { type: Object, default: () => ({}) },
    hondimode: { type: Boolean, default: false },
  },
  emits: ["update-result"],
  setup(props, { emit }) {
    const form = ref({
      length: 100,
      depth: 60,
      frontEdge: 4,
      backWall: 4,
      wrapBack: 0,
      unitPrice: 120,
      color: "CS-201",
      limit: 68,
      sumary: "",
      note: "",
      oneOpen: false,
      duOpen: false,
      hondimode: false,
    });

    const isEnabled = ref(true);
    let isLoading = false;
    const toNumber = (v) => parseFloat(v) || 0;
    const calcOneSide = (
      length,
      depth,
      frontEdge,
      backWall,
      wrapBack,
      limit,
      oneOpen,
      duOpen,
      hondimode
    ) => {
      length = toNumber(length);
      depth = toNumber(depth);
      frontEdge = toNumber(frontEdge);
      backWall = toNumber(backWall);
      wrapBack = toNumber(wrapBack);
      limit = toNumber(limit);

      const thickness = depth + frontEdge + backWall + wrapBack;
      let cmValue = 0;
      let calcSteps = "";
      let area = Math.round((length * thickness) / 900);
      let calcSteps2 = `${length}*(${depth}+${frontEdge}+${backWall}+${wrapBack})/900=${area}平方尺`;
      // console.log("hondimode:", hondimode);
      let frontEdgeLength = length;
      if (oneOpen) frontEdgeLength = depth + length;
      if (duOpen) frontEdgeLength = depth * 2 + length;
      const addStr = [frontEdge, backWall, wrapBack]
        .filter((w) => w > 0)
        .map((w) => `+${w}`)
        .join("");
      if (hondimode) {
        if (thickness < 48 && depth < 40) {
          cmValue = length * 0.85;
          calcSteps = `${length}*0.85=${cmValue.toFixed(0)}公分`;
          if (oneOpen) {
            cmValue = (length + frontEdge) * 0.85;
            calcSteps = `(${length}+${frontEdge})*0.85=${cmValue.toFixed(
              0
            )} 公分`;
          }
          if (duOpen) {
            cmValue = (length + frontEdge + frontEdge) * 0.85;
            calcSteps = `(${length}+${frontEdge}+${frontEdge})*0.85=${cmValue.toFixed(
              0
            )} 公分`;
          }
        } else if (thickness <= limit) {
          if (oneOpen) {
            cmValue = Math.round(frontEdge + length);
            calcSteps = `${frontEdge}+${length}=${cmValue}公分`;
          } else if (duOpen) {
            cmValue = Math.round(frontEdge * 2 + length);
            calcSteps = `${frontEdge}+${frontEdge}+${length}=${cmValue}公分`;
          } else {
            cmValue = Math.round(length);
            calcSteps = `${length}=${cmValue}公分`;
          }
        } else {
          //超出limit
          if (oneOpen) {
            cmValue = Math.round(((frontEdge + length) * thickness) / 60);
            calcSteps = `(${frontEdge}+${length})*(${depth}${addStr})/60=${cmValue}公分`;
          } else if (duOpen) {
            cmValue = Math.round(((frontEdge * 2 + length) * thickness) / 60);
            calcSteps = `(${frontEdge}+${frontEdge}+${length})*(${depth}${addStr}/60)=${cmValue}公分`;
          } else {
            cmValue = Math.round((length * thickness) / 60);
            calcSteps = `${length}*(${depth}${addStr}/60)=${cmValue}公分`;
          }
        }
      } else {
        ///非弘第模式
        if (thickness < 48 && depth < 40) {
          cmValue = length * 0.85;
          calcSteps = `${length}*0.85=${cmValue.toFixed(0)}公分`;
          if (oneOpen) {
            cmValue = (length + frontEdge) * 0.85;
            calcSteps = `(${length}+${frontEdge})*0.85=${cmValue.toFixed(
              0
            )} 公分`;
          }
          if (duOpen) {
            cmValue = (length + frontEdge + frontEdge) * 0.85;
            calcSteps = `(${length}+${frontEdge}+${frontEdge})*0.85=${cmValue.toFixed(
              0
            )} 公分`;
          }
        } else if (thickness <= limit) {
          if (duOpen) {
            cmValue = Math.round(frontEdge * 2 + length);
            calcSteps = `${frontEdge}+${frontEdge}+${length}=${cmValue}公分`;
          } else if (oneOpen) {
            cmValue = Math.round(frontEdge + length);
            calcSteps = `${frontEdge}+${length}=${cmValue}公分`;
          } else {
            cmValue = Math.round(length);
            calcSteps = `${length}=${cmValue}公分`;
          }
        } else {
          //超出limit
          if (oneOpen) {
            cmValue = Math.round(((frontEdge + length) * (thickness - 8)) / 60);
            calcSteps = `(${frontEdge}+${length})*(${depth}${addStr}-8)/60=${cmValue}公分`;
          } else if (duOpen) {
            cmValue = Math.round(
              ((frontEdge * 2 + length) * (thickness - 8)) / 60
            );
            calcSteps = `(${frontEdge}+${frontEdge}+${length})*(${depth}${addStr}-8)/60=${cmValue}公分`;
          } else {
            cmValue = Math.round((length * (thickness - 8)) / 60);
            calcSteps = `${length}*(${depth}${addStr}-8)/60=${cmValue}公分`;
          }
        }
      }
      return { cmValue, calcSteps, area, calcSteps2, frontEdgeLength };
    };

    // ✅ ⬇ calculate 提前定義在所有 watch 之前
    const calculate = () => {
      if (isLoading) return;

      if (!isEnabled.value) {
        emit("update-result", {
          index: props.index,
          isEnabled: false,
        });
        return;
      }

      const f = form.value;
      const { cmValue, calcSteps, area, calcSteps2, frontEdgeLength } =
        calcOneSide(
          f.length,
          f.depth,
          f.frontEdge,
          f.backWall,
          f.wrapBack,
          f.limit,
          f.oneOpen,
          f.duOpen,
          f.hondimode
        );

      const roundedValue = Math.round(cmValue);
      const subtotal = roundedValue * f.unitPrice;
      const subtotal2 = area * props.sepPrice;

      emit("update-result", {
        index: props.index,
        isEnabled: true,
        ...f,
        roundedCentimeters: roundedValue,
        subtotal: Math.round(subtotal),
        calculationSteps: calcSteps.trim(),
        calculationSteps2: calcSteps2.trim(),
        area,
        subtotal2: Math.round(subtotal2),
        frontEdgeLength,
      });
    };

    // ✅ 當初始值有變動時載入資料
    watch(
      () => props.initialValue,
      (val) => {
        console.log("🟡 received initialValue", val); // 加這行
        if (val) {
          isLoading = true;
          form.value = {
            length: 100,
            depth: 60,
            frontEdge: 4,
            backWall: 4,
            wrapBack: 0,
            unitPrice: 120,
            color: "CS-201",
            limit: 68,
            sumary: "",
            note: "",
            oneOpen: false,
            duOpen: false,
            hondimode: props.hondimode,
            ...val,
          };
          isEnabled.value = val.isEnabled ?? false;
          isLoading = false;

          if (isEnabled.value) calculate();
        }
      },
      { immediate: true }
    );

    // ✅ 勾選狀態變更時也要計算
    watch(isEnabled, (val) => {
      if (!isLoading) {
        calculate();
      } else if (!val) {
        emit("update-result", {
          index: props.index,
          isEnabled: false,
        });
      }
    });

    // ✅ 表單資料變更時執行計算
    watch(
      form,
      () => {
        if (isEnabled.value && !isLoading) {
          calculate();
        }
      },
      { deep: true }
    );
    // ✅ 🆕 加入這段 watch props.hondimode
    watch(
      () => props.hondimode,
      (newVal) => {
        form.value.hondimode = newVal;
        if (isEnabled.value && !isLoading) {
          calculate();
        }
      },
      { immediate: true }
    );

    return {
      form,
      isEnabled,
      calculate,
      isLoading,
    };
  },
};
</script>

<style scoped>
:deep(.one-card-container) {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
}

@media (min-width: 768px) {
  :deep(.one-card-container) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
