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
    {{ message }}
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { collection, getDocs, query, where, or } from "firebase/firestore";
import { getDownloadURL, ref as storageRef } from "firebase/storage";
import { db, storage } from "@/firebase";
import { auth } from "@/firebase";
const publicFiles = ref([]);
const selectedFile = ref(null);
const keyword = ref("");
const emit = defineEmits(["load-result"]);
const message = ref("");
const filteredFiles = computed(() => {
  const key = keyword.value.trim().toLowerCase();

  let files = publicFiles.value.filter((file) =>
    file.filename?.toLowerCase().includes(key)
  );
  // console.log("files=", files);
  return files;
});

import { getDoc, doc } from "firebase/firestore";

const fetchPublicFiles = async () => {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    message.value = "尚未登入，無法取得檔案列表";
    return;
  }

  try {
    // 🔍 先取得目前使用者資料
    const userSnap = await getDoc(doc(db, "users", uid));
    if (!userSnap.exists()) {
      console.warn("找不到使用者資料");
      return;
    }

    const userData = userSnap.data();
    const role = userData.role || "guest";
    const group = userData.group || null;
    // console.log("group=", group);
    // ✅ 取得自己的檔案
    const myQuery = query(collection(db, "quotes"), where("owner", "==", uid));
    const mySnapshot = await getDocs(myQuery);
    const myFiles = mySnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        isOwner: true,
      };
    });

    // 🟡 取得同 group 且 role = 'user' 的使用者 UID
    let groupUserUIDs = [];
    if (role !== "guest" && group) {
      const usersQuery = query(
        collection(db, "users"),
        where("role", "==", "user"),
        where("group", "==", group)
      );
      const usersSnap = await getDocs(usersQuery);
      groupUserUIDs = usersSnap.docs
        .map((doc) => doc.id)
        .filter((id) => id !== uid); // 排除自己
    }
    // console.log(groupUserUIDs);
    // ✅ 取得同 group 的公開檔案（最多一次查 10 個）
    // let publicFiles = [];
    if (groupUserUIDs.length > 0) {
      const chunkSize = 10;
      for (let i = 0; i < groupUserUIDs.length; i += chunkSize) {
        const chunk = groupUserUIDs.slice(i, i + chunkSize);
        // console.log(chunk);
        const publicQuery = query(
          collection(db, "quotes"),
          where("isPublic", "==", true),
          where("owner", "in", chunk)
        );
        const publicSnap = await getDocs(publicQuery);

        publicFiles.value.push(
          ...publicSnap.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              isOwner: false,
            };
          })
        );
      }
    }

    // 🧾 合併 & 排序
    publicFiles.value = [...publicFiles.value].sort((a, b) => {
      const t1 = a.createdAt?.seconds || 0;
      const t2 = b.createdAt?.seconds || 0;
      return t2 - t1;
    });
    // console.log("publicFiles=", publicFiles);
  } catch (err) {
    console.error("❌ 載入檔案列表失敗", err);
    message.value = "載入檔案列表失敗";
  }
};

async function handleSelect() {
  const file = selectedFile.value;
  // console.log("file:", file);
  if (!file || !file.filename) return;
  // console.log("user:", auth.currentUser?.uid);
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
