// result.js
document.addEventListener("DOMContentLoaded", () => {
  const keys = window.__APP__.STORAGE_KEYS;

  const score = Number(localStorage.getItem(keys.score)) || 0;
  const comment1 = document.getElementById("comment1");
  const comment2 = document.getElementById("comment2");

  if (comment1) comment1.textContent = "あなたのスコアは 10問中" + score + "問正解です。";

  // コイン付与：ここでは「score枚」を付与（あなたの現仕様）
  const coin = score;

  if (comment2) {
    if (score >= 0 && score <= 3) {
      comment2.textContent = "分からない問題多かったでしょう。少しずつスコアをあげましょう。";
    } else if (score <= 6) {
      comment2.textContent = "ある程度問題解けたかな？君なら満点目指せるよ。";
    } else if (score <= 9) {
      comment2.textContent = "ほぼほぼ問題解けるようになったね。この調子で満点を取れたらいいですね。";
    } else {
      comment2.textContent = "満点取れましたね！今後も頑張りましょう。";
    }
  }

  // 二重加算防止
  if (!localStorage.getItem(keys.resultSet)) {
    window.__APP__.addTotalCoin(coin);
    localStorage.setItem(keys.resultSet, "true");
  }

  // 表示更新
  window.__APP__.updateCoinUI();
});