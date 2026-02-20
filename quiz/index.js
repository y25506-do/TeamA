//index.htmlの時だけコインを０にする
if (performance.navigation.type === 1) {
    localStorage.clear();
}
// totalcoin がまだ存在しないときだけ 0 にする
if (localStorage.getItem("totalcoin") === null) {
    localStorage.setItem("totalcoin", 0);
}

let totalcoin = Number(localStorage.getItem("totalcoin"));
document.getElementById("totalcoin").textContent =
    "獲得コイン： " + totalcoin;