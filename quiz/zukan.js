// zukan.js
document.addEventListener("DOMContentLoaded", () => {
  window.__APP__.updateCoinUI();
  renderDex();
});

function renderDex() {
  const dex = window.__APP__.loadDex();
  const entries = Object.entries(dex);

  const collect = document.getElementById("collect");
  const container = document.getElementById("encyclopedia");

  if (!container) return;

  if (entries.length === 0) {
    if (collect) collect.textContent = "コンプリート率 0/0";
    container.innerHTML = `<p>まだ図鑑が空です。ガチャを回してみてください。</p>`;
    return;
  }

  // コンプリート率：獲得種類 / 全種類（このアプリのプール数）
  // ※ガチャの全種類数は固定（18種類）として計算
  const TOTAL_TYPES = 18;
  const gotTypes = entries.length;
  if (collect) collect.textContent = `コンプリート率 ${gotTypes}/${TOTAL_TYPES}`;

  // レア度順
  const rarityOrder = { SSR: 4, SR: 3, R: 2, N: 1 };
  entries.sort((a, b) => (rarityOrder[b[1].rarity] || 0) - (rarityOrder[a[1].rarity] || 0));

  container.innerHTML = "";
  for (const [id, info] of entries) {
    const div = document.createElement("div");
    div.className = "dex-item"; // style.cssに無ければ普通のdivでもOK
    div.innerHTML = `
      <p><strong>${info.name}</strong>（${info.rarity}）</p>
      <p>所持数：${info.count}</p>
    `;
    container.appendChild(div);
  }
}