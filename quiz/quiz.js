// quiz.js
let allquiz = [];
let quiz = [];
let count = 0;
let score = 0;
let timer;
let timeLeft = 20;

fetch("quiz.json")
  .then((response) => response.json())
  .then((data) => {
    if (!Array.isArray(data)) {
      allquiz = Object.values(data);
    } else {
      allquiz = data;
    }
    game();
  })
  .catch((error) => {
    console.error("Error:", error);
    const ex = document.getElementById("explanation");
    if (ex) ex.textContent = "データの読み込みに失敗しました。";
  });

function game() {
  localStorage.removeItem(window.__APP__.STORAGE_KEYS.resultSet);

  if (allquiz.length === 0) return;

  quiz = allquiz.sort(() => Math.random() - 0.5).slice(0, 10);
  count = 0;
  score = 0;
  showquiz();
}

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

function checkAnswer(selected, answer) {
  clearInterval(timer);

  const current = quiz[count];
  let message = "";

  if (selected === answer) {
    score++;
    message = "✨ 正解です！\n\n";
  } else {
    message = "❌ 残念、不正解...\n";
    message += "正解は: " + answer + "\n\n";
  }

  message += "【解説】\n" + (current.kaisetu ?? "");
  alert(message);

  count++;
  showquiz();
}

function resetTimer() {
  clearInterval(timer);
  timeLeft = 20;

  const timerLabel = document.getElementById("timer-label");
  const timerBar = document.getElementById("timer-bar");

  timerLabel.textContent = timeLeft;
  timerBar.style.width = "100%";
  timerBar.style.backgroundColor = "#2196F3";

  timer = setInterval(() => {
    timeLeft--;
    timerLabel.textContent = timeLeft;
    timerBar.style.width = `${(timeLeft / 20) * 100}%`;

    if (timeLeft > 10) {
      timerBar.style.backgroundColor = "#7acf0a";
    } else if (timeLeft > 4) {
      timerBar.style.backgroundColor = "#FFC107";
    } else {
      timerBar.style.backgroundColor = "#F44336";
    }

    if (timeLeft <= 0) {
      clearInterval(timer);
      timerLabel.textContent = 0;
      count++;
      showquiz();
    }
  }, 1000);
}

function finishgame() {
  clearInterval(timer);
  localStorage.setItem(window.__APP__.STORAGE_KEYS.score, String(score));
  window.location.href = "result.html";
}