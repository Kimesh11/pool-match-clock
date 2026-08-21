const matchSetupButton =
    document.getElementById("setup-match-button");

const shotButton =
    document.getElementById("shot-button");

const changeTurnButton =
    document.getElementById("change-turn-button");

const matchStartButton =
    document.getElementById("start-match-button");


const lagP1 =
    document.getElementById("player-one-lag");

const lagP2 =
    document.getElementById("player-two-lag");


const p1Indicator =
    document.getElementById("player-one-indicator");

const p2Indicator =
    document.getElementById("player-two-indicator");


const player1 =
    document.getElementById("player-one-input");

const player2 =
    document.getElementById("player-two-input");


const matchTime =
    document.getElementById("match-duration");

const shotClock =
    document.getElementById("shot-clock-duration");


const matchTimer =
    document.getElementById("match-timer");

const shotTimer =
    document.getElementById("shot-timer");


const playerOneMinus =
    document.getElementById("player-one-minus");

const playerOnePlus =
    document.getElementById("player-one-plus");


const playerTwoMinus =
    document.getElementById("player-two-minus");

const playerTwoPlus =
    document.getElementById("player-two-plus");


const playerOneScoreDisplay =
    document.getElementById("player-one-score");

const playerTwoScoreDisplay =
    document.getElementById("player-two-score");


/* =========================
   MATCH STATE
   ========================= */

let currentPlayer = null;

let matchStarted = false;

let timeLimit = 0;

let shotClockDuration = 0;

let shotClockLimit = 0;

let playerOneScore = 0;

let playerTwoScore = 0;

let matchTimerInterval = null;

let scLimit = null;


/* =========================
   MATCH SETUP
   ========================= */

matchSetupButton.addEventListener("click", function () {

    timeLimit = Number(matchTime.value);

    shotClockDuration = Number(shotClock.value);

    shotClockLimit = shotClockDuration;


    playerOneScore = 0;

    playerTwoScore = 0;


    playerOneScoreDisplay.textContent =
        playerOneScore;

    playerTwoScoreDisplay.textContent =
        playerTwoScore;


    document.getElementById("player-one-name").textContent =
        player1.value;

    document.getElementById("player-two-name").textContent =
        player2.value;


    matchTimer.textContent =
        formatTime(timeLimit);

    shotTimer.textContent =
        shotClockLimit;


    document.getElementById("match-screen").style.display =
        "block";

    document.getElementById("match-setup").style.display =
        "none";


    lagP1.textContent =
        player1.value;

    lagP2.textContent =
        player2.value;


    currentPlayer = null;

    matchStarted = false;


    updateCurrentPlayerUI(null);


    /*
     * Disable match controls
     * until the match actually starts.
     */

    shotButton.disabled = true;

    changeTurnButton.disabled = true;

    matchStartButton.disabled = true;

    playerOneMinus.disabled = true;
    playerOnePlus.disabled = true;

    playerTwoMinus.disabled = true;
    playerTwoPlus.disabled = true;
});


/* =========================
   LAG WINNER
   ========================= */

lagP1.addEventListener("click", function () {

    currentPlayer = player1.value;

    updateCurrentPlayerUI(currentPlayer);

    matchStartButton.disabled = false;
});


lagP2.addEventListener("click", function () {

    currentPlayer = player2.value;

    updateCurrentPlayerUI(currentPlayer);

    matchStartButton.disabled = false;
});


/* =========================
   START MATCH
   ========================= */

matchStartButton.addEventListener("click", function () {

    matchStarted = true;

    disableLags();

    matchStartButton.disabled = true;

    shotButton.disabled = false;

    changeTurnButton.disabled = false;


    playerOneMinus.disabled = false;
    playerOnePlus.disabled = false;

    playerTwoMinus.disabled = false;
    playerTwoPlus.disabled = false;


    startMatch();

    startShotClock();
});


/* =========================
   SHOT TAKEN
   ========================= */

shotButton.addEventListener("click", function () {

    if (!matchStarted || currentPlayer === null) {
        return;
    }


    /*
     * A shot does NOT change the player.
     *
     * The current player gets another shot,
     * so we simply restart the shot clock.
     */

    resetShotClock();
});


/* =========================
   CHANGE TURN
   ========================= */

changeTurnButton.addEventListener("click", function () {

    if (!matchStarted || currentPlayer === null) {
        return;
    }


    /*
     * Change the player.
     *
     * IMPORTANT:
     * We do NOT reset the shot clock here.
     */

    switchPlayer();
});


/* =========================
   SWITCH PLAYER
   ========================= */

function switchPlayer() {

    if (currentPlayer === player1.value) {

        currentPlayer = player2.value;

    } else {

        currentPlayer = player1.value;
    }


    updateCurrentPlayerUI(currentPlayer);
}


/* =========================
   RESET SHOT CLOCK
   ========================= */

function resetShotClock() {

    clearInterval(scLimit);

    shotClockLimit = shotClockDuration;

    shotTimer.textContent =
        shotClockLimit;

    startShotClock();
}


/* =========================
   CURRENT PLAYER UI
   ========================= */

function updateCurrentPlayerUI(player) {

    if (player === player1.value) {

        p1Indicator.style.display = "block";

        p2Indicator.style.display = "none";

    } else if (player === player2.value) {

        p2Indicator.style.display = "block";

        p1Indicator.style.display = "none";

    } else {

        p1Indicator.style.display = "none";

        p2Indicator.style.display = "none";
    }
}


/* =========================
   MATCH TIMER
   ========================= */

function startMatch() {

    clearInterval(matchTimerInterval);


    matchTimerInterval = setInterval(function () {

        timeLimit--;

        matchTimer.textContent =
            formatTime(timeLimit);


        if (timeLimit <= 0) {

            timeLimit = 0;

            matchTimer.textContent =
                formatTime(timeLimit);

            clearInterval(matchTimerInterval);

            endMatch();
        }

    }, 1000);
}


/* =========================
   SHOT CLOCK
   ========================= */

function startShotClock() {

    clearInterval(scLimit);


    scLimit = setInterval(function () {

        shotClockLimit--;

        shotTimer.textContent =
            shotClockLimit;


        if (shotClockLimit <= 0) {

            shotClockLimit = 0;

            shotTimer.textContent =
                shotClockLimit;

            clearInterval(scLimit);
        }

    }, 1000);
}


/* =========================
   SCORE BUTTONS
   ========================= */

playerOnePlus.addEventListener("click", function () {

    if (!matchStarted) {
        return;
    }

    addScore(1);
});


playerOneMinus.addEventListener("click", function () {

    if (!matchStarted) {
        return;
    }

    subtractScore(1);
});


playerTwoPlus.addEventListener("click", function () {

    if (!matchStarted) {
        return;
    }

    addScore(2);
});


playerTwoMinus.addEventListener("click", function () {

    if (!matchStarted) {
        return;
    }

    subtractScore(2);
});


/* =========================
   ADD SCORE
   ========================= */

function addScore(player) {

    if (player === 1) {

        playerOneScore++;

        playerOneScoreDisplay.textContent =
            playerOneScore;

    } else if (player === 2) {

        playerTwoScore++;

        playerTwoScoreDisplay.textContent =
            playerTwoScore;
    }
}


/* =========================
   SUBTRACT SCORE
   ========================= */

function subtractScore(player) {

    if (player === 1 && playerOneScore > 0) {

        playerOneScore--;

        playerOneScoreDisplay.textContent =
            playerOneScore;

    } else if (player === 2 && playerTwoScore > 0) {

        playerTwoScore--;

        playerTwoScoreDisplay.textContent =
            playerTwoScore;
    }
}


/* =========================
   DISABLE LAG BUTTONS
   ========================= */

function disableLags() {

    lagP1.disabled = true;

    lagP2.disabled = true;
}


/* =========================
   END MATCH
   ========================= */

function endMatch() {

    matchStarted = false;


    clearInterval(scLimit);


    shotButton.disabled = true;

    changeTurnButton.disabled = true;


    playerOneMinus.disabled = true;
    playerOnePlus.disabled = true;

    playerTwoMinus.disabled = true;
    playerTwoPlus.disabled = true;


    console.log("MATCH FINISHED");
}


/* =========================
   FORMAT TIME
   ========================= */

function formatTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;


    return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;
}