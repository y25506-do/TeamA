// zukan.js
(() => {
  const JSON_PATH = "item.json"; //図鑑に表示するアイテム情報が入っているjsonパス
  const TOTAL_SLOTS = 18;        //図鑑の表示枠の個数
  //common.jsから取得
  const APP = window.__APP__;
  //存在しない場合
  if (!APP) {
    console.error("common.js が先に読み込まれていません（__APP__ が見つかりません）");
    return;
  }
  // 獲得数を表示
  const collectEl = document.getElementById("collect");
  // 図鑑のスロット要素
  const slots = Array.from(document.querySelectorAll(".zukan-slot"));
  // 全アイテムデータを読み込む
  async function loadAllItems() {
    // 常に最新データ
    const res = await fetch(JSON_PATH, { cache: "no-store" });
    // 失敗した場合
    if (!res.ok) throw new Error(`item.json 読み込み失敗: ${res.status}`);
    // jsonデータを取得
    const data = await res.json();

    // {"1": {...}, ...} -> Map(id -> item)
    const map = new Map();
    for (const [id, v] of Object.entries(data)) {
      // idを文字列に統一、保存
      map.set(String(id), { id: String(id), ...v });
    }
    // mapを返す
    return map;
  }
  // 図鑑の1スロットにアイテム情報を表示
  function fillSlot(slot, item, ownedInfo) {
    // 要素取得
    const img = slot.querySelector(".slot-img");        // 画像
    const nameEl = slot.querySelector(".slot-name");    // 名前
    const countEl = slot.querySelector(".slot-count");  // 所持数
    // アイテム所持時
    if (item && ownedInfo) {
      slot.classList.remove("locked");
      // 画像表示
      img.style.display = "block";
      img.src = encodeURI(item.gazou);
      img.alt = item.name;
      // 名前と所持数表示
      nameEl.textContent = item.name;
      countEl.textContent = `×${ownedInfo.count ?? 1}`;
      // 画像が存在しない場合
      img.onerror = () => {
        // 画像が見つからない場合でも名前は出す
        img.style.display = "none";
        countEl.textContent = `×${ownedInfo.count ?? 1}（画像なし）`;
      };
    } else {
      // 未所持の場合
      slot.classList.add("locked");
      // 画像非表示
      img.removeAttribute("src");
      img.alt = "";
      img.style.display = "none";
      // 名前、所持数非表示
      nameEl.textContent = "？？？";
      countEl.textContent = "";
    }
  }
  // メイン処理
  async function main() {
    try {
      // 全アイテムデータ取得
      const allMap = await loadAllItems(); // id -> item
      // ユーザーのデータを取得
      const dex = APP.loadDex();           // id -> {name, rarity, count}
      // 所持しているアイテム数
      let ownedCount = 0;

      // HTMLの18枠を順番に埋める
      for (const slot of slots) {
        // data-idから取得
        const id = String(slot.dataset.id || "");
        // 全アイテムデータから該当するものを取得
        const item = allMap.get(id);
        // 所持データから該当する情報を取得
        const ownedInfo = dex[id];
        // 所持数によってカウント数を増やす
        if (ownedInfo) ownedCount++;
        // スロットに表示反映
        fillSlot(slot, item, ownedInfo);
      }

      // 枠が18個無かったとき用（保険）
      if (slots.length !== TOTAL_SLOTS) {
        console.warn(`枠数が ${slots.length} 個です（想定は ${TOTAL_SLOTS} 個）`);
      }
      // コンプリート率表示
      collectEl.textContent = `コンプリート率${ownedCount}/${TOTAL_SLOTS}`;
    } catch (e) {
      // エラーはコンソールに出力
      console.error(e);
      // 表示も同じく
      collectEl.textContent = "コンプリート率0/18";
    }
  }
  // HTMLの読み込み完了時に実行
  document.addEventListener("DOMContentLoaded", main);
})();