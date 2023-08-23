// Images for the cards
let symbols = [
    '../fourth-phase/img/harry-potter.jpg',
    '../fourth-phase/img/james-potter.jpg',
    '../fourth-phase/img/lily-potter.jpg',
];

let gameBoard = document.getElementById('game-board');
let flippedCards = [];
let matchedPairs = 0;
let canFlip = true;
let moves = 0;
let startTime = null;
let timerInterval = null;
let seconds = 0;

function shuffleArray(array) {
    let shuffledArray = array.slice();
    for (let i = shuffledArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
}

function createCard(symbol) {
    let card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<div class="card-back"><img src='${symbol}'></div><div class="card-front"><img src="../fourth-phase/img/back.jpg"></div>`;
    return card;
}

function createGameBoard() {
    let shuffledSymbols = shuffleArray(symbols.concat(symbols));

    for (let symbol of shuffledSymbols) {
        let card = createCard(symbol);
        gameBoard.appendChild(card);
        card.addEventListener('click', function () {
            flipCard(card);
        });
    }

    shuffleCards();
    matchedPairs = 0; // Initialize matches count
}

function shuffleCards() {
    let cards = Array.from(gameBoard.querySelectorAll('.card'));
    cards.forEach(card => {
        let randomPosition = Math.floor(Math.random() * cards.length);
        gameBoard.appendChild(card);
        cards.splice(randomPosition, 0, card);
    });
}

function flipCard(card) {
    if (!canFlip) {
        return;
    }

    if (!startTime) {
        startTime = new Date().getTime();
        startTimer(); // Start the timer when the player makes the first move
    }

    if (card.classList.contains('flipped') || flippedCards.length >= 2) {
        return;
    }

    card.classList.add('flipped');
    flippedCards.push(card);

    if (flippedCards.length === 2) {
        canFlip = false; // Disable flipping until cards are checked
        setTimeout(checkForMatch, 1000);
    }
}

function startTimer() {
    timerInterval = setInterval(updateTimer, 1000); // Update timer every second
}

function updateTimer() {
    seconds++;
    let timerElement = document.getElementById('timer');
    timerElement.textContent = `Time: ${seconds} seconds`;
}

function stopTimer() {
    clearInterval(timerInterval); // Stop the timer
}

function calculateScore() {
    if (matchedPairs === symbols.length) {
        // Calculate the score
        const score = ((106 - moves) / seconds) * 1000;
        return score.toFixed(2); // Round to 2 decimal places
    } else {
        return 0; // Game not won, score is 0
    }
}

function checkForMatch() {
    let [card1, card2] = flippedCards;
    let symbol1 = card1.querySelector('.card-back img').src;
    let symbol2 = card2.querySelector('.card-back img').src;

    if (symbol1 === symbol2) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        matchedPairs++;
        updateMatches(); // Update the matches count
        if (matchedPairs === symbols.length) {
            stopTimer(); // Stop the timer when the game is won
            const score = calculateScore();
            alert(`Congratulations! You won the game!\nYour score: ${score}`);
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
    }

    flippedCards = [];
    canFlip = true; // Re-enable flipping after cards are checked

    // Update the score and provide feedback
    updateScore();
}

function updateScore() {
    moves++;
    let scoreElement = document.getElementById('score');
    scoreElement.textContent = `Moves: ${moves}`;

    let feedback = '';
    if (moves <= 5) {
        feedback = 'Excellent!';
    } else if (moves < 8) {
        feedback = 'Great job!';
    } else {
        feedback = 'Keep practicing!';
    }

    let feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = feedback;
}

function updateMatches() {
    let matchesElement = document.getElementById('matches');
    matchesElement.textContent = `Matches: ${matchedPairs}`;
}

function restartGame() {
    // Clear the game board
    gameBoard.innerHTML = '';

    // Reset counters
    moves = 0;
    matchedPairs = 0;
    seconds = 0;

    // Reset timers
    stopTimer();
    startTime = null;

    // Clear feedback
    let feedbackElement = document.getElementById('feedback');
    feedbackElement.textContent = '';

    // Call the function to create the game board again
    createGameBoard();
}

function goHome() {
    window.location.href = "start-index.html"; // Redirect to the start page
}

// Call the function to create the game board
createGameBoard();
