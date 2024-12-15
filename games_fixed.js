
window.onload = function() {
let questions = [];
let currentQuestionIndex = 0;
let score = 0;
let timer;
let gamePaused = false;
let timerValue = 15; // Timer set to 15 seconds

// Fetch questions from Open Trivia Database API
async function fetchQuestions(category, difficulty) {
    const url = `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=multiple`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        questions = data.results;
        startNewRound();
    } catch (error) {
        console.error('Error fetching questions:', error);
        alert("Error loading questions. Please try again later.");
    }
}

// Start the game
function startGame() {
    if (!gamePaused) {
        const category = document.getElementById("category").value;
        const difficulty = document.getElementById("difficulty").value;
        score = 0;
        document.getElementById("score").textContent = "Score: " + score;
        document.getElementById("startButton").disabled = true; // Disable start button
        fetchQuestions(category, difficulty);
    }
}

// Start a new round
function startNewRound() {
    if (questions.length > 0) {
        currentQuestionIndex = 0;
        displayQuestion();
        startTimer();
    } else {
        alert('No questions available');
    }
}

// Display the current question
function displayQuestion() {
    const currentQuestion = questions[currentQuestionIndex];
    document.getElementById('question').textContent = currentQuestion.question;
    const options = shuffleArray([
        ...currentQuestion.incorrect_answers,
        currentQuestion.correct_answer
    ]);
    for (let i = 0; i < 4; i++) {
        document.getElementById(`option${i}`).textContent = options[i];
    }
}

// Shuffle array to randomize the options
function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

// Handle answer selection
function selectAnswer(selectedIndex) {
    if (gamePaused) return;

    const currentQuestion = questions[currentQuestionIndex];
    const selectedAnswer = document.getElementById(`option${selectedIndex}`).textContent;
    const correctAnswer = currentQuestion.correct_answer;

    if (selectedAnswer === correctAnswer) {
        document.getElementById(`option${selectedIndex}`).classList.add('correct');
        score++;
    } else {
        document.getElementById(`option${selectedIndex}`).classList.add('incorrect');
        // Highlight the correct answer if the selected answer is wrong
        for (let i = 0; i < 4; i++) {
            if (document.getElementById(`option${i}`).textContent === correctAnswer) {
                document.getElementById(`option${i}`).classList.add('correct');
            }
        }
    }

    document.getElementById('score').textContent = "Score: " + score;

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            resetOptions();
            displayQuestion();
            startTimer();
        } else {
            alert(`Game Over! Your score: ${score}`);
            document.getElementById("startButton").disabled = false;
        }
    }, 1000);
}

// Timer for each question
function startTimer() {
    let timeLeft = timerValue;
    document.getElementById('timer').textContent = `Time Left: ${timeLeft}`;
    
    // Clear any existing timer to prevent overlap
    if (timer) {
        clearInterval(timer);
    }
    
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = `Time Left: ${timeLeft}`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            const correctAnswer = questions[currentQuestionIndex].correct_answer;
            // Automatically highlight the correct answer when time is up
            for (let i = 0; i < 4; i++) {
                if (document.getElementById(`option${i}`).textContent === correctAnswer) {
                    document.getElementById(`option${i}`).classList.add('correct');
                }
            }
            setTimeout(() => {
                currentQuestionIndex++;
                if (currentQuestionIndex < questions.length) {
                    resetOptions();
                    displayQuestion();
                    startTimer();
                } else {
                    alert(`Game Over! Your score: ${score}`);
                    document.getElementById("startButton").disabled = false;
                }
            }, 1000);
        }
    }, 1000);
}

// Pause the game
function pauseGame() {
    gamePaused = true;
    clearInterval(timer);
    alert("Game paused");
}

// Reset options (clear previous answer highlights)
function resetOptions() {
    const options = document.querySelectorAll('.btn');
    options.forEach(option => option.classList.remove('correct', 'incorrect'));
}

};
