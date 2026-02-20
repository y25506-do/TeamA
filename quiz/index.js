// 初回アクセスならコインをリセット
if (!localStorage.getItem("firstvisit")) {
    localStorage.setItem("totalcoin", 0);
    localStorage.setItem("firstvisit", "true");
}
let totalCoin = Number(localStorage.getItem("totalcoin")) || 0;
document.getElementById("totalcoin").textContent = "獲得コイン： " + totalCoin;