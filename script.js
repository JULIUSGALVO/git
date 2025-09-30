const gameArea = document.getElementById("gameArea");
const bird = document.getElementById("bird");
const scoreDisplay = document.getElementById("score");
const pauseScreen = document.getElementById("pauseScreen");
const continueBtn = document.getElementById("continueBtn");
const retryBtn = document.getElementById("retryBtn");
const settingsBtn = document.getElementById("settingsBtn");
const countdownScreen = document.getElementById("countdownScreen");
const countdownText = document.getElementById("countdownText");

let birdY = gameArea.clientHeight * 0.4;
let birdVelocity = 0;
const gravity = 0.3;
const jumpPower = -8;
let score = 0;
let pipes = [];
let gameOver = false;
let paused = false;
let gameStarted = false;

// Jump function
function jump() {
  if (!gameOver && !paused) birdVelocity = jumpPower;
}

// Controls
document.addEventListener("keydown", e => { 
  if(e.code === "Space") jump();
});
gameArea.addEventListener("click", jump);

// Settings button click
settingsBtn.addEventListener("click", togglePause);

// Pause / Continue buttons
continueBtn.addEventListener("click", togglePause);
retryBtn.addEventListener("click", resetGame);

function togglePause() {
  paused = !paused;
  pauseScreen.style.display = paused ? "flex" : "none";
}

// Create pipes
function createPipe() {
  const gap = 180;
  const pipeHeight = Math.floor(Math.random() * (gameArea.clientHeight - gap - 50)) + 50;

  const pipeTop = document.createElement("div");
  pipeTop.classList.add("pipe");
  pipeTop.style.height = pipeHeight + "px";
  pipeTop.style.left = gameArea.clientWidth + "px";
  gameArea.appendChild(pipeTop);

  const pipeBottom = document.createElement("div");
  pipeBottom.classList.add("pipe", "pipe-bottom");
  pipeBottom.style.height = gameArea.clientHeight - pipeHeight - gap + "px";
  pipeBottom.style.left = gameArea.clientWidth + "px";
  gameArea.appendChild(pipeBottom);

  pipes.push({top: pipeTop, bottom: pipeBottom, passed: false});
}

// Game loop
function gameLoop() {
  if(gameOver || paused) return requestAnimationFrame(gameLoop);

  birdVelocity += gravity;
  birdY += birdVelocity;

  if(birdY < 0) birdY = 0;
  bird.style.top = birdY + "px";

  // Game over if bird falls below game area
  if (birdY > gameArea.clientHeight - bird.clientHeight) {
    gameOver = true;
    pauseScreen.style.display = "flex";
    pauseScreen.querySelector("h2").textContent = "Game Over";
    return;
  }

  pipes.forEach(pipe => {
    pipe.top.style.left = pipe.top.offsetLeft - 2 + "px";
    pipe.bottom.style.left = pipe.bottom.offsetLeft - 2 + "px";

    // Collision detection
    const birdRect = bird.getBoundingClientRect();
    const topRect = pipe.top.getBoundingClientRect();
    const bottomRect = pipe.bottom.getBoundingClientRect();
    // Check collision with top pipe
    if (
      birdRect.left < topRect.right &&
      birdRect.right > topRect.left &&
      birdRect.top < topRect.bottom &&
      birdRect.bottom > topRect.top
    ) {
      gameOver = true;
      pauseScreen.style.display = "flex";
      pauseScreen.querySelector("h2").textContent = "Game Over";
      return;
    }
    // Check collision with bottom pipe
    if (
      birdRect.left < bottomRect.right &&
      birdRect.right > bottomRect.left &&
      birdRect.top < bottomRect.bottom &&
      birdRect.bottom > bottomRect.top
    ) {
      gameOver = true;
      pauseScreen.style.display = "flex";
      pauseScreen.querySelector("h2").textContent = "Game Over";
      return;
    }

    // Infinite score
    if(!pipe.passed && pipe.top.offsetLeft + pipe.top.clientWidth < bird.offsetLeft) {
      score++;
      scoreDisplay.textContent = "Score: " + score;
      pipe.passed = true;
    }
  });

  pipes = pipes.filter(pipe => {
    if(pipe.top.offsetLeft + pipe.top.clientWidth < 0){
      pipe.top.remove();
      pipe.bottom.remove();
      return false;
    }
    return true;
  });

  requestAnimationFrame(gameLoop);
}

// Generate pipes every 2.5 seconds
setInterval(() => {
  if(!gameOver && !paused) createPipe();
}, 2500);

// Reset Game
function resetGame() {
  pipes.forEach(pipe => { pipe.top.remove(); pipe.bottom.remove(); });
  pipes = [];
  birdY = gameArea.clientHeight * 0.4;
  birdVelocity = 0;
  // score not reset → infinite
  gameOver = false;
  paused = false;
  pauseScreen.style.display = "none";
  gameLoop();
}


// Countdown function
function startCountdown() {
  let count = 3;
  countdownScreen.style.display = "flex";
  countdownText.textContent = count;
  function nextCount() {
    count--;
    if (count > 0) {
      countdownText.textContent = count;
      setTimeout(nextCount, 1000);
    } else {
      countdownText.textContent = "Go!";
      setTimeout(() => {
        countdownScreen.style.display = "none";
        gameStarted = true;
        gameLoop();
      }, 700);
    }
  }
  setTimeout(nextCount, 1000);
}

// Start game with countdown
startCountdown();
