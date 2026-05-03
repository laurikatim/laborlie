let cases = [];
let current = 0;
let score = 0;
let streak = 0;

fetch('cases.json')
  .then(res => res.json())
  .then(data => {
    cases = data;
    loadCase(
      document.getElementById("category").innerText = c.category || "lab case";
      document.getElementById("difficulty").innerText = c.difficulty || "easy";
    );
  });

function loadCase() {
  current = Math.floor(Math.random() * cases.length);
  const c = cases[current];

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
  const c = cases[current];

  if (choice === c.answer) {
    score++;
    streak++;
    document.getElementById("result").innerText =
      "correct 💅 — " + c.explanation;
  } else {
    streak = 0;
    document.getElementById("result").innerText =
      "wrong 😭 — " + c.explanation;
  }

  document.getElementById("score").innerText = score;
  document.getElementById("streak").innerText = streak;
}

function nextCase() {
  loadCase();
}
