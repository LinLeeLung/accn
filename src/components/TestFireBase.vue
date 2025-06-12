<script setup>
import { rtdb } from "@/firebase";
import { ref, set } from "firebase/database"; // ✅ 從原生 firebase 套件引入

function writeTestData() {
  const dataRef = ref(rtdb, "test/hello");
  set(dataRef, {
    message: "Firebase 連線成功！",
    time: new Date().toISOString(),
  })
    .then(() => {
      alert("寫入成功");
    })
    .catch((error) => {
      console.error("寫入失敗:", error);
    });
}
</script>

<template>
  <div class="p-4">
    <button
      @click="writeTestData"
      class="bg-green-500 text-white px-4 py-2 rounded"
    >
      寫入測試資料到 Firebase
    </button>
  </div>
</template>
