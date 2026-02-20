let totalCoin = Number(localStorage.getItem("totalcoin")) || 0;
document.getElementById("totalcoin").textContent = "獲得コイン： " + totalCoin;