<template>
  <div class="p-4 text-sm">
    <div v-if="store.loading" class="text-blue-600">🔄 載入中...</div>
    <div v-else-if="store.error" class="text-red-600">❌ {{ store.error }}</div>
    <div v-else>
      <h2 class="font-semibold mb-2">📦 單價清單</h2>
      <div v-if="filteredPriceList.length === 0">沒有有效資料</div>
      <ul class="list-disc ml-6 space-y-1">
        <li v-for="(item, index) in filteredPriceList" :key="item.name + index">
          {{ item.name }}：{{ item.price }} 元
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useEstimateStore } from "@/store/estimate";

const store = useEstimateStore();

onMounted(() => {
  store.fetchData();
});

// ✅ 加入過濾條件：name 和 price 都要有值
const filteredPriceList = computed(() =>
  store.priceList.filter(
    (item) =>
      item.name?.toString().trim() !== "" &&
      item.price !== undefined &&
      item.price !== null &&
      item.price.toString().trim() !== ""
  )
);
</script>
