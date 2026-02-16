let allquiz = [];  // JSONから読み込んだ全データ
let quiz = [];   // 出題する10問
let count = 0;  // 今何問目か
let score = 0;  // 正解数
let timer;  // タイマーの入れ物
let timeLeft = 20  // 残り時間

// Jsonのデータを読み込み
fetch('quiz.json')
    .then(response => response.json())
    .then(data => {
        allquiz = data;
        game();  // データの読み込みが終わったらゲーム開始
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('question').textContent = 'データの読み込みに失敗しました。';
    });

// ゲームの初期化
function game() {
    // シャッフルして１０問取得してquizに入れる
    quiz = allquiz.sort(() => Math.random( ) - 0.5).slice(0, 10);
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

    // html要素への反映
    document.getElementById('question').textContent = current.question;
    document.getElementById('current-count').textContent = count + 1;
    document.getElementById('hint-text').textContent = current.hint;
    document.getElementById('hint-text').classList.add('hidden');

    // 選択肢ボタンの生成
    const choicesDiv = document.getElementById('choices-area');
    choicesDiv.innerHTML = '';

    current.choices.forEach(choice => {
        const btn = document.createElement('button');
        btn.textContent = choice;
        btn.className = 'choice-btn';
        // クリック時に正誤判定の関数を呼ぶ
        btn.onclick = () => checkAnswer(choice,current.answer);
        choicesDiv.appendChild(btn);
    });
    resetTimer();
}