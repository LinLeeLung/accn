<template>
  <div class="mt-6">
    <h3 class="text-lg font-semibold text-gray-800 mb-2">
      <span class="inline-block w-5 h-5 bg-green-600 rounded-full mr-2"></span>
      公開報價單清單
    </h3>
    <input
      type="text"
      v-model="keyword"
      placeholder="輸入關鍵字篩選檔案"
      class="mb-2 p-1 border rounded text-sm w-full"
    />
    <select
      v-model="selectedFile"
      @change="handleSelect"
      class="p-2 border rounded-md text-sm w-full bg-green-500 text-white"
    >
      <option value="">請選擇公開檔案</option>
      <option v-for="file in filteredFiles" :key="file.id" :value="file">
        {{ file.filename }}（{{
          file.ownerName || file.ownerEmail || file.owner || "未知"
        }}）
      </option>
    </select>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, query, where, or } from "firebase/firestore";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { db, storage } from "@/firebase";
import { auth } from "@/firebase"
const publicFiles = ref([]);
const selectedFile = ref(null);
const keyword = ref("");
const emit = defineEmits(["load-result"]);

const filteredFiles = computed(() => {
  const key = keyword.value.trim().toLowerCase();
  return publicFiles.value.filter((file) =>
    file.filename?.toLowerCase().includes(key)
  );
});

async function fetchPublicFiles() {
  try {
    const q = query(
      collection(db, "quotes"),
      or(where("isPublic", "==", true), where("public", "==", true))
    );
    const snapshot = await getDocs(q);
    publicFiles.value = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (err) {
    console.error("❌ 讀取公開檔案失敗", err);
  }
}

async function handleSelect() {
  const file = selectedFile.value;
  console.log("file:", file)
  if (!file || !file.filename) return;
   console.log("user:" ,auth.currentUser?.uid)
  try {
    const url = await getDownloadURL(
      storageRef(storage, `quotes/${file.owner}/${file.filename}`)
    );
    const res = await fetch(url);
    if (!res.ok) throw new Error("下載失敗");
    const data = await res.json();

    emit("load-result", {
      ...data,
      fromPublic: true,
      filename: file.filename,
    });
  } catch (err) {
    console.error("❌ 載入失敗", err);
    alert("載入檔案失敗");
  }
}

onMounted(fetchPublicFiles);
</script>
