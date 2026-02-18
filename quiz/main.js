let allquiz = [];
let quiz = [];
let count = 0;
let score = 0;
let timer;
let timeLeft = 20;

fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        // もしJSONがオブジェクト形式（元のデータのまま）だった場合、配列に変換する処理
        if (!Array.isArray(data)) {
            allquiz = Object.values(data);
        } else {
            allquiz = data;
        }
        game();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('explanation').textContent = 'データの読み込みに失敗しました。';
    });

function game() {
    // データが空でないか確認
    if(allquiz.length === 0) return;
    
    // シャッフルして最大10問（データが足りない場合はあるだけ）取得
    quiz = allquiz.sort(() => Math.random() - 0.5).slice(0, 10);
    count = 0;
    score = 0;
    showquiz();
}

function showquiz() {
    if(count >= quiz.length) { // 10問または全問終わったら終了
        finishgame();
        return;
    }
    const current = quiz[count];

    document.getElementById('number').textContent = '問題 ' + (count + 1);
    
    // JSONのキー名 "explanation" を使用
    document.getElementById('explanation').textContent = current.explanation;
    
    // ヒントの表示
    document.getElementById('hint').textContent = current.hint;

    // 選択肢ボタン
    const choices = [current.button1, current.button2, current.button3];
    
    const buttons = [
        document.getElementById('button1'),
        document.getElementById('button2'),
        document.getElementById('button3')
    ];

    buttons.forEach((btn, index) => {
        if (btn && choices[index]) {
            btn.textContent = choices[index];
            btn.onclick = () => checkAnswer(choices[index], current.answer);
            btn.style.display = 'inline-block'; // ボタンを表示
        } else if (btn) {
            btn.style.display = 'none'; // 選択肢がないボタンは隠す
        }
    });

    resetTimer();
}

function checkAnswer(selected, answer) {
    clearInterval(timer); // タイマーを止める

    // 現在の問題のデータを取得（解説を表示するため）
    const current = quiz[count];
    let message = "";

    // 1. 正誤判定とメッセージの作成
    if (selected === answer) {
        score++;
        message = "✨ 正解です！\n\n";
    } else {
        message = "❌ 残念、不正解...\n";
        message += "正解は: " + answer + "\n\n";
    }

    // 2. 解説を追加
    message += "【解説】\n" + current.kaisetu;

    // 3. アラートを表示
    alert(message);

    // 4. 次の問題へ
    count++;
    showquiz();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 20;
      // タイマー表示用の要素があれば更新 (例: document.getElementById('timer').textContent = timeLeft;)
    const timerLabel = document.getElementById('timer-label');
    const timerBar = document.getElementById('timer-bar');

    // 初期化
    timerLabel.textContent = timeLeft;
    timerBar.style.width = '100%';
    timerBar.style.backgroundColor = '#2196F3'; // 青

    timer = setInterval(() => {
        timeLeft--;
        timerLabel.textContent = timeLeft;
        timerBar.style.width = `${(timeLeft / 20) * 100}%`;

        // 色変化：青→黄→赤
        if(timeLeft > 10) {
            timerBar.style.backgroundColor = '#2196F3'; // 青
        } else if(timeLeft > 5) {
            timerBar.style.backgroundColor = '#FFC107'; // 黄
        } else {
            timerBar.style.backgroundColor = '#F44336'; // 赤
        }

        if(timeLeft <= 0) {
            clearInterval(timer);
            timerLabel.textContent = 0;
            console.log("時間切れ");
            count++;
            showquiz();
        }
    }, 1000);
}


function finishgame(){
    clearInterval(timer);
    setTimeout(() => {
        alert('終了！\nあなたのスコアは ' + score + ' / ' + quiz.length + ' 問正解です！');
    }, 100);
}
