// Global Variables
let currentQuestion = null;
let currentQuestionIndex = null; // i ++ / i += 1

let time = 0; // global variable holding the TIME
let score = 0; // global variable holding the SCORE
let timer = null; // global variable holding the timer object
let answerBtns = []; // global variable holding buttons array
let highScores = [];
// { name: BOB, score: 750 }

// These are internal values you can tweak
const correctScoreIncrease = 250; // set variables here so we can play with numbers without hunting through code.
const incorrectTimePenalty = 10; // Same as above, a system wide reference is easy to change than a bunch of random numbers throughout the codebase
const startingTime = 60; // in seconds
const betweenQuestionDelay = 2000; // the amount of time between when you click an answer and when the next question appears
const localStorageKey = "quiz_bowl";

// references to elements on the page
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const scoreOutputText = document.getElementById("score-output");
const quizFooter = document.getElementById("quiz-footer");
const quizBody = document.getElementById("quiz-body");
const quizHeader = document.getElementById("quiz-header");
const timerOutputText = document.getElementById("timer-output");
const theHighScoreTable = document.getElementById("high-score-table");
const highScoreForm = document.getElementById("high-score-form");
const returnToGameBtn = document.getElementById("return-to-game");
const highScoreButton = document.getElementById("high-score-btn");

// questions array
const questions = [
  {
    questionText: "Which is not a primitive data type? ",
    answers: [
      {
        optionText: "Banana",
        isCorrectAnswer: true,
      },
      {
        optionText: "Boolean",
        isCorrectAnswer: false,
      },
      {
        optionText: "String",
        isCorrectAnswer: false,
      },
      {
        optionText: "Number",
        isCorrectAnswer: false,
      },
    ],
  },
  {
    questionText: "JavaScript is a ___ -side programming language.",
    answers: [
      {
        optionText: "Server-side",
        isCorrectAnswer: false,
      },
      {
        optionText: "Neither",
        isCorrectAnswer: false,
      },
      {
        optionText: "Monkey-side",
        isCorrectAnswer: false,
      },
      {
        optionText: "Client-side",
        isCorrectAnswer: true,
      },
    ],
  },
  {
    questionText: "How do you write 'I am a banana' in an alert box?",
    answers: [
      {
        optionText: "alertBox(I am a banana)",
        isCorrectAnswer: false,
      },
      {
        optionText: "I am a banana",
        isCorrectAnswer: false,
      },
      {
        optionText: "window.prompt(I am a banana)",
        isCorrectAnswer: false,
      },
      {
        optionText: "alert(I am a banana)",
        isCorrectAnswer: true,
      },
    ],
  },
  {
    questionText: "How do you create a function?",
    answers: [
      {
        optionText: "function(I throw bananas)",
        isCorrectAnswer: false,
      },
      {
        optionText: "function = myFunction()",
        isCorrectAnswer: true,
      },
      {
        optionText: "function()=myBanana",
        isCorrectAnswer: false,
      },
      {
        optionText: "No, not at all.",
        isCorrectAnswer: false,
      },
    ],
  },
  {
    questionText: "how does a FOR loop start",
    answers: [
      {
        optionText: "for (let i; i < bananaChucker; i++)",
        isCorrectAnswer: false,
      },
      {
        optionText: "for (i < moreBanana; i++)",
        isCorrectAnswer: false,
      },
      {
        optionText: "for (let i = 0; i < banana.length; i++)",
        isCorrectAnswer: true,
      },
      {
        optionText: "for (i king banana = i; i.length; i++)",
        isCorrectAnswer: false,
      },
    ],
  },
];

// ~~~~~~~~~~~~~~~ This area is for function decleration only ~~~~~~~~~~~~~~~
/**
 * This starts the game
 */
function startGame() {
  reset();
  startTimer();
  renderQuestion();
}

/**
 * Reset the game to the beginning state
 */
function reset() {
  retrieveHighScoresFromStorage();
  // quiz stuff
  quizHeader.style.display = "flex";
  quizBody.style.display = "flex";
  quizFooter.style.display = "flex";
  // button collection
  startBtn.style.display = "none";
  restartBtn.style.display = "none";
  highScoreForm.style.display = "none";
  theHighScoreTable.style.display = "none";
  returnToGameBtn.style.display = "none";
  highScoreButton.style.display = "flex";
  // resetting global variables
  score = 0;
  time = startingTime;
  timer = null;
  currentQuestionIndex = 0;
  updateScoreboard();
}

/**
 * The time loop function, we'll use it as an event loop
 */
function startTimer() {
  timer = setInterval(function () {
    // execute this function every X milliseconds
    time -= 1;
    console.log(`timer ticket: ${time}`);
    updateScoreboard();
    if (time <= 0) {
      endGame();
    }
  }, 1000); // in milliseconds, 1000 === 1 second
}

/**
 * Common function to update all scoreboard related elements like
 * TIME
 * SCORE
 */
function updateScoreboard() {
  // Clear
  timerOutputText.innerHTML = "";
  scoreOutputText.innerHTML = "";
  // Element generation
  let timeText = document.createElement("span");
  let scoreText = document.createElement("span");
  // Set element text
  scoreText.innerHTML = `Score: ${score}`;
  timeText.innerHTML = `Time Left: ${time}`;
  // Append elements
  timerOutputText.appendChild(timeText);
  scoreOutputText.appendChild(scoreText);
}

/**
 * Renders the question based off of the global Question Index to the page
 */
function renderQuestion() {
  answerBtns = [];
  quizBody.innerHTML = "";
  quizFooter.innerHTML = "";
  // creating a local instantiation of the question based on the current global question index
  if (currentQuestionIndex < questions.length) {
    const question = questions[currentQuestionIndex];

    // Renders a p tag with the question text inside
    let questionsText = document.createElement("p");
    questionsText.innerHTML = question.questionText;
    quizBody.appendChild(questionsText); // shoves that p tag into the quiz body without consent

    // Iterate over the answers array within the questions object so we don't have to
    // write the same code over and over and over
    for (let i = 0; i < question.answers.length; i += 1) {
      // 1, 2, 3, 4, we can have N answers // solve for n not amount (n === any)
      const answer = question.answers[i];
      // create button for answer with attached click event
      let btn = document.createElement("button");
      btn.innerHTML = `${answer.optionText}`;
      // Added an anon function to a click event listener to submit the answer
      btn.addEventListener("click", function () {
        submitAnswer(answer.isCorrectAnswer, answer.optionText);
      });
      quizBody.appendChild(btn);
      answerBtns.push(btn); // we are putting the button reference in the array so we can disable them all in one fell swoop
    }
  } else {
    endGame();
  }
}

/**
 * anon function attached to the answer buttons passes a boolean if the question
 * is correct or incorrect
 */
function submitAnswer(isCorrect, text) {
  console.log(`Your answer is: ${text}`, isCorrect);

  quizFooter.innerHTML = ""; // clear the quiz footer

  for (let i = 0; i < answerBtns.length; i += 1) {
    // disabling all the answer buttons so people can't mash the fuck out of them
    answerBtns[i].disabled = true;
  }
  //
  let resultsText = document.createElement("p");
  if (isCorrect) {
    // increase their score
    score += correctScoreIncrease;
    resultsText.innerHTML = "Correct";
  } else {
    // decrease their time
    time -= incorrectTimePenalty; // incorrectTimePenalty is set to 10
    resultsText.innerHTML = "Incorrect";
  }
  quizFooter.appendChild(resultsText);

  updateScoreboard();
  // A 2 second delay till the next question loads
  setTimeout(function () {
    currentQuestionIndex += 1;
    renderQuestion();
  }, betweenQuestionDelay);
}

/**
 * Ends the game! 
 */
function endGame() {
  // stop the timer
  clearInterval(timer);
  timer = null; 

  // clear our output sections
  timerOutputText.innerHTML = "";
  scoreOutputText.innerHTML = "";
  quizFooter.innerHTML = "";
  quizBody.innerHTML = "";

  // Show the score
  window.alert(`Your final score is: ${score}`);

  quizHeader.style.display = "none";
  highScoreForm.style.display = "flex";
}

function saveHighScoreToStorage() {
  /* 
  * This saves the high scores array as a string in local storage
  */
  highScores = bubbleSort(highScores); // this mutates the global variable called highScores with an s
  // global mutation is bad, mmmkay
  localStorage.setItem(localStorageKey, JSON.stringify(highScores));
}

function retrieveHighScoresFromStorage() {
  let highScoresFromLocalStorage = localStorage.getItem(localStorageKey);
  // This catches errors so it doesn't explode
  try {
    // this parses the stored string in local storage back to an incomingArray
    highScores = JSON.parse(highScoresFromLocalStorage);
  } catch (e) {
    // this reports the error
    console.error(`failed to get high scores from local storage`, e);
    // sets high scores to whatever
    highScores = [];
  }
  if (!highScores) {
    highScores = [];
  }
  console.log("current High Scores", highScores);
}

/**
 * Bubble Sort
 * SRC: https://flexiple.com/bubble-sort-javascript/
 */
function bubbleSort(incomingArray) {
  let tmpArray = incomingArray; // clone(ish) incoming array
  console.log("bubble sort input", incomingArray);

  if (tmpArray) {
    for (let i = 0; i < tmpArray.length; i += 1) {
      for (let j = 0; j < tmpArray.length; j += 1) {
        if (tmpArray[j + 1]) {
          if (tmpArray[j].score > tmpArray[j + 1].score) {
            let tmp = tmpArray[j];

            tmpArray[j] = tmpArray[j + 1];

            tmpArray[j + 1] = tmp;
          }
        }
      }
    }
  }
  tmpArray.reverse(); // since bubble sort puts biggest at the bottom, we need to zip it, flip it, and reverse it
  // Ti esrever dna ti pilf nwod gniht ym tup i

  console.log("bubble sort output", tmpArray);
  return tmpArray;
}

/**
 * This toggles on the high score table AND
 * it will iterate through all the high scores, creating a table row for each with 3 cells inside the table row
 * 1 for place, 2 for name, 3 for score
 */
function showHighScoreTable() {
  theHighScoreTable.style.display = "table";
  quizBody.style.display = "none";
  startBtn.style.display = "none";
  returnToGameBtn.style.display = "flex";
  highScoreButton.style.display = "none";
  const tableBody = document.getElementById("table-body");
  tableBody.innerHTML = "";

  console.log(highScores);
  for (let i = 0; i < highScores.length; i += 1) {
    const highScore = highScores[i]; // { name: "BOB", score: 750 }
    const row = document.createElement("tr");

    // ranking
    const rankingCell = document.createElement("td");
    rankingCell.innerHTML = "# " + i;
    row.appendChild(rankingCell);

    // name
    const nameCell = document.createElement("td");
    nameCell.innerHTML = highScore.name;
    row.appendChild(nameCell);

    // high score
    const scoreCell = document.createElement("td");
    scoreCell.innerHTML = highScore.score;
    row.appendChild(scoreCell);

    tableBody.appendChild(row); // last thing to call
  }
}

function submitHighScore(e) {
  e.preventDefault();
  const nameInput = document.getElementById("name");
  const name = nameInput.value;

  // { name: "BOB", score: 750 }
  highScore = {
    name: null,
    score: null,
  };

  highScore.score = score;
  highScore.name = name;

  highScores.push(highScore);
  saveHighScoreToStorage();
  nameInput.value = "";
  showHighScoreTable();
  highScoreForm.style.display = "none";
  restartBtn.style.display = "flex";
}

function restart() {
  restartBtn.style.display = "none";
  theHighScoreTable.style.display = "none";
  startGame();
}

function returnToGame() {
  returnToGameBtn.style.display = "none";
  theHighScoreTable.style.display = "none";
  quizBody.style.display = "flex";
  highScoreButton.style.display = "flex";
}
// ~~~~~~~~~~~~~~~ This area is for binding elements to events only

highScoreForm.addEventListener("submit", submitHighScore);
highScoreButton.addEventListener("click", showHighScoreTable);

// add event listener to generate button
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restart);
returnToGameBtn.addEventListener("click", returnToGame);

// this is ugly, but we are flicking things off on document.load
quizHeader.style.display = "none";
highScoreForm.style.display = "none";
theHighScoreTable.style.display = "none";
restartBtn.style.display = "none";
returnToGameBtn.style.display = "none";
// ~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~~
