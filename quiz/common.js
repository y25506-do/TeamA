// 共通の機能
// 全ページ共通：コイン管理＆表示更新

const STORAGE_KEYS = {
  totalCoin: "totalcoin",
  score: "score",
  resultSet: "resultset",
  dex: "dex_items" // 図鑑用（獲得アイテムの保存）
};

function initCoinIfNeeded() {
  if (localStorage.getItem(STORAGE_KEYS.totalCoin) === null) {
    localStorage.setItem(STORAGE_KEYS.totalCoin, "0");
  }
}

function getTotalCoin() {
  initCoinIfNeeded();
  return Number(localStorage.getItem(STORAGE_KEYS.totalCoin)) || 0;
}

function setTotalCoin(v) {
  const n = Math.max(0, Math.floor(Number(v) || 0));
  localStorage.setItem(STORAGE_KEYS.totalCoin, String(n));
  updateCoinUI();
}

function addTotalCoin(delta) {
  setTotalCoin(getTotalCoin() + (Number(delta) || 0));
}

function updateCoinUI() {
  // index/result/gacha/zukan では id="totalcoin" を使ってる
  const el = document.getElementById("totalcoin");
  if (el) el.textContent = "獲得コイン： " + getTotalCoin();
}

function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.totalCoin);
  localStorage.removeItem(STORAGE_KEYS.score);
  localStorage.removeItem(STORAGE_KEYS.resultSet);
  localStorage.removeItem(STORAGE_KEYS.dex);
  // ほかに必要ならここで削除
  updateCoinUI();
}

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// 図鑑操作
function loadDex() {
  return loadJSON(STORAGE_KEYS.dex, {});
}
function saveDex(dex) {
  saveJSON(STORAGE_KEYS.dex, dex);
}
function addDexItem(item) {
  const dex = loadDex();
  if (!dex[item.id]) {
    dex[item.id] = { name: item.name, rarity: item.rarity, count: 1 };
  } else {
    dex[item.id].count += 1;
  }
  saveDex(dex);
}

document.addEventListener("DOMContentLoaded", () => {
  initCoinIfNeeded();
  updateCoinUI();
});

// 他ファイルから使えるようにグローバル公開（module化しない前提）
window.__APP__ = {
  STORAGE_KEYS,
  getTotalCoin,
  setTotalCoin,
  addTotalCoin,
  updateCoinUI,
  resetAllData,
  loadDex,
  saveDex,
  addDexItem,
  loadJSON,
  saveJSON
};