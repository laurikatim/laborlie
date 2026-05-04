let cases = [];
let quizCases = [];
let currentCase = null;
let currentIndex = 0;
let score = 0;
let streak = 0;
let totalQuestions = 10;
let mode = "quiz";

fetch("cases.json")
  .then(res => res.json())
  .then(data => {
    cases = data;
  });

function startInfinite() {
  mode = "infinite";
  score = 0;
  streak = 0;

  document.getElementById("score").innerText = score;
  document.getElementById("streak").innerText = streak;
  document.getElementById("gameCard").style.display = "block";
  document.getElementById("nextBtn").style.display = "inline-block";

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
  document.getElementById("nextBtn").style.display = "inline-block";

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

  currentCase = c;

  document.getElementById("difficulty").innerText = c.difficulty || "easy";
  document.getElementById("result").className = "";
  document.getElementById("labs").innerText = c.labs;
  document.getElementById("result").innerText = "";
  document.getElementById("pearlBox").style.display = "none";

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  let shuffledChoices = shuffle([...c.choices]);

  shuffledChoices.forEach(choice => {
    let btn = document.createElement("button");
    btn.innerText = choice;
    btn.onclick = () => checkAnswer(choice);
    choicesDiv.appendChild(btn);
  });
}

function checkAnswer(choice) {
  const c = currentCase;
  const buttons = document.querySelectorAll("#choices button");

  // 🔹 1. color buttons
  buttons.forEach(btn => {
    btn.disabled = true;

    if (btn.innerText === c.answer) {
      btn.classList.add("correct-btn");
    } else if (btn.innerText === choice) {
      btn.classList.add("wrong-btn");
    }
  });

  // 🔹 2. show pearl (ONLY ONCE)
  if (c.pearl) {
    document.getElementById("pearlText").innerText = "💡 " + c.pearl;
    document.getElementById("pearlBox").style.display = "block";
  } else {
    document.getElementById("pearlBox").style.display = "none";
  }

  // 🔹 3. result message
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

  // 🔹 4. update score
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
  document.getElementById("nextBtn").style.display = "none";

}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function toggleNormalValues() {
  const box = document.getElementById("normalValuesBox");

  if (box.style.display === "none") {
    box.style.display = "block";
  } else {
    box.style.display = "none";
  }
}

function openNormalValues() {
  document.getElementById("normalModal").style.display = "block";
}

function closeNormalValues() {
  document.getElementById("normalModal").style.display = "none";
}

function shareGame() {
  const url = window.location.href;
  const text = "play this chaotic medical lab game 😭💅";

  if (navigator.share) {
    navigator.share({
      title: "lab or lie?",
      text: text,
      url: url
    });
  } else {
    // fallback (copy link)
    navigator.clipboard.writeText(url);
    alert("link copied 💌");
  }
}

function goHome() {
  // hide game
  document.getElementById("gameCard").style.display = "none";

  // reset scores
  score = 0;
  streak = 0;
  currentIndex = 0;

  document.getElementById("score").innerText = "0";
  document.getElementById("streak").innerText = "0";

  // clear UI
  document.getElementById("labs").innerText = "";
  document.getElementById("choices").innerHTML = "";
  document.getElementById("result").innerText = "";
  document.getElementById("pearlBox").style.display = "none";
  document.getElementById("nextBtn").style.display = "inline-block";
}

window.onclick = function(event) {
  const modal = document.getElementById("normalModal");

  if (event.target === modal) {
    modal.style.display = "none";
  }
}
