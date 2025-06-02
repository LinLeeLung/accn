<template>
  <div class="container p-2">
    <div class="text-center mb-6">
      <h1 class="text-2xl font-bold text-green-600">峻晟會計專用估價(新)</h1>
    </div>

    <!-- File Management Section -->
    <div class="mb-6 p-1 bg-gray-100 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-700 mb-2">檔案管理</h3>
      <div class="flex flex-wrap gap-4 mb-4">
        <div>
          <label class="mr-2">儲存檔案名稱:</label>
          <input
            v-model="newFilename"
            type="text"
            class="p-1 border rounded-md text-sm"
            placeholder="日期+客戶+石材+案名"
          />
          <button
            @click="saveFile"
            class="m-2 p-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            儲存
          </button>
          上傳估價相關圖片
          <input
            type="file"
            @change="handleImageUpload"
            accept="image/jpeg, image/png"
          />
          <div v-if="uploadedImageUrl" class="mt-4">
            <img
              :src="uploadedImageUrl"
              alt="估價圖片預覽"
              class="w-full max-w-md mx-auto border rounded shadow-md"
              style="width: {{picRatio}}%"
            />
          </div>
        </div>
        <div>
          <label class="m-2">載入檔案:</label>
          <select
            v-model="selectedFile"
            class="p-2 border rounded-md text-sm w-30 bg-green-500 text-white rounded p-1"
          >
            <option value="" disabled>選擇檔案</option>
            <option v-for="file in files" :key="file" :value="file">
              {{ file }}
            </option>
          </select>
          <button
            @click="handleShare"
            class="m-1 p-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            分享
          </button>
          <button
            @click="loadFile"
            class="m-1 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            :disabled="!selectedFile"
          >
            載入
          </button>
          <button
            @click="deleteFile"
            class="m-1 p-1 bg-red-500 text-white rounded hover:bg-red-600"
            :disabled="!selectedFile"
          >
            刪除
          </button>

          <label class="m-2">統一顏色：</label>
          <input
            v-model="unifiedColor"
            type="text"
            class="p-1 m-1 border rounded-md w-15 text-sm"
            placeholder="輸入顏色"
          />
          <button
            @click="applyUnifiedColor"
            class="m-1 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            統一顏色
          </button>
          <label class="m-2">統一價格：</label>
          <input
            v-model.number="unifiedPrice"
            type="number"
            min="1"
            class="p-1 m-1 border rounded-md w-12 text-sm"
            placeholder="輸入單價"
          />
          <button
            @click="applyUnifiedPrice"
            class="m-1 mr-3 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            統一價格
          </button>
          <label class="m-2">統一極限值：</label>
          <input
            v-model="unifiedLimit"
            type="number"
            class="p-1 m-1 border rounded-md w-10 text-sm"
            placeholder="輸入顏色"
          />
          <button
            @click="applyUnifiedLimit"
            class="m-1 p-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            統一極限值
          </button>
          <button
            @click="generateQuotation1"
            class="m-1 p-1 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            電腦報價單
          </button>
          <button
            @click="exportToExcel"
            class="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
          >
            匯出 Excel
          </button>

          <label class="m-1" for="checkbox">工料分離</label>
          <input
            type="checkbox"
            v-model="isSep"
            class="m-1 h-3 w-3 text-green-500 focus:ring-green-500 border-gray-300 rounded"
          />
          <label class="m-1" for="checkbox">每才單價</label>
          <input
            type="number"
            v-model="sepPrice"
            class="p-1 border rounded-md w-15 text-sm"
          />
        </div>
      </div>
      <p v-if="message" class="text-sm text-gray-600">{{ message }}</p>
    </div>
    <!-- 價格資料 -->
    <div class="bg-blue-50 p-1 rounded-lg shadow-md">
      石材關鍵字<input type="text" v-model="colorkeyword" />
      <label> 選擇顏色：</label>
      <select
        v-if="filterColor.length > 0"
        v-model="selectedColor"
        @change="fillColor"
        class="bg-green-500 text-white rounded p-1"
      >
        <option
          v-for="(color, index) in filterColor"
          :key="color.name + '-' + index"
          :value="color"
        >
          {{ color.name }}
        </option>
      </select>
      <a
        class="text-blue-600 border rounded-sm m-4"
        href="https://docs.google.com/spreadsheets/d/14DuaTvauVkmJQ3M-aof63LOaGWkKIluhnO62PzvC71E/edit?gid=278514059#gid=278514059"
        target="_blank"
        >新增價格</a
      >
    </div>
    <!-- 客戶資料 -->
    <div class="bg-blue-50 p-1 rounded-lg shadow-md">
      客戶關鍵字<input type="text" v-model="cuskeyword" />
      <label> 選擇客戶：</label>
      <select
        v-if="filterCustomers.length > 0"
        v-model="selectedCustomer"
        @change="fillDetails"
        class="bg-green-500 text-white rounded p-1"
      >
        <option
          v-for="(customer, index) in filterCustomers"
          :key="customer.name + '-' + index"
          :value="customer"
        >
          {{ customer.name }}
        </option>
      </select>
      客戶名稱<input
        type="text"
        v-model="customer"
        placeholder="請輸入客戶名稱"
      />
      電話<input type="text" v-model="tel" placeholder="請輸入電話" />
      傳真<input type="text" v-model="fax" placeholder="請輸入傳真" /><br />
      聯絡人<input type="text" v-model="contacter" placeholder="請輸入聯絡人" />
      地址<input type="text" v-model="add" placeholder="請輸入地址" />
    </div>

    <!-- 📌 新增控制區（統一集中操作） -->
    <div class="flex flex-wrap gap-2 mb-4">
      <button
        @click="addCard('一字型')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ 一字型
      </button>
      <button
        @click="addCard('L')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ L 型
      </button>
      <button
        @click="addCard('LP')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ LP 型
      </button>
      <button
        @click="addCard('M')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ M 型
      </button>
      <button
        @click="addCard('中島')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ 中島
      </button>
      <button
        @click="addCard('側落腳')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ 側落腳
      </button>
      <button
        @click="addCard('倒包')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ 倒包
      </button>
      <button
        @click="addCard('假腳或門檻')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ 假腳
      </button>
      <button
        @click="addCard('高背')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ 高背
      </button>
      <button
        @click="addCard('圓弧造型')"
        class="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
      >
        ➕ 圓弧造型
      </button>
      <a
        class="text-blue-600 border rounded-sm m-4"
        href="https://docs.google.com/spreadsheets/d/1G1SbEPxp8xnAwU2f-EcQfTYNrHhcn2hi2qkfUwSYS6w/edit?gid=0#gid=0"
        target="_blank"
        >修改圓弧工資</a
      >
    </div>

    <!-- 📦 所有卡片統一顯示 -->
    <div class="one-card-container bg-blue-50 p-3 rounded grid gap-4">
      <template v-for="entry in cardOrderList" :key="entry.id">
        <div class="relative border border-gray-300 rounded-lg p-2">
          <div class="font-semibold text-sm text-gray-600 mb-1">
            {{ entry.id }}
          </div>
          <component
            v-if="getComponent(entry.type)"
            :is="getComponent(entry.type)"
            :index="entry.id"
            :initialValue="{
              ...(isObject(resultsProxy[entry.id])
                ? resultsProxy[entry.id]
                : {}),
              isEnabled: true,
            }"
            :sepPrice="sepPrice"
            @update-result="updateResult"
            @update-wage="handleArcWage"
          />

          <button
            @click="removeCard(entry.id, entry.type)"
            class="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600"
          >
            ✖
          </button>
        </div>
      </template>
    </div>

    <!-- 附加項目區塊 -->
    <label>顯示附加項目</label> <input type="checkbox" v-model="showItems" />
    <a
      class="text-blue-600 border rounded-sm m-4"
      href="https://docs.google.com/spreadsheets/d/1WVhDsnu-1WhNgi6hds8dogv2nDoYyaRCJcPU2NeqKhs/edit?gid=0#gid=0"
      target="_blank"
      >新增項目</a
    >

    <div v-if="showItems">
      <Items v-model:items="itemList" />
    </div>

    <button
      @click="generateQuotationPDF"
      class="bg-purple-600 text-white m-1 rounded hover:bg-purple-700"
    >
      輸出 PDF
    </button>
    <button
      @click="generateQuotationJPG"
      class="bg-green-600 text-white m-1 rounded hover:bg-green-700"
    >
      輸出 JPG
    </button>
    <label class="m-2" for="checkbox">工料分離</label>
    <input
      type="checkbox"
      v-model="isSep"
      class="m-1 h-4 w-4 text-green-500 focus:ring-green-500 border-gray-300 rounded"
    />

    <!-- ✅ 新增欄寬設定控制區 -->
    <label class="ml-4">欄寬設定：</label>
    <select
      v-model="selectedLayout"
      @change="applyColumnWidthLayout"
      class="p-1 border rounded-md text-sm"
    >
      <option
        v-for="(cols, name) in columnWidthPresets"
        :key="name"
        :value="name"
      >
        {{ name }}
      </option>
    </select>
    <input
      v-model="newLayoutName"
      placeholder="新設定名稱"
      class="p-1 border rounded-md text-sm w-[120px] ml-2"
    />
    <button
      @click="saveColumnWidthLayout"
      class="px-2 m-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
    >
      儲存
    </button>
    <button
      @click="deleteColumnWidthLayout(selectedLayout)"
      class="px-2 m-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
    >
      刪除
    </button>
    <p v-if="colmessage" class="text-sm text-gray-600">{{ colmessage }}</p>
    <label>顯示表頭</label> <input type="checkbox" v-model="showhead" />
    <label> 圖片顯示比例(%) </label>
    <input
      type="number"
      name="picRatio"
      id="picRatio"
      v-model.number="picRatio"
    />

    <div
      class="result-container"
      style="--tw-bg-opacity: 1; background-color: white !important"
    >
      <!-- 表頭-->

      <QuotationHeader
        v-if="showhead"
        :customer="customer"
        :tel="tel"
        :fax="fax"
        :contacter="contacter"
        :add="add"
      />

      <QuotationTable
        v-if="!isSep"
        :filteredResults="orderedFilteredResults"
        :filteredItems="filteredItems"
        :totalSubtotal="totalSubtotal"
        :columnWidths="localColumnWidths"
        @update:columnWidths="
          (val) => {
            if (JSON.stringify(val) !== JSON.stringify(localColumnWidths)) {
              localColumnWidths = val;
            }
          }
        "
      />
      <WMSTable
        v-if="isSep"
        :sepPrice="sepPrice"
        :filteredResults="orderedFilteredResults"
        :filteredItems="filteredItems"
        :totalSubtotal2="totalSubtotal2"
      />
      <div v-if="uploadedImageUrl" class="mt-6 flex justify-center">
        <img
          :src="uploadedImageUrl"
          alt="估價圖片"
          :style="{
            width: picRatio + '%',
            height: 'auto',
            objectFit: 'contain',
          }"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted, watch, nextTick } from "vue";
import axios from "axios";
import html2pdf from "html2pdf.js";
import styleText from "../assets/style.css?raw";
import { isObject } from "../utlis/validate.js";
import { applySeparationItems } from "../Composables/autoSeparationLogic.js";
import Arc from "./Arc.vue";
import One from "./One.vue";
import L from "./L.vue";
import M from "./M.vue";
import LP from "./LP.vue";
import Iland from "./Iland.vue";
import Items from "./Items.vue";
import Leg from "./Leg.vue";
import Wrap from "./Wrap.vue";
import DoorFront from "./DoorFront.vue";
import Wall from "./Wall.vue";
import QuotationHeader from "./QuotationHeader.vue";
import QuotationTable from "./QuotationTable.vue";
import WMSTable from "./WMSTable.vue";
// import * as XLSX from 'xlsx';
import { saveAs } from "file-saver";

const showhead = ref(true);
const showItems = ref(true);
const API_BASE_URL = "https://junchengstone.synology.me/accapi/";
const picRatio = ref(50);
onMounted(() => {
  fetchFiles();
  fetchCustomers();
  fetchData();
});

const applyUnifiedPrice = () => {
  const price = parseInt(unifiedPrice.value);
  if (isNaN(price) || price <= 0) {
    alert("請輸入有效的價格");
    return;
  }
  Object.keys(results.value).forEach((key) => {
    results.value[key].unitPrice = unifiedPrice.value;
    results.value[key].forceUpdate = true;
    if (key.includes("假腳或門檻")) {
      results.value[key].stonePrice = unifiedPrice.value;
    }
  });
  nextTick(() => calculate());
};

const applyUnifiedColor = () => {
  const newColor = unifiedColor.value.trim();
  if (!newColor) {
    alert("請輸入有效的顏色");
    return;
  }
  Object.keys(results.value).forEach((key) => {
    if (results.value[key]?.isEnabled) {
      results.value[key].color = newColor;
    }
  });
  nextTick(() => calculate());
};

const applyUnifiedLimit = () => {
  const newLimit = unifiedLimit.value;
  if (!newLimit) {
    alert("請輸入有效的極限值");
    return;
  }
  Object.keys(results.value).forEach((key) => {
    if (results.value[key]?.isEnabled) {
      results.value[key].limit = newLimit;
    }
  });
  nextTick(() => calculate());
};

const calculate = async () => {
  await nextTick();
};

const message = ref("");
const colmessage = ref("");
const selectedLayout = ref("預設欄寬");
const newLayoutName = ref("");
const localColumnWidths = ref([
  60, 60, 60, 60, 100, 60, 50, 50, 60, 40, 60, 60, 90, 90,
]);
const columnWidthPresets = ref({ 預設欄寬: [...localColumnWidths.value] });

const applyColumnWidthLayout = () => {
  const preset = columnWidthPresets.value[selectedLayout.value];
  if (preset) {
    localColumnWidths.value = [...preset];
    colmessage.value = `已套用「${selectedLayout.value}」欄寬設定 ${localColumnWidths.value}`;
  }
};

const setDefaultColumnWidthLayout = (layoutName) => {
  if (!columnWidthPresets.value[layoutName]) return; //沒有名稱返回
  selectedLayout.value = layoutName;
  localColumnWidths.value = [...columnWidthPresets.value[layoutName]];
  colmessage.value = `「${layoutName}」已設為預設欄寬並套用 ${localColumnWidths.value}`;
};
const DEFAULT_LAYOUT = "預設欄寬";

const deleteColumnWidthLayout = async (layoutName) => {
  if (layoutName === DEFAULT_LAYOUT) return alert(`${DEFAULT_LAYOUT}無法刪除`);
  if (!columnWidthPresets.value[layoutName]) return;

  delete columnWidthPresets.value[layoutName];

  if (selectedLayout.value === layoutName) {
    selectedLayout.value = DEFAULT_LAYOUT;
    applyColumnWidthLayout();
  }

  try {
    await axios.post(`${API_BASE_URL}?action=savePresets`, {
      presets: columnWidthPresets.value,
      default: selectedLayout.value,
    });
    colmessage.value = `已刪除「${layoutName}」設定`;
  } catch (err) {
    console.error("❌ 儲存更新失敗", err);
    colmessage.value = "刪除後儲存失敗";
  }
};

const saveColumnWidthLayout = async () => {
  const name = newLayoutName.value.trim();
  if (!name) return alert("請輸入新設定名稱");

  if (columnWidthPresets.value[name]) {
    const confirmReplace = confirm(`「${name}」已存在，要覆蓋嗎？`);
    if (!confirmReplace) return;
  }

  columnWidthPresets.value[name] = [...localColumnWidths.value];
  selectedLayout.value = name;
  newLayoutName.value = "";

  try {
    await axios.post(`${API_BASE_URL}?action=savePresets`, {
      presets: columnWidthPresets.value,
      default: selectedLayout.value,
    });
    colmessage.value = `已儲存「${selectedLayout.value}」欄寬設定`;
  } catch (err) {
    console.error("❌ 儲存欄寬設定失敗", err);
    colmessage.value = "儲存欄寬設定失敗";
  }
};

onMounted(async () => {
  try {
    const res = await axios.get(`${API_BASE_URL}?action=loadPresets`);

    if (res.data && res.data.data) {
      columnWidthPresets.value = res.data.data.presets;
      selectedLayout.value = res.data.data.default || "預設欄寬";
      applyColumnWidthLayout();
      colmessage.value = `已載入「${selectedLayout.value}」欄寬設定`;
    }
  } catch (err) {
    console.warn("⚠️ 載入欄寬設定失敗", err);
    colmessage.value = "⚠️ 載入欄寬設定失敗";
  }
});

watch(
  [columnWidthPresets, selectedLayout],
  () => {
    localStorage.setItem(
      "columnPresets",
      JSON.stringify({
        presets: columnWidthPresets.value,
        default: selectedLayout.value,
      })
    );
  },
  { deep: true }
);
const price = ref(85);
const itemList = ref([]);
const priceList = ref([]);
const files = ref([]);
const newFilename = ref("");
const selectedFile = ref("");

const results = ref({});
const resultsProxy = computed(() => results.value);

const cuskeyword = ref("");
const colorkeyword = ref("");
const customers = ref([]);
const colors = ref([]);
const color = ref("");
const selectedCustomer = ref({ name: "請選擇客戶" });
const selectedColor = ref({ name: "請選擇顏色" });
const customer = ref("");
const tel = ref("");
const fax = ref("");
const contacter = ref("");
const add = ref("");
const shareFilename = ref("");
const unifiedPrice = ref(0);
const unifiedColor = ref("");
const unifiedLimit = ref(72);
const isSep = ref(false);
const sepPrice = ref(750);

const cardOrderList = ref([]);

const filteredItems = computed(() =>
  itemList.value.filter((item) => item.checked)
);

const filteredResults = computed(() => {
  return Object.fromEntries(
    Object.entries(results.value).filter(([_, r]) => r?.isEnabled)
  );
});

const orderedFilteredResults = computed(() => {
  return Object.fromEntries(
    cardOrderList.value
      .map(({ id }) => [id, results.value[id]])
      .filter(([_, r]) => r?.isEnabled)
  );
});

const hasValidResults = computed(() => {
  return (
    Object.keys(filteredResults.value).length > 0 ||
    filteredItems.value.length > 0
  );
});

const totalSubtotal = computed(() => {
  const shapeTotal = Object.values(filteredResults.value).reduce(
    (sum, r) => sum + (parseFloat(r?.subtotal) || 0),
    0
  );
  const itemsTotal = filteredItems.value.reduce(
    (sum, item) => sum + (item.price * item.amount || 0),
    0
  );
  return shapeTotal + itemsTotal;
});

const totalSubtotal2 = computed(() => {
  const shapeTotal = Object.values(filteredResults.value).reduce(
    (sum, r) => sum + (parseFloat(r?.subtotal2) || 0),
    0
  );
  const itemsTotal = filteredItems.value.reduce(
    (sum, item) => sum + (item.price * item.amount || 0),
    0
  );
  return shapeTotal + itemsTotal;
});

const totalFrontEdgeLength = computed(() => {
  return Object.values(resultsProxy.value)
    .reduce((sum, r) => {
      if (r?.isEnabled && r?.frontEdgeLength) {
        return sum + parseFloat(r.frontEdgeLength);
      }
      return sum;
    }, 0)
    .toFixed(0);
});

watch(
  isSep,
  () => {
    applySeparationItems({ isSep, itemList, totalFrontEdgeLength });
    // console.log("totalfrontedgelength:",totalFrontEdgeLength)
  },
  { immediate: true }
);

const updateResult = (result) => {
  const current = results.value[result.index];
  const isChanged =
    !current || JSON.stringify(current) !== JSON.stringify(result);
  if (isChanged) {
    results.value[result.index] = { ...result };
  }
};

const fetchFiles = async () => {
  try {
    const res = await axios.get(
      "https://junchengstone.synology.me/accapi/?action=files"
    );
    files.value = res.data.files;
  } catch (err) {
    message.value = "載入檔案列表失敗";
  }
};
function flattenDetail(result, sideCount = 2) {
  const flat = { ...result };
  for (let i = 1; i <= sideCount; i++) {
    const side = result.detail?.[`side${i}`];
    if (side) {
      flat[`length${i}`] = side.length ?? 0;
      flat[`depth${i}`] = side.depth ?? 0;
      flat[`frontEdge${i}`] = side.frontEdge ?? 0;
      flat[`backWall${i}`] = side.backWall ?? 0;
      flat[`wrapBack${i}`] = side.wrapBack ?? 0;
    }
  }
  return flat;
}
const saveFile = async () => {
  if (!newFilename.value) {
    showMessage("請輸入檔名", "error", 5000);
    return;
  }

  // ✅ 展平結果資料
  const processedResults = {};
  for (const id in results.value) {
    const res = results.value[id];
    if (res.type === "M") {
      processedResults[id] = flattenDetail(res, 3);
    } else if (["L", "LP"].includes(res.type)) {
      processedResults[id] = flattenDetail(res, 2);
    } else {
      processedResults[id] = { ...res }; // 其他型別照原本儲存
    }
  }

  const content = {
    cardOrderList: cardOrderList.value,
    results: processedResults, // ✅ 使用展平結果
    itemList: itemList.value,
    customer: customer.value,
    tel: tel.value,
    fax: fax.value,
    contacter: contacter.value,
    add: add.value,
    cuskeyword: cuskeyword.value,
    colorkeyword: colorkeyword.value,
    selectedCustomer: selectedCustomer.value,
    isSep: isSep.value,
    localColumnWidths: localColumnWidths.value,
    uploadedImageUrl: uploadedImageUrl.value,
    picRatio: picRatio.value,
  };

  await axios.post("https://junchengstone.synology.me/accapi/?action=save", {
    filename: newFilename.value.endsWith(".json")
      ? newFilename.value
      : `${newFilename.value}.json`,
    content,
  });

  message.value = "檔案已儲存";
  shareFilename.value = newFilename.value.endsWith(".json")
    ? newFilename.value
    : `${newFilename.value}.json`;
  newFilename.value = "";
  fetchFiles();
};

const detectTypeFromId = (id) => {
  const knownTypes = [
    "一字型",
    "L",
    "LP",
    "M",
    "中島",
    "側落腳",
    "倒包",
    "假腳或門檻",
    "高背",
    "圓弧造型",
  ];
  return knownTypes.find((type) => id.startsWith(type)) || "一字型";
};

const loadFile = async () => {
  results.value = {};
  itemList.value = [];
  cardOrderList.value = [];
  if (!selectedFile.value) return;
  try {
    const res = await axios.get(
      "https://junchengstone.synology.me/accapi/?action=load",
      {
        params: { filename: selectedFile.value },
      }
    );
    const data = res.data.content;
    if (res.data && res.data.success && res.data.content) {
      //const data = res.data.content;
      // Object.freeze(data);  // 把整個物件變成唯讀
      //data.foo = 123;
      //console.log("data:", data)
      //console.log("完整回傳資料 snapshot：", JSON.stringify(data, null, 2));
    } else {
      console.warn("資料格式不符合預期", res.data);
    }
    shareFilename.value = selectedFile.value;

    itemList.value = data.itemList || [];
    //Object.assign(results.value, data.results || {});

    results.value = data.results || {};
    //console.log("results.value 資料內容：", results.value);
    isSep.value = data.isSep || false;
    customer.value = data.customer || "";
    tel.value = data.tel || "";
    fax.value = data.fax || "";
    contacter.value = data.contacter || "";
    add.value = data.add || "";
    cuskeyword.value = data.cuskeyword || "";
    selectedCustomer.value = data.selectedCustomer || "";
    uploadedImageUrl.value = data.uploadedImageUrl || "";
    picRatio.value = data.picRatio ?? 50; // 若沒有就預設 50%
    if (data.cardOrderList) {
      cardOrderList.value = data.cardOrderList.map((c) => ({
        ...c,
        isEnabled: c.isEnabled !== false,
      }));
    } else {
      cardOrderList.value = Object.keys(data.results || {}).map((id) => ({
        id,
        type: detectTypeFromId(id),
        isEnabled: true,
      }));
    }
    message.value = `已載入 ${selectedFile.value}`;
    selectedFile.value = "";
  } catch (err) {
    message.value = "載入失敗";
  }
};

const deleteFile = async () => {
  if (!selectedFile.value) return;
  await axios.delete(
    "https://junchengstone.synology.me/accapi/?action=delete",
    {
      params: { filename: selectedFile.value },
    }
  );
  message.value = `已刪除 ${selectedFile.value}`;
  selectedFile.value = "";
  fetchFiles();
};

const fetchData = async () => {
  try {
    const res = await axios.get(
      "https://script.googleusercontent.com/macros/echo?user_content_key=AehSKLigc6YtS8LeqlGNHC-izL0xaWOPe_q4nGx1b0ecoRSO3zVu53MKoLdd5Ti7qQmRmOKz3YJzyYl9jYfOqAyuJp7vhmwHXKSp6w--mSBwGMgVHC4-9v1c1bT9tgfY0e4zqq4FK5HfZHk8JXsIqGdNeixPUu6YNuxJ-coCUz1kiqo7cC4zu9pw5xIlBuI5MiROhhGgcRvKJRkci7xDfqM4gijY_Se-ARXAKQyANX1FPokbaN1hQU7d_C7uAsUG1Wr5PlXz2JKxv3el4rsF19KJht0E-MYPGQ&lib=MIG840YcRyBozKsoJjxkgz2my7uZSrO0E"
    );
    itemList.value = res.data;
    const res2 = await axios.get(
      "https://script.google.com/macros/s/AKfycbweY4uKhj-NmmqmaKMD401ePMjVrGEE7_fuYNSmEYAOk4I4pW2garBtDCtYehV-I0oX/exec"
    );
    priceList.value = res2.data;
    // console.log(priceList.value)
  } catch (err) {
    itemList.value = [];
  }
};

const fetchCustomers = async () => {
  try {
    const res = await axios.get(
      "https://junchengstone.synology.me/acc/proxy.php"
    );
    customers.value = res.data;
  } catch (err) {
    customers.value = [];
  }
};

const filterCustomers = computed(() => {
  return [
    { name: "請選擇客戶" },
    ...customers.value.filter((c) =>
      c.name.toLowerCase().includes(cuskeyword.value.trim().toLowerCase())
    ),
  ];
});
const filterColor = computed(() => {
  return [
    { name: "請選擇顏色" },
    ...priceList.value.filter((c) =>
      c.name.toLowerCase().includes(colorkeyword.value.trim().toLowerCase())
    ),
  ];
});

const fillDetails = () => {
  if (selectedCustomer.value) {
    customer.value = selectedCustomer.value.name || "";
    tel.value = selectedCustomer.value.tel || "";
    fax.value = selectedCustomer.value.fax || "";
  }
};
const fillColor = () => {
  if (selectedColor.value) {
    color.value = selectedColor.value.name || "";
    unifiedColor.value = selectedColor.value.name || "";
    unifiedPrice.value = selectedColor.value.price || "";
  }
};

const arcWageList = ref([]); // 所有 Arc 回傳的 wage

function handleArcWage(wageItem) {
  // 先更新 arcWageList（以 index 區分）
  const idx = arcWageList.value.findIndex((i) => i.source === wageItem.source);
  if (idx >= 0) {
    arcWageList.value[idx] = wageItem;
  } else {
    arcWageList.value.push(wageItem);
  }

  // 統一整理總工資
  const totalWage = arcWageList.value.reduce(
    (sum, item) => sum + item.price,
    0
  );
  const note = arcWageList.value.map((i) => i.detail).join(" + ");

  const mergedItem = {
    id: "arc-wage-total",
    name: "圓弧加工費",
    price: totalWage,
    amount: 1,
    checked: true,
    unit: "式",
    note,
    readonly: true, // ✅ 加入這個
  };

  // 更新 itemList 中該項目
  const exist = itemList.value.find((item) => item.id === "arc-wage-total");
  if (exist) {
    Object.assign(exist, mergedItem);
  } else {
    itemList.value.push(mergedItem);
  }
}

import html2canvas from "html2canvas";

const generateQuotationPDF = async () => {
  const element = document.querySelector(".result-container");
  if (!element) {
    alert("找不到報價內容");
    return;
  }

  await nextTick(); // 確保畫面更新完成

  html2pdf()
    .set({
      margin: 0.5,
      filename: `報價單_${new Date()
        .toLocaleDateString()
        .replace(/\//g, "-")}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      pagebreak: { mode: ["avoid-all", "css", "legacy"] },
    })
    .from(element)
    .save();
};

const generateQuotationJPG = async () => {
  const element = document.querySelector(".result-container");
  if (!element) {
    alert("找不到報價內容");
    return;
  }

  await nextTick();

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  const link = document.createElement("a");
  link.href = imgData;
  link.download = `報價單_${new Date()
    .toLocaleDateString()
    .replace(/\//g, "-")}.jpg`;
  link.click();
};

const generateQuotation1 = () => {
  const resultContent = document.querySelector(".result-container");
  if (!resultContent) return alert("找不到報價內容");

  const printWindow = window.open("", "_blank");

  // 額外列印優化 CSS：調整 p 行距與字距
  const tightCSS = `
  th, td {
    border: 1px solid black !important;
    padding: 4px;
  }
  th {
    background-color: #e5f4f9 !important;
  }
    p {
      line-height: 1.3 !important;
      margin: 0 !important;
      padding: 0 !important;
      letter-spacing: -0.5px !important;
    }
      @media print {
    table, thead, tbody, tr, th, td {
    border: 1px solid black !important;
    border-collapse: collapse !important;
    box-sizing: border-box !important;
  }

  th, td {
    padding: 4px !important;
  }

  /* 強制讓最右邊也保留格線 */
  .table-fixed {
    width: 100%;
    table-layout: fixed;
    border-spacing: 0; /* ✅ 避免出現細縫 */
  }

   
    



  `;

  printWindow.document.write(`
    <html>
      <head>
        <title>報價單</title>
        <style>${styleText}</style>
        <style>${tightCSS}</style>
      </head>
      <body>
        <div class="result-container">${resultContent.innerHTML}</div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    printWindow.print();
  };
};

const addCard = (type) => {
  const knownTypes = [
    "一字型",
    "L",
    "LP",
    "M",
    "中島",
    "側落腳",
    "倒包",
    "假腳或門檻",
    "高背",
    "圓弧造型",
  ];
  if (!knownTypes.includes(type)) return alert(`❌ 不支援的元件類型：${type}`);

  const id = `${type}-${
    cardOrderList.value.filter((c) => c.type === type).length + 1
  }`;
  cardOrderList.value.push({ id, type, isEnabled: true });
};

const removeCard = (id, type) => {
  // 移除卡片本身
  cardOrderList.value = cardOrderList.value.filter((c) => c.id !== id);
  delete results.value[id];

  // ✅ 若是 Arc，從 arcWageList 中移除對應項目
  if (type === "圓弧造型") {
    const idx = arcWageList.value.findIndex((i) => i.source === id);
    if (idx >= 0) arcWageList.value.splice(idx, 1);

    // ✅ 重新計算總圓弧加工費
    const totalWage = arcWageList.value.reduce(
      (sum, item) => sum + item.price,
      0
    );
    const note = arcWageList.value.map((i) => i.detail).join(" + ");

    const mergedItem = {
      id: "arc-wage-total",
      name: "圓弧加工費",
      price: totalWage,
      amount: 1,
      checked: true,
      unit: "式",
      note,
    };

    const exist = itemList.value.find((item) => item.id === "arc-wage-total");
    if (totalWage === 0) {
      // 如果已經沒有任何圓弧，加工費為 0，則從 itemList 移除該項
      if (exist) {
        const idx = itemList.value.findIndex((i) => i.id === "arc-wage-total");
        itemList.value.splice(idx, 1);
      }
    } else {
      if (exist) {
        Object.assign(exist, mergedItem);
      } else {
        itemList.value.push(mergedItem);
      }
    }
  }
};

const getComponent = (type) => {
  const map = {
    一字型: One,
    L: L,
    LP: LP,
    M: M,
    中島: Iland,
    側落腳: Leg,
    倒包: Wrap,
    假腳或門檻: DoorFront,
    高背: Wall,
    圓弧造型: Arc,
  };
  return map[type];
};
import * as XLSX from "xlsx-js-style";

const exportToExcel = () => {
  //console.log("excel...", isSep.value);
  if (isSep.value) {
    exportToExcel2();
  } else {
    exportToExcel1();
  }
};

const currentDate = new Date().toISOString().split("T")[0];

const generateCommonHeader = () => [
  ["峻晟實業股份有限公司 / 峻倢實業有限公司"],
  ["新北市林口區南勢街(里)77-3號"],
  ["TEL: 02-26080192-3 | FAX: 02-26080194"],
  ["峻晟業務: 楊家斌 0977-087-192 王冠堯 0985-980-568"],
  ["估價單"],
  [`客戶名稱：${customer.value || ""} ☎️：${tel.value}📠：${fax.value}`],
  [
    `聯絡人：${contacter.value || ""} 地址：${
      add.value
    } 估價日期： ${currentDate} PS:報價有效期間一個月`,
  ],
  [],
  ["親愛的客戶你好: 請詳看備註事項,謝謝您"],
  ["1. 估價是以現有提供的圖面尺寸初估價格, 未包含任何對圖細節。"],
  [
    "   PS: 若有任何異動. 依實際施作的台面(尺寸數量)規格計算價格。Ps: 請桶身師父加强櫃體懸空處結構。",
  ],
  ["2. 其他特殊加工作法, 以實際生產溝通對圖的作法(價格)為主。"],
  ["   EX: 台面懸空處支撐(訂木座或訂製織架&平接處&對紋)"],
  ["   單價一律是順紋不對紋的價格（對紋價格會特別備註）"],
  [
    "   PS：紋路板對紋價（單價 +20%），正式下單時會以實際進貨板料作為電腦對紋模擬彩圖，確定後才施作（盡量對紋）",
  ],
  [
    "3. 台面尺寸, 要做一整片時, 需看樓層現場電梯是否可進？若需搬運 (樓梯搬運費另計)。",
  ],
  ["4. 若有溢估處, 確定不生產或挖孔時, 該筆金額請自行刪除即可。"],
  [
    "5. 若為正式訂單, 麻煩貴司傳真最終的完整平面圖及立面圖至峻晟, 以便安排對圖及安装事宜, 謝謝您。",
  ],
];

const TAX_RATE = 1.05; // Configurable tax rate

// Centralized style definitions
const STYLES = {
  head: {
    font: { name: "DFKai-SB", bold: false, sz: 20 },
    alignment: { horizontal: "center", vertical: "center" },
  },
  add: {
    font: { name: "DFKai-SB", bold: false, sz: 16 },
    alignment: { horizontal: "center", vertical: "center" },
  },
  customer: {
    font: { name: "DFKai-SB", bold: false, sz: 14 },
    alignment: { horizontal: "left", vertical: "center" },
  },
  note: {
    font: { name: "DFKai-SB", bold: false, sz: 12 },
    alignment: { wrapText: true, vertical: "top", horizontal: "left" },
  },
  footAlert: {
    font: { name: "DFKai-SB", bold: false, sz: 14, color: { rgb: "FF0000" } },
    alignment: { horizontal: "left", vertical: "center" },
  },
  header: {
    font: { name: "DFKai-SB", sz: 12, bold: true },
    alignment: { horizontal: "center", vertical: "center" },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
    fill: { fgColor: { rgb: "E6F7FF" } },
  },
  body: {
    font: { name: "DFKai-SB", sz: 11 },
    alignment: { wrapText: true, horizontal: "left", vertical: "top" },
    border: {
      top: { style: "thin" },
      bottom: { style: "thin" },
      left: { style: "thin" },
      right: { style: "thin" },
    },
  },
  accounting: {
    font: { name: "DFKai-SB", sz: 11 },
    alignment: { horizontal: "right", vertical: "center" },
    numFmt: "#,##0",
  },
};

// Column widths
const COLUMN_WIDTHS = [
  { wpx: 24 },
  { wpx: 24 },
  { wpx: 45 },
  { wpx: 87 },
  { wpx: 31 },
  { wpx: 31 },
  { wpx: 45 },
  { wpx: 24 },
  { wpx: 38 },
  { wpx: 73 },
  { wpx: 45 },
  { wpx: 45 },
  { wpx: 45 },
  { wpx: 45 },
];

const exportToExcel1 = async () => {
  try {
    // 1. Prepare data
    const data = prepareData();

    // 2. Create and style worksheet
    const worksheet = createStyledWorksheet(data);

    // 3. Create workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "報價單");

    // 4. Add image if available
    if (uploadedImageUrl.value) {
      await addImageToWorksheet(workbook, worksheet, data.length);
    }

    // 5. Export file
    exportWorkbook(workbook);
  } catch (error) {
    console.error("Excel export failed:", error);
    alert("Failed to export Excel file. Please try again.");
  }
};

const prepareData = () => {
  const data = [
    ...generateCommonHeader(),
    [],
    [
      "項目",
      "前沿",
      "背牆/後厚",
      "倒包",
      "摘要",
      "顏色",
      "長",
      "深",
      "數量",
      "單位",
      "單價",
      "未稅價",
      "計算過程",
      "備註",
    ],
  ];

  // Validate inputs
  if (!orderedFilteredResults.value || !filteredItems.value) {
    throw new Error("Missing required data for export");
  }

  // Process orderedFilteredResults
  for (const [index, result] of Object.entries(orderedFilteredResults.value)) {
    if (!result?.isEnabled) continue;
    const detail = result.detail;

    if (detail) {
      const rows = [detail.side1, detail.side2, detail.side3].filter(Boolean);
      rows.forEach((side, i) => {
        data.push([
          i === 0 ? index : "",
          side.frontEdge || "",
          side.backWall || "",
          side.wrapBack || "",
          i === 0 ? result.sumary || "" : "",
          i === 0 ? result.color || "" : "",
          side.length || "",
          side.depth || "",
          i === 0 ? result.roundedCentimeters || "" : "",
          i === 0 ? "cm" : "",
          i === 0 ? result.unitPrice || "" : "",
          i === 0 ? result.subtotal || "" : "",
          i === 0 ? result.calculationSteps || "" : "",
          i === 0 ? result.note || "" : "",
        ]);
      });
    } else {
      data.push([
        index,
        result.frontEdge || "",
        result.backWall || result.backEdge || "",
        result.wrapBack || "",
        result.sumary || "",
        result.color || "",
        result.length || "",
        result.depth || "",
        result.roundedCentimeters || "",
        "cm",
        result.unitPrice || "",
        result.subtotal || "",
        result.calculationSteps || "",
        result.note || "",
      ]);
    }
  }

  // Process filteredItems
  filteredItems.value.forEach((item) => {
    data.push([
      item.name || "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      item.amount || "",
      item.unit || "",
      item.price || "",
      item.price * item.amount || "",
      "",
      item.note || "",
    ]);
  });

  // Add totals and footer
  data.push([
    "總計",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "未稅",
    totalSubtotal2.value || 0,
    "含稅",
    Math.round((totalSubtotal2.value || 0) * TAX_RATE),
  ]);
  data.push([
    "石材庫存以代理商現貨為主",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);

  return data;
};

const createStyledWorksheet = (data) => {
  const worksheet = XLSX.utils.aoa_to_sheet(data);

  // Apply column widths
  worksheet["!cols"] = COLUMN_WIDTHS;

  // Apply styles
  applyCellStyles(worksheet, data);
  applyNumericFormatting(worksheet, data);
  applyMerges(worksheet, data);

  return worksheet;
};

const applyCellStyles = (worksheet, data) => {
  const headerStartRow = generateCommonHeader().length + 2;
  const endRow = data.length - 1;

  // Apply header and body styles
  for (let r = headerStartRow - 1; r < endRow; r++) {
    for (let c = 0; c < 14; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!worksheet[addr]) continue;
      worksheet[addr].s =
        r === headerStartRow - 1 ? STYLES.header : STYLES.body;
    }
  }

  // Apply specific header styles (A1–A7)
  const specificStyles = [
    { addr: "A1", style: STYLES.head },
    { addr: "A2", style: STYLES.add },
    { addr: "A3", style: STYLES.add },
    { addr: "A4", style: STYLES.add },
    { addr: "A5", style: STYLES.add },
    { addr: "A6", style: STYLES.customer },
    { addr: "A7", style: STYLES.customer },
  ];
  specificStyles.forEach(({ addr, style }) => {
    if (worksheet[addr]) worksheet[addr].s = style;
  });

  // Apply note styles for rows 8–17
  for (let i = 8; i <= 17; i++) {
    const addr = `A${i}`;
    if (!worksheet[addr]) worksheet[addr] = { t: "s", v: "" };
    worksheet[addr].s = STYLES.note;
  }

  // Apply footer alert style
  const footerAddr = `A${data.length - 1}`;
  if (worksheet[footerAddr]) worksheet[footerAddr].s = STYLES.footAlert;
};

const applyNumericFormatting = (worksheet, data) => {
  const colIndex = 11; // Column L
  for (let r = generateCommonHeader().length + 3; r < data.length; r++) {
    const addr = XLSX.utils.encode_cell({ r, c: colIndex });
    const cell = worksheet[addr];
    if (cell && typeof cell.v === "number") {
      cell.t = "n";
      cell.z = "#,##0";
      cell.s = STYLES.accounting;
    }
  }

  // Tax-inclusive total (column N, last row - 1)
  const taxAddr = XLSX.utils.encode_cell({
    r: data.length - 2,
    c: colIndex + 2,
  });
  const taxCell = worksheet[taxAddr];
  if (taxCell && typeof taxCell.v === "number") {
    taxCell.t = "n";
    taxCell.z = "#,##0";
    taxCell.s = STYLES.accounting;
  }
};

const applyMerges = (worksheet, data) => {
  worksheet["!merges"] = [];

  // Merge header rows (0 to generateCommonHeader().length - 1)
  const headerLength = generateCommonHeader().length;
  for (let i = 0; i < headerLength; i++) {
    worksheet["!merges"].push({
      s: { r: i, c: 0 },
      e: { r: i, c: 13 },
    });
  }

  // Merge cells for multi-row results
  let rowOffset = headerLength + 2;
  for (const [index, result] of Object.entries(orderedFilteredResults.value)) {
    if (!result?.isEnabled) continue;
    const detail = result.detail;
    let rowSpan = 1;

    if (detail) {
      const rows = [detail.side1, detail.side2, detail.side3].filter(Boolean);
      rowSpan = rows.length;
    }

    if (rowSpan > 1) {
      const mergeColumns = [0, 4, 5, 8, 9, 10, 11, 12, 13];
      mergeColumns.forEach((col) => {
        worksheet["!merges"].push({
          s: { r: rowOffset, c: col },
          e: { r: rowOffset + rowSpan - 1, c: col },
        });
      });
    }
    rowOffset += rowSpan;
  }

  // Merge total and footer rows
  worksheet["!merges"].push(
    { s: { r: data.length - 2, c: 0 }, e: { r: data.length - 2, c: 9 } },
    { s: { r: data.length - 1, c: 0 }, e: { r: data.length - 1, c: 9 } }
  );
};

const addImageToWorksheet = async (workbook, worksheet, tableLength) => {
  try {
    const response = await fetch(uploadedImageUrl.value, { mode: "cors" });
    if (!response.ok) throw new Error("Failed to fetch image");
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64Image = e.target.result.split(",")[1];

        if (!workbook.Workbook) workbook.Workbook = {};
        if (!workbook.Workbook.Images) workbook.Workbook.Images = [];

        const imageId = workbook.Workbook.Images.length;
        workbook.Workbook.Images.push({
          name: `img${imageId}.jpeg`,
          base64: base64Image,
          extension: ".jpeg",
        });

        if (!worksheet["!images"]) worksheet["!images"] = [];
        worksheet["!images"].push({
          name: `img${imageId}.jpeg`,
          type: "picture",
          position: {
            type: "twoCellAnchor",
            from: { col: 0, row: tableLength + 2 },
            to: { col: 7, row: tableLength + 15 },
          },
        });

        resolve();
      };
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.warn("Image insertion failed, exporting without image:", error);
    return;
  }
};

const exportWorkbook = (workbook) => {
  const wbout = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([wbout], { type: "application/octet-stream" });
  saveAs(blob, `報價單_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const exportToExcel2 = () => {
  const data = [];

  data.push([
    "項目",
    "前沿",
    "背牆/後厚",
    "倒包",
    "摘要",
    "顏色",
    "長",
    "深",
    "數量",
    "單位",
    "單價",
    "未稅價",
    "計算過程",
    "備註",
  ]);

  for (const [index, result] of Object.entries(orderedFilteredResults.value)) {
    if (!result?.isEnabled) continue;
    const detail = result.detail;

    if (detail) {
      const rows = [detail.side1, detail.side2, detail.side3].filter(Boolean);
      rows.forEach((side, i) => {
        data.push([
          i === 0 ? index : "",
          side.frontEdge || "",
          side.backWall || "",
          side.wrapBack || "",
          i === 0 ? result.sumary : "",
          i === 0 ? result.color : "",
          side.length || "",
          side.depth || "",
          i === 0 ? result.area : "",
          i === 0 ? "才" : "",
          i === 0 ? sepPrice.value : "",
          i === 0 ? result.subtotal2 : "",
          i === 0 ? result.calculationSteps2 : "",
          i === 0 ? result.note : "",
        ]);
      });
    } else {
      data.push([
        index,
        result.frontEdge || "",
        result.backWall || result.backEdge || "",
        result.wrapBack || "",
        result.sumary || "",
        result.color || "",
        result.length || "",
        result.depth || "",
        result.area || "",
        "才",
        sepPrice.value || "",
        result.subtotal2 || "",
        result.calculationSteps2 || "",
        result.note || "",
      ]);
    }
  }

  filteredItems.value.forEach((item) => {
    data.push([
      item.name,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      item.amount,
      item.unit,
      item.price,
      item.price * item.amount,
      "",
      item.note,
    ]);
  });

  data.push([
    "總木計",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "未稅",
    totalSubtotal2.value,
    "含稅",
    Math.round(totalSubtotal2.value * 1.05),
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "工料分離報價單");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(blob, `報價單_${new Date().toISOString().slice(0, 10)}.xlsx`);
};

const handleShare = async () => {
  await loadFile();
  await nextTick();
  if (!shareFilename.value) {
    // 顯示錯誤訊息
    showMessage("請先儲存或載入要分享的檔案", "error", 5000);
    return;
  }

  const filename = shareFilename.value;
  const shareUrl = `https://linleelung.github.io/view/#/share?filename=${encodeURIComponent(
    filename
  )}`;
  window.open(shareUrl, "_blank");

  // 顯示成功訊息
  showMessage(`分享連結已產生：${shareUrl}`, "success", 5000);
};

// 建立顯示訊息的 HTML 結構 (如果還沒有的話)
if (!document.getElementById("notification-container")) {
  const container = document.createElement("div");
  container.id = "notification-container";
  document.body.appendChild(container);
}

function showMessage(message, type = "info", duration = 3000) {
  const container = document.getElementById("notification-container");
  const notification = document.createElement("div");
  notification.classList.add("notification");
  notification.classList.add(type); // 可以添加 'success', 'error', 'info' 等樣式
  notification.textContent = message;

  container.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("fade-out"); // 添加淡出動畫的 class
    setTimeout(() => {
      container.removeChild(notification);
    }, 300); // 等待淡出動畫結束後移除元素
  }, duration);
}
// Q.vue <script setup> 裡新增
const uploadedImageUrl = ref("");

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  if (!["image/jpeg", "image/png"].includes(file.type)) {
    alert("只能上傳 jpg 或 png 格式的圖片");
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    // 5MB
    alert("檔案太大，請選擇小於 5MB 的圖片");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = await axios.post(
      "https://junchengstone.synology.me/accapi/upload.php",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    console.log(res.data);
    if (res.data.success) {
      uploadedImageUrl.value = res.data.url;
      showMessage("圖片上傳成功", "success");
    } else {
      alert("上傳失敗，請稍後再試");
    }
  } catch (error) {
    console.error("上傳錯誤", error);
    alert("上傳錯誤，請稍後再試");
  }
};
</script>

<style scoped>
.text-left {
  text-align: left !important;
}
/* 新增響應式排版：讓卡片在桌機三欄、橫向手機二欄、直式手機一欄 */
:deep(.one-card-container) {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  width: 100%; /* 保證不超出 */
  max-width: 100%; /* 限制最大 */
  overflow-x: hidden; /* 預防橫向 overflow */
}

@media (min-width: 640px) {
  :deep(.one-card-container) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1024px) {
  :deep(.one-card-container) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
}
</style>
