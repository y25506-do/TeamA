// gacha.js
(() => {
  // 1回ガチャを回すのに必要なコイン数
  const COST = 10;
  // common.js側で用意したものを取得
  const APP = window.__APP__;
  if (!APP) {
    console.error("common.js が先に読み込まれていません（__APP__ が見つかりません）");
    return;
  }
  // gacha.html側の要素を取得
  const btn = document.getElementById("gacha-btn2");
  const resultBox = document.getElementById("resultBox");
  const resultImg = document.getElementById("resultImg");
  const resultName = document.getElementById("resultName");
  const resultError = document.getElementById("resultError");
  // 必要な要素が１つでもないなら動かせないので中断
  if (!btn || !resultBox || !resultImg || !resultName || !resultError) {
    console.error("gacha.html の要素が足りません");
    return;
  }
  // item.jsonの読込結果をキャッシュして毎回fetchしないようにする
  let itemsCache = null;
  // item.jsonを読み込んで配列二整形して返す
  async function loadItems() {
    const res = await fetch("item.json", { cache: "no-store" });
    if (!res.ok) throw new Error(`JSON読み込み失敗: ${res.status}`);

    const data = await res.json();

    // {"1": {...}, "2": {...}} 形式 から 配列化（id付き）に変換
    const items = Array.isArray(data)
      ? data.map((v, i) => ({ id: String(i + 1), ...v }))
      : Object.entries(data).map(([id, v]) => ({ id, ...v }));

    const cleaned = items.filter(x => x && x.id && x.gazou && x.name);
    if (cleaned.length === 0) throw new Error("JSONに有効なアイテムがありません");

    return cleaned;
  }

  // itemsの中からランダムで１つ選ぶ
  function pickRandom(items) {
    return items[Math.floor(Math.random() * items.length)];
  }

  // 選ばれたitemを画面に表示する
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
    // 画像読み込み成功 → 画像を表示
    resultImg.onload = () => {
      resultImg.style.display = "block";
    };
    // 画像読み込み失敗 → 画像を隠しエラー表示
    resultImg.onerror = () => {
      resultImg.style.display = "none";
      resultError.hidden = false;
    };
  }

  // ボタンを押したときにガチャを実行する処理
  async function onGacha() {
    // 連打防止
    btn.disabled = true;

    try {
      // 総コイン数を取得
      const coin = APP.getTotalCoin();
      // コインが足りないとき中断
      if (coin < COST) {
        alert("コインが足りません");
        return;
      }

      if (!itemsCache) itemsCache = await loadItems();

      // ランダムに１つ選択
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
      // エラー時の処理
      console.error(e);
      alert("ガチャの実行に失敗しました");
    } finally {
      btn.disabled = false;
    }
  }

  // ボタンがクリックされたらonGachaを実行
  btn.addEventListener("click", onGacha);
})();