let allquiz = [];  // JSONから読み込んだ全データ
let quiz = [];   // 出題する10問
let count = 0;  // 今何問目か
let score = 0;  // 正解数
let timer;  // タイマーの入れ物
let timeLeft = 20;  // 残り時間

// JSONのデータを読み込み
fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        allquiz = data;
        game();  // データの読み込みが終わったらゲーム開始
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('explanation').textContent = 'データの読み込みに失敗しました。';
    });

// ゲームの初期化
function game() {
    // シャッフルして10問取得してquizに入れる
    quiz = allquiz.sort(() => Math.random() - 0.5).slice(0, 10);
    count = 0;
    score = 0;
    showquiz();
}

// 問題表示
function showquiz() {
    if(count >= 10) {
        finishgame();
        return;
    }
    const current = quiz[count];

    // --- HTML要素への反映 ---
    
    // 問題番号 (例: 問題1)
    document.getElementById('number').textContent = '問題 ' + (count + 1);
    
    // 問題文
    document.getElementById('explanation').textContent = current.explanation;

    // // ヒント (初期状態は「ヒントを見る」にしておく)
    // const hintElement = document.getElementById('hint');
    // hintElement.textContent = 'ヒントを見る(クリック)';
    // // ヒントをクリックした時の動作
    // hintElement.onclick = function() {
    //     hintElement.textContent = current.hint;
    // };

    // --- 選択肢ボタンのセットアップ ---
    // HTMLにある button1, button2, button3 を使用する
    const choice = [current.button1, current.button2, current.button3]
    const buttons = [
        document.getElementById('button1'),
        document.getElementById('button2'),
        document.getElementById('button3')
    ];

    // 選択肢をボタンに割り当て
    current.choices.forEach((choice, index) => {
        // ボタンが存在する場合のみ処理 (選択肢が3つ未満の場合のエラー防止)
        if (buttons[index]) {
            buttons[index].textContent = choice;
            // クリック時に正誤判定の関数を呼ぶ
            buttons[index].onclick = () => checkAnswer(choice, current.answer);
        }
    });

    resetTimer();
}

// 正誤判定
function checkAnswer(selected, correct){
    clearInterval(timer);

    if(selected === correct){
        score++;
        console.log("正解！");
        // 必要ならここで「正解！」などのアラートや表示を行う
    } else {
        console.log("不正解...");
    }

    // 次の問題へ
    count++;
    showquiz();
}

// タイマー機能
function resetTimer() {
    clearInterval(timer);
    timeLeft = 20;
    
    // HTMLにタイマー表示場所がないため、画面更新はせず内部カウントのみ行う
    timer = setInterval(() => {
        timeLeft--;
        // もしHTMLに <span id="timer"></span> 等があればここで更新する
        // document.getElementById('timer').textContent = timeLeft;

        if(timeLeft <= 0) {
            clearInterval(timer);
            // 時間切れは不正解扱いとして次へ
            console.log("時間切れ");
            count++;
            showquiz(); // showquiz() を呼び出す (元のコードは showquiz だったので修正)
        }
    }, 1000);
}

// ゲーム終了
function finishgame(){
    clearInterval(timer);
    // 少し待ってからアラートを出す（画面描画のため）
    setTimeout(() => {
        alert('終了！\nあなたのスコアは ' + score + ' / 10 問正解です！');
        // ホームに戻るなどの処理が必要ならここに記述
    }, 100);
}