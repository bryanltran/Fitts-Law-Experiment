const trialsPerDifficulty = 3;
const difficulties = [2, 3, 4, 5, 6];
let currentTrial = 1;
let currentDifficultyIndex = 0;
let allTimes = []; // 2D array to store times for each trial and difficulty combination
let timerStart;
let timerEnd;

function startTrial() {
    document.getElementById('startup-screen').style.display = 'none';
    document.getElementById('experiment-screen').style.display = 'block';
    adjustSquarePositions(); // Adjust square positions based on difficulty index
    document.getElementById('trial-info').innerText = `Trial: ${currentTrial} | Difficulty Index: ${difficulties[currentDifficultyIndex]}`;
}

function startTimer(event) {
    timerStart = performance.now();

    const clickedSquare = event.target;
    const rightSquare = document.getElementById('left-square');

    if (clickedSquare === rightSquare) {
        if (clickedSquare.classList.contains('clicked')) {
            clickedSquare.classList.remove('clicked');
        } else {
            clickedSquare.classList.add('clicked');
        }
    }
}

function recordTime(event) {
    timerEnd = performance.now();
    let timeTaken = timerEnd - timerStart;
    // Store the time in the global 2D array
    if (!allTimes[currentDifficultyIndex]) {
        allTimes[currentDifficultyIndex] = [];
    }
    if (!allTimes[currentDifficultyIndex][currentTrial - 1]) {
        allTimes[currentDifficultyIndex][currentTrial - 1] = [];
    }
    allTimes[currentDifficultyIndex][currentTrial - 1].push(timeTaken);

    // Toggle background color of the clicked square
    const clickedSquare = event.target;
    const rightSquare = document.getElementById('right-square');

    if (clickedSquare === rightSquare) {
        if (clickedSquare.classList.contains('clicked')) {
            clickedSquare.classList.remove('clicked');
        } else {
            clickedSquare.classList.add('clicked');
        }
    }

    if (allTimes[currentDifficultyIndex][currentTrial - 1].length === 5) { // Check for 5 clicks
        showAverageSpeed();
    }
}

function showAverageSpeed() {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < allTimes[currentDifficultyIndex][currentTrial - 1].length; i++) {
        sum += allTimes[currentDifficultyIndex][currentTrial - 1][i];
        count++;
    }
    let averageTime = sum / count;
    document.getElementById('experiment-screen').style.display = 'none';
    document.getElementById('average-speed-screen').style.display = 'block';
    document.getElementById('average-speed').innerText = `Average Movement Time: ${averageTime.toFixed(2)} milliseconds`;
}

function startNextTrial() {
    if (document.getElementById('completion-screen').style.display === 'block') {
        // If completion screen is displayed, do nothing
        return;
    }
    currentTrial++;
    if (currentTrial > trialsPerDifficulty) {
        currentTrial = 1;
        currentDifficultyIndex++;
        if (currentDifficultyIndex >= difficulties.length) {
            showCompletionScreen();
            return;
        }
    }
    document.getElementById('average-speed-screen').style.display = 'none';
    startTrial();
}

function showCompletionScreen() {
    // Hide other screens
    document.getElementById('startup-screen').style.display = 'none';
    document.getElementById('experiment-screen').style.display = 'none';
    document.getElementById('average-speed-screen').style.display = 'none';

    // Display completion screen
    document.getElementById('completion-screen').style.display = 'block';

    // Populate results
    let results = document.getElementById('results');
    results.innerHTML = '<h3>Results</h3>';
    for (let i = 0; i < difficulties.length; i++) {
        const averageSpeed = getAverageSpeed(i);
        if (!isNaN(averageSpeed)) {
            results.innerHTML += `<p>Difficulty Index ${difficulties[i]} - Average Movement Time (Between 3 Trials): ${averageSpeed.toFixed(2)} milliseconds</p>`;
        } else {
            results.innerHTML += `<p>Difficulty Index ${difficulties[i]} - No data available</p>`;
        }
    }
}


function getAverageSpeed(difficultyIndex) {
    let sum = 0;
    let count = 0;
    for (let i = 0; i < trialsPerDifficulty; i++) {
        if (allTimes[difficultyIndex] && allTimes[difficultyIndex][i]) {
            for (let j = 0; j < allTimes[difficultyIndex][i].length; j++) {
                sum += allTimes[difficultyIndex][i][j];
                count++;
            }
        }
    }
    return count > 0 ? sum / count : NaN;
}

function adjustSquarePositions() {
    const distance = difficulties[currentDifficultyIndex] * 100; // Distance between squares based on difficulty index
    document.getElementById('left-square').style.left = `calc(50% - ${distance}px)`;
    document.getElementById('right-square').style.left = `calc(50% + ${distance}px)`;
}
