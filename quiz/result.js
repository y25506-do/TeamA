//結果画面用
let coin = 0;
//数値にする
score = Number(localStorage.getItem("score"));

document.getElementById("comment1").textContent= "あなたのスコアは 10問中" + score + "問正解です。" 

if(score >= 0 && score <= 3)
{
    coin = 1;
    document.getElementById("comment2").textContent = "分からない問題多かったでしょう。中には関心を持つ問題や問題を考えた人の特徴が見えたと思います。少しずつスコアをあげましょう。";
}
else if(score >= 4 && score <= 6)
{
    coin = 2;
    document.getElementById("comment2").textContent = "ある程度問題解けたかな？問題を解いているとその人がどんな気持ちで考えたのか分かっていくはずです。君なら満点目指せるよ。";
}
else if(score >= 7 && score <= 9)
{   
    coin = 3;
    document.getElementById("comment2").textContent = "ほぼほぼ問題解けるようになったね。この調子で満点を取れたらいいですね。頑張りましょう。";
}
else
{
    coin = 5;
    document.getElementById("comment2").textContent = "満点取れましたね！しかし、問題は合計４０問あります。全部解けるように今後も頑張りましょう。";
}

let coinadded = localStorage.getItem("coinadded");
//累計コイン　初期状態は０
let totalCoin = Number(localStorage.getItem("totalcoin")) || 0;
//加算していない場合
if(!coinadded)
{
    totalCoin+=coin;
    localStorage.setItem("totalcoin",totalCoin);
    //加算し終わったら
    localStorage.setItem("coinadded", "true");
}
document.getElementById("totalcoin").textContent = "獲得コイン： " + totalCoin;
function resetcoin()
{
    localStorage.setItem("totalcoin", 0);
    localStorage.removeItem("coinadded");
    location.reload();
}