// 共通の機能
// 全ページ共通：コイン管理＆表示更新

const STORAGE_KEYS = {
  totalCoin: "totalcoin", // 総コイン数
  score: "score",         // スコア
  resultSet: "resultset", // 結果セット
  dex: "dex_items" // 図鑑用（獲得アイテムの保存）
};

// コインがまだ保存されていない初回だけ０を保存して初期化
function initCoinIfNeeded() {
  if (localStorage.getItem(STORAGE_KEYS.totalCoin) === null) {
    localStorage.setItem(STORAGE_KEYS.totalCoin, "0");
  }
}

// 総コイン数を取得
function getTotalCoin() {
  initCoinIfNeeded();
  return Number(localStorage.getItem(STORAGE_KEYS.totalCoin)) || 0;
}

// 総コイン数の設定
function setTotalCoin(v) {
  const n = Math.max(0, Math.floor(Number(v) || 0));
  localStorage.setItem(STORAGE_KEYS.totalCoin, String(n));
  updateCoinUI();
}

// 総コイン数を増減させる
function addTotalCoin(delta) {
  setTotalCoin(getTotalCoin() + (Number(delta) || 0));
}

// 画面に表示されているコイン表記の更新
function updateCoinUI() {
  // index/result/gacha/zukan では id="totalcoin" を使ってる
  const el = document.getElementById("totalcoin");
  if (el) el.textContent = "獲得コイン： " + getTotalCoin();
}

// 保存しているデータをすべて削除
function resetAllData() {
  localStorage.removeItem(STORAGE_KEYS.totalCoin);
  localStorage.removeItem(STORAGE_KEYS.score);
  localStorage.removeItem(STORAGE_KEYS.resultSet);
  localStorage.removeItem(STORAGE_KEYS.dex);
  // ほかに必要ならここで削除
  updateCoinUI();
}

// localStorageからJSONを読み込む
function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    // エラーが起きた場合初期値を返す
    return fallback;
  }
}

// localStorageへJSONを保存する
function saveJSON(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// 図鑑操作

// 図鑑データを読み込む
function loadDex() {
  return loadJSON(STORAGE_KEYS.dex, {});
}

// 図鑑データの保存
function saveDex(dex) {
  saveJSON(STORAGE_KEYS.dex, dex);
}

// 図鑑にアイテムを追加
function addDexItem(item) {
  const dex = loadDex();
  if (!dex[item.id]) {
    // 新規登録（count = 1）
    dex[item.id] = { name: item.name, rarity: item.rarity, count: 1 };
  } else {
    // すでにあるならcount+1
    dex[item.id].count += 1;
  }
  saveDex(dex);
}

// 
document.addEventListener("DOMContentLoaded", () => {
  initCoinIfNeeded();
  updateCoinUI();
});

// 他のjsファイルからでも使えるようにまとめて公開
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