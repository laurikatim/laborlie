let cases = [];
let quizCases = [];
let currentIndex = 0;
let score = 0;
let streak = 0;
let totalQuestions = 10;
let mode = "quiz";

fetch("cases.json")
  .then(res => res.json())
  .then(data => {
    cases = data;
    startQuiz(10);
  });

function startInfinite() {
  mode = "infinite";
  score = 0;
  streak = 0;

  document.getElementById("score").innerText = score;
  document.getElementById("streak").innerText = streak;
  document.getElementById("gameCard").style.display = "block";

  loadCase();
}

function startQuiz(number) {
  totalQuestions = number;
  score = 0;
  streak = 0;
  currentIndex = 0;

  document.getElementById("score").innerText = score;
  document.getElementById("streak").innerText = streak;
  document.getElementById("gameCard").style.display = "block";

  quizCases = shuffle([...cases]).slice(0, totalQuestions);

  loadCase();
}

function loadCase() {
  let c;

  if (mode === "infinite") {
    c = cases[Math.floor(Math.random() * cases.length)];
  } else {
    if (currentIndex >= quizCases.length) {
      showEndScreen();
      return;
    }
    c = quizCases[currentIndex];
  }

  document.getElementById("difficulty").innerText = c.difficulty || "easy";
  document.getElementById("result").className = "";
  document.getElementById("labs").innerText = c.labs;
  document.getElementById("result").innerText = "";

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  c.choices.forEach(choice => {
    let btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => checkAnswer(choice);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(choice) {
  const c = quizCases[currentIndex];
  const buttons = document.querySelectorAll("#choices button");

  buttons.forEach(btn => {
    btn.disabled = true;

    if (btn.innerText === c.answer) {
      btn.classList.add("correct-btn");
    } else if (btn.innerText === choice) {
      btn.classList.add("wrong-btn");
    }
  });

  if (choice === c.answer) {
    score++;
    streak++;
    document.getElementById("result").className = "correct";
    document.getElementById("result").innerText =
      "correct 💅 — " + c.explanation;
  } else {
    streak = 0;
    document.getElementById("result").className = "wrong";
    document.getElementById("result").innerText =
      "wrong 😭 — " + c.explanation;
  }

  document.getElementById("score").innerText = score;
  document.getElementById("streak").innerText = streak;
}

function nextCase() {
  if (mode === "quiz") {
    currentIndex++;
  }
  loadCase();
}

function showEndScreen() {
  document.getElementById("difficulty").innerText = "done";
  document.getElementById("labs").innerText =
    `Quiz complete!\n\nFinal score: ${score}/${quizCases.length}`;

  document.getElementById("choices").innerHTML = "";

  document.getElementById("result").className = "";
  document.getElementById("result").innerText =
    score === quizCases.length
      ? "perfect score. clinically unstoppable 💅"
      : "not bad. patient survived… probably.";

}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}
