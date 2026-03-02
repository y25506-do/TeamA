// quiz.js
let allquiz = [];  // JSONから読み込んだ全問題データを入れる配列
let quiz = [];     // 今回プレイする10問だけを入れる配列
let count = 0;     // 何問目か
let score = 0;     // 正解数
let timer;         // setIntervalのID
let timeLeft = 20; // 残り秒数

// クイズデータの読み込み
fetch("quiz.json")
  .then((response) => response.json())
  .then((data) => {
    if (!Array.isArray(data)) {
      allquiz = Object.values(data);  // オブジェクトから配列へ
    } else {
      allquiz = data;    // すでに配列ならそのまま
    }
    // 読み込み成功でゲーム開始
    game();
  })
  .catch((error) => {
    console.error("Error:", error);
    const ex = document.getElementById("explanation");
    if (ex) ex.textContent = "データの読み込みに失敗しました。";
  });

// ゲーム開始
function game() {
  localStorage.removeItem(window.__APP__.STORAGE_KEYS.resultSet);
  // 問題が１つもなければ何もできないので終了
  if (allquiz.length === 0) return;
  // 問題をシャッフルして先頭１０問だけ使う
  quiz = allquiz.sort(() => Math.random() - 0.5).slice(0, 10);
  count = 0;
  score = 0;
  showquiz();
}

// １問目の表示
function showquiz() {
  if (count >= quiz.length) {
    finishgame();
    return;
  }
  const current = quiz[count];

  document.getElementById("number").textContent = "問題 " + (count + 1);
  document.getElementById("explanation").textContent = current.explanation;
  document.getElementById("hint").textContent = current.hint;

  const choices = [current.button1, current.button2, current.button3];
  const buttons = [
    document.getElementById("button1"),
    document.getElementById("button2"),
    document.getElementById("button3")
  ];
  // 各ボタンに表示文字とクリック時の処理を設定
  buttons.forEach((btn, index) => {
    if (btn && choices[index]) {
      btn.textContent = choices[index];
      btn.onclick = () => checkAnswer(choices[index], current.answer);
      btn.style.display = "inline-block";
    } else if (btn) {
      btn.style.display = "none";
    }
  });

  resetTimer();
}

// 正誤判定
function checkAnswer(selected, answer) {
  // ボタンを押したらタイマー停止
  clearInterval(timer);

  const current = quiz[count];
  let message = "";
  // 正誤判定
  if (selected === answer) {
    score++;
    message = "✨ 正解です！\n\n";
  } else {
    message = "❌ 残念、不正解...\n";
    message += "正解は: " + answer + "\n\n";
  }
  // 解説表示
  message += "【解説】\n" + (current.kaisetu ?? "");
  alert(message);
  // 次の問題へ
  count++;
  showquiz();
}

// タイマーの初期化とカウントダウン開始
function resetTimer() {

  clearInterval(timer);
  timeLeft = 20;
  // タイマー表示用要素
  const timerLabel = document.getElementById("timer-label"); // 秒数表示
  const timerBar = document.getElementById("timer-bar");     // 残り時間バー
  // 初期表示
  timerLabel.textContent = timeLeft;
  timerBar.style.width = "100%";
  timerBar.style.backgroundColor = "#2196F3";
  // １秒毎に実行するカウントダウン
  timer = setInterval(() => {
    timeLeft--;
    timerLabel.textContent = timeLeft;
    timerBar.style.width = `${(timeLeft / 20) * 100}%`;
    // 残り時間でバーの色変更
    if (timeLeft > 10) {
      timerBar.style.backgroundColor = "#7acf0a";
    } else if (timeLeft > 4) {
      timerBar.style.backgroundColor = "#FFC107";
    } else {
      timerBar.style.backgroundColor = "#F44336";
    }
    // 時間切れになったら自動で次の問題へ
    if (timeLeft <= 0) {
      clearInterval(timer);
      timerLabel.textContent = 0;
      count++;
      showquiz();
    }
  }, 1000);
}
// 終了処理
function finishgame() {
  // タイマー停止
  clearInterval(timer);
  // スコアをlocalStorageに保存
  localStorage.setItem(window.__APP__.STORAGE_KEYS.score, String(score));
  window.location.href = "result.html";
}