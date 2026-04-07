<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "vue-router";

const router = useRouter();
const users = ref([]);
const loading = ref(true);
const isAdmin = ref(false);
const currentUser = ref(null);
const roleOptions = ["guest", "user", "admin"];

async function checkAdmin(user) {
  if (!user) {
    router.push("/login");
    return;
  }
  currentUser.value = user;
  // 從 Firestore 檢查角色是否為 admin
  const { getDoc } = await import("firebase/firestore");
  const snap = await getDoc(doc(db, "users", user.uid));
  if (snap.exists() && snap.data().role === "admin") {
    isAdmin.value = true;
    await fetchUsers();
  } else {
    isAdmin.value = false;
    loading.value = false;
  }
}

async function fetchUsers() {
  loading.value = true;
  try {
    const snap = await getDocs(collection(db, "users"));
    users.value = snap.docs.map((d) => ({
      uid: d.id,
      ...d.data(),
      _dirty: false,
    }));
  } catch (e) {
    alert("載入使用者失敗：" + e.message);
  }
  loading.value = false;
}

async function saveUser(u) {
  try {
    await updateDoc(doc(db, "users", u.uid), {
      role: u.role || "guest",
      group: u.group || "",
    });
    u._dirty = false;
    alert("✅ 已儲存 " + (u.name || u.email));
  } catch (e) {
    alert("儲存失敗：" + e.message);
  }
}

function markDirty(u) {
  u._dirty = true;
}

function formatDate(ts) {
  if (!ts?.seconds) return "—";
  return new Date(ts.seconds * 1000).toLocaleString("zh-TW");
}

onMounted(() => {
  onAuthStateChanged(auth, (u) => {
    checkAdmin(u);
  });
});
</script>

<template>
  <div class="min-h-screen bg-gray-50 p-4">
    <div class="max-w-4xl mx-auto">
      <div class="flex items-center justify-between mb-4">
        <h1 class="text-xl font-bold">🔧 管理後台</h1>
        <button
          @click="router.push('/')"
          class="text-sm bg-gray-200 px-3 py-1 rounded hover:bg-gray-300"
        >
          ← 返回首頁
        </button>
      </div>

      <div v-if="loading" class="text-center py-10 text-gray-500">
        載入中...
      </div>

      <div v-else-if="!isAdmin" class="text-center py-10">
        <p class="text-red-500 text-lg font-bold">⛔ 無管理權限</p>
        <p class="text-gray-500 mt-2">僅限管理員存取此頁面</p>
        <button
          @click="router.push('/')"
          class="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          返回首頁
        </button>
      </div>

      <div v-else>
        <p class="text-sm text-gray-500 mb-3">共 {{ users.length }} 位使用者</p>

        <div class="overflow-x-auto">
          <table class="w-full bg-white rounded shadow text-sm">
            <thead class="bg-gray-100">
              <tr>
                <th class="px-3 py-2 text-left">名稱</th>
                <th class="px-3 py-2 text-left">Email</th>
                <th class="px-3 py-2 text-left">角色</th>
                <th class="px-3 py-2 text-left">群組</th>
                <th class="px-3 py-2 text-left">最後登入</th>
                <th class="px-3 py-2 text-center">操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="u in users"
                :key="u.uid"
                class="border-t hover:bg-gray-50"
              >
                <td class="px-3 py-2">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="u.photo"
                      :src="u.photo"
                      class="w-6 h-6 rounded-full"
                    />
                    <span>{{ u.name || "—" }}</span>
                  </div>
                </td>
                <td class="px-3 py-2 text-gray-600">{{ u.email }}</td>
                <td class="px-3 py-2">
                  <select
                    v-model="u.role"
                    @change="markDirty(u)"
                    class="border rounded px-2 py-1 text-sm"
                  >
                    <option v-for="r in roleOptions" :key="r" :value="r">
                      {{ r }}
                    </option>
                  </select>
                </td>
                <td class="px-3 py-2">
                  <input
                    v-model="u.group"
                    @input="markDirty(u)"
                    class="border rounded px-2 py-1 w-24 text-sm"
                    placeholder="群組"
                  />
                </td>
                <td class="px-3 py-2 text-gray-500 text-xs">
                  {{ formatDate(u.lastLogin) }}
                </td>
                <td class="px-3 py-2 text-center">
                  <button
                    v-if="u._dirty"
                    @click="saveUser(u)"
                    class="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                  >
                    儲存
                  </button>
                  <span v-else class="text-gray-300 text-xs">—</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
