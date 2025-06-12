<script setup>
import { auth, provider } from "@/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { ref } from "vue";

const user = ref(null);

auth.onAuthStateChanged((u) => {
  user.value = u;
});

function login() {
  signInWithPopup(auth, provider)
    .then((result) => {
      console.log("✅ 登入成功", result.user);
    })
    .catch((error) => {
      alert("登入失敗：" + error.message);
    });
}

function logout() {
  signOut(auth);
}
</script>

<template>
  <div class="p-4 space-y-2">
    <button @click="login" class="bg-blue-500 text-white px-4 py-1 rounded">
      使用 Google 登入
    </button>
    <button
      @click="logout"
      class="bg-gray-500 text-white px-4 py-1 rounded"
      v-if="user"
    >
      登出（{{ user?.email }})
    </button>
  </div>
</template>
