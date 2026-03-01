(() => {
  const JSON_PATH = "item.json"; // あなたの構成だとこれでOK
  const TOTAL_SLOTS = 18;

  const APP = window.__APP__;
  if (!APP) {
    console.error("common.js が先に読み込まれていません（__APP__ が見つかりません）");
    return;
  }

  const collectEl = document.getElementById("collect");
  const slots = Array.from(document.querySelectorAll(".zukan-slot"));

  async function loadAllItems() {
    const res = await fetch(JSON_PATH, { cache: "no-store" });
    if (!res.ok) throw new Error(`item.json 読み込み失敗: ${res.status}`);
    const data = await res.json();

    // {"1": {...}, ...} -> Map(id -> item)
    const map = new Map();
    for (const [id, v] of Object.entries(data)) {
      map.set(String(id), { id: String(id), ...v });
    }
    return map;
  }

  function fillSlot(slot, item, ownedInfo) {
    const img = slot.querySelector(".slot-img");
    const nameEl = slot.querySelector(".slot-name");
    const countEl = slot.querySelector(".slot-count");

    if (item && ownedInfo) {
      slot.classList.remove("locked");

      img.style.display = "block";
      img.src = encodeURI(item.gazou);
      img.alt = item.name;

      nameEl.textContent = item.name;
      countEl.textContent = `×${ownedInfo.count ?? 1}`;

      img.onerror = () => {
        // 画像が見つからない場合でも名前は出す
        img.style.display = "none";
        countEl.textContent = `×${ownedInfo.count ?? 1}（画像なし）`;
      };
    } else {
      slot.classList.add("locked");

      img.removeAttribute("src");
      img.alt = "";
      img.style.display = "none";

      nameEl.textContent = "？？？";
      countEl.textContent = "";
    }
  }

  async function main() {
    try {
      const allMap = await loadAllItems(); // id -> item
      const dex = APP.loadDex();           // id -> {name, rarity, count}

      let ownedCount = 0;

      // HTMLの18枠を順番に埋める
      for (const slot of slots) {
        const id = String(slot.dataset.id || "");
        const item = allMap.get(id);
        const ownedInfo = dex[id];

        if (ownedInfo) ownedCount++;
        fillSlot(slot, item, ownedInfo);
      }

      // 枠が18個無かったとき用（保険）
      if (slots.length !== TOTAL_SLOTS) {
        console.warn(`枠数が ${slots.length} 個です（想定は ${TOTAL_SLOTS} 個）`);
      }

      collectEl.textContent = `コンプリート率${ownedCount}/${TOTAL_SLOTS}`;
    } catch (e) {
      console.error(e);
      collectEl.textContent = "コンプリート率0/18";
    }
  }

  document.addEventListener("DOMContentLoaded", main);
})();