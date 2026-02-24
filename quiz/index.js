// index.js

document.addEventListener("DOMContentLoaded", () => {
  // コイン表示は common.js が更新するので追加不要（念のため）
  window.__APP__.updateCoinUI();
});

// 「データ削除」ボタン用（index.htmlで onclick="resetcoin()" してる）
function resetcoin() {
  window.__APP__.resetAllData();
  location.reload();
}

// グローバルに見えるように
window.resetcoin = resetcoin;