// gacha.js
(() => {
  const COST = 10;

  const APP = window.__APP__;
  if (!APP) {
    console.error("common.js が先に読み込まれていません（__APP__ が見つかりません）");
    return;
  }

  const btn = document.getElementById("gacha-btn2");
  const resultBox = document.getElementById("resultBox");
  const resultImg = document.getElementById("resultImg");
  const resultName = document.getElementById("resultName");
  const resultError = document.getElementById("resultError");

  if (!btn || !resultBox || !resultImg || !resultName || !resultError) {
    console.error("gacha.html の要素が足りません");
    return;
  }

  let itemsCache = null;

  async function loadItems() {
    const res = await fetch("item.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`JSON読み込み失敗: ${res.status}`);

    const data = await res.json();

    // {"1": {...}, "2": {...}} 形式 -> 配列化（id付き）
    const items = Array.isArray(data)
      ? data.map((v, i) => ({ id: String(i + 1), ...v }))
      : Object.entries(data).map(([id, v]) => ({ id, ...v }));

    const cleaned = items.filter(x => x && x.id && x.gazou && x.name);
    if (cleaned.length === 0) throw new Error("JSONに有効なアイテムがありません");

    return cleaned;
  }

  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  function showItem(item) {
    // 結果ボックスを表示（CSSが担当）
    resultBox.classList.add("open");

    // エラーを一旦消す
    resultError.hidden = true;

    // 名前
    resultName.textContent = item.name;

    // 画像（成功したら表示、失敗したらエラー表示）
    resultImg.style.display = "none";
    resultImg.alt = item.name;
    resultImg.src = encodeURI(item.gazou);

    resultImg.onload = () => {
      resultImg.style.display = "block";
    };
    resultImg.onerror = () => {
      resultImg.style.display = "none";
      resultError.hidden = false;
    };
  }

  async function onGacha() {
    btn.disabled = true;

    try {
      const coin = APP.getTotalCoin();
      if (coin < COST) {
        alert("コインが足りません");
        return;
      }

      if (!itemsCache) itemsCache = await loadItems();

      const item = pickRandom(itemsCache);

      // 表示
      showItem(item);

      // コイン消費
      APP.setTotalCoin(coin - COST);

      // 図鑑保存（common.js の dex_items）
      APP.addDexItem({
        id: item.id,
        name: item.name,
        rarity: item.rarity ?? "N",
      });

    } catch (e) {
      console.error(e);
      alert("ガチャの実行に失敗しました");
    } finally {
      btn.disabled = false;
    }
  }

  btn.addEventListener("click", onGacha);
})();