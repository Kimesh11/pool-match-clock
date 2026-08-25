/* =========================================================
   ELEMENTS
   ========================================================= */

const matchSetupButton =
    document.getElementById("setup-match-button");

const shotButton =
    document.getElementById("shot-button");

const changeTurnButton =
    document.getElementById("change-turn-button");

const matchStartButton =
    document.getElementById("start-match-button");


/* =========================================================
   LAG
   ========================================================= */

const lagP1 =
    document.getElementById("player-one-lag");

const lagP2 =
    document.getElementById("player-two-lag");


/* =========================================================
   CURRENT PLAYER INDICATORS
   ========================================================= */

const p1Indicator =
    document.getElementById("player-one-indicator");

const p2Indicator =
    document.getElementById("player-two-indicator");


/* =========================================================
   PLAYERS
   ========================================================= */

const player1 =
    document.getElementById("player-one-input");

const player2 =
    document.getElementById("player-two-input");


let currentPlayer = null;

let matchStarted = false;


/* =========================================================
   MATCH SETTINGS
   ========================================================= */

const matchTime =
    document.getElementById("match-duration");

const shotClock =
    document.getElementById("shot-clock-duration");


let shotClockDuration = 0;

let timeLimit = 0;

let shotClockLimit = 0;

let scLimit = null;

let matchTimerInterval = null;


/* =========================================================
   TIMER DISPLAY
   ========================================================= */

const matchTimer =
    document.getElementById("match-timer");

const shotTimer =
    document.getElementById("shot-timer");


/* =========================================================
   SCORE BUTTONS
   ========================================================= */

const playerOneMinus =
    document.getElementById("player-one-minus");

const playerOnePlus =
    document.getElementById("player-one-plus");

const playerTwoMinus =
    document.getElementById("player-two-minus");

const playerTwoPlus =
    document.getElementById("player-two-plus");


/* =========================================================
   SCORE DISPLAY
   ========================================================= */

const playerOneScoreDisplay =
    document.getElementById("player-one-score");

const playerTwoScoreDisplay =
    document.getElementById("player-two-score");


let playerOneScore = 0;

let playerTwoScore = 0;


/* =========================================================
   BALL SET SELECTION
   ========================================================= */

const redBallButton =
    document.getElementById("red-ball-button");

const yellowBallButton =
    document.getElementById("yellow-ball-button");


const playerOneBallIndicator =
    document.getElementById("player-one-ball-indicator");

const playerTwoBallIndicator =
    document.getElementById("player-two-ball-indicator");


const playerOneBallSetDisplay =
    document.getElementById("player-one-ball-set");

const playerTwoBallSetDisplay =
    document.getElementById("player-two-ball-set");


let playerOneBallSet = null;

let playerTwoBallSet = null;


/* =========================================================
   SHOT TAKEN
   ========================================================= */

shotButton.addEventListener("click", function () {

    if (currentPlayer == null) {
        return;
    }


    /*
     * The player takes a shot.
     *
     * The current player does NOT change here.
     *
     * The shot clock simply restarts.
     */

    clearInterval(scLimit);

    shotClockLimit = shotClockDuration;

    shotTimer.textContent =
        formatTime(shotClockLimit);

    startShotClock();

});


/* =========================================================
   END TURN
   ========================================================= */

changeTurnButton.addEventListener("click", function () {

    if (!matchStarted) {
        return;
    }


    if (currentPlayer === player1.value) {

        currentPlayer = player2.value;

    } else {

        currentPlayer = player1.value;

    }


    updateCurrentPlayerUI(currentPlayer);

    /*
     * The shot clock remains at its
     * current value.
     *
     * We are only changing the player.
     */

});


/* =========================================================
   MATCH SETUP
   ========================================================= */

matchSetupButton.addEventListener("click", function () {

    timeLimit =
        Number(matchTime.value);

    shotClockLimit =
        Number(shotClock.value);

    shotClockDuration =
        Number(shotClock.value);


    /*
     * Reset match state.
     */

    currentPlayer = null;

    matchStarted = false;

    playerOneScore = 0;

    playerTwoScore = 0;

    playerOneBallSet = null;

    playerTwoBallSet = null;


    /*
     * Reset UI.
     */

    playerOneScoreDisplay.textContent = "0";

    playerTwoScoreDisplay.textContent = "0";


    playerOneBallSetDisplay.textContent =
        "Ball set not selected";

    playerTwoBallSetDisplay.textContent =
        "Ball set not selected";


    playerOneBallIndicator.style.display =
        "none";

    playerTwoBallIndicator.style.display =
        "none";


    document.getElementById("player-one-name")
        .textContent = player1.value;

    document.getElementById("player-two-name")
        .textContent = player2.value;


    matchTimer.textContent =
        formatTime(timeLimit);

    shotTimer.textContent =
        formatTime(shotClockLimit);


    /*
     * Show match screen.
     */

    document.getElementById("match-screen")
        .style.display = "block";

    document.getElementById("match-setup")
        .style.display = "none";

    document.body.classList.add("match-active");

    /*
     * Set lag button names.
     */

    lagP1.textContent =
        player1.value;

    lagP2.textContent =
        player2.value;


    /*
     * Disable gameplay.
     */

    shotButton.disabled = true;

    changeTurnButton.disabled = true;

    matchStartButton.disabled = true;


    playerOneMinus.disabled = true;

    playerOnePlus.disabled = true;

    playerTwoMinus.disabled = true;

    playerTwoPlus.disabled = true;

});


/* =========================================================
   LAG PLAYER 1
   ========================================================= */

lagP1.addEventListener("click", function () {

    currentPlayer =
        player1.value;

    updateCurrentPlayerUI(currentPlayer);

    matchStartButton.disabled = false;

});


/* =========================================================
   LAG PLAYER 2
   ========================================================= */

lagP2.addEventListener("click", function () {

    currentPlayer =
        player2.value;

    updateCurrentPlayerUI(currentPlayer);

    matchStartButton.disabled = false;

});


/* =========================================================
   START MATCH
   ========================================================= */

matchStartButton.addEventListener("click", function () {

    matchStarted = true;


    startMatch();

    startShotClock();


    disableLags();


    /*
     * Enable gameplay.
     */

    shotButton.disabled = false;

    changeTurnButton.disabled = false;


    /*
     * Enable score controls.
     */

    playerOneMinus.disabled = false;

    playerOnePlus.disabled = false;

    playerTwoMinus.disabled = false;

    playerTwoPlus.disabled = false;

    redBallButton.disabled = false;
    yellowBallButton.disabled = false;
});


/* =========================================================
   RED BALL SELECTION
   ========================================================= */

redBallButton.addEventListener("click", function () {

    assignBallSets("RED");

});


/* =========================================================
   YELLOW BALL SELECTION
   ========================================================= */

yellowBallButton.addEventListener("click", function () {

    assignBallSets("YELLOW");

});


/* =========================================================
   BALL SET ASSIGNMENT
   ========================================================= */

function assignBallSets(ballSet) {

    /*
     * Player 1 gets whatever
     * the user selected.
     */

    playerOneBallSet =
        ballSet;


    /*
     * Player 2 automatically gets
     * the opposite colour.
     */

    if (ballSet === "RED") {

        playerTwoBallSet =
            "YELLOW";

    } else {

        playerTwoBallSet =
            "RED";

    }


    updateBallSetUI();

}


/* =========================================================
   UPDATE BALL SET UI
   ========================================================= */

function updateBallSetUI() {

    playerOneBallSetDisplay.textContent =
        playerOneBallSet;


    playerTwoBallSetDisplay.textContent =
        playerTwoBallSet;


    playerOneBallIndicator.style.display =
        "block";

    playerTwoBallIndicator.style.display =
        "block";


    /*
     * Set the actual ball colours.
     */

    if (playerOneBallSet === "RED") {

        playerOneBallIndicator.style.background =
            "#ef4444";

        playerTwoBallIndicator.style.background =
            "#facc15";

    } else {

        playerOneBallIndicator.style.background =
            "#facc15";

        playerTwoBallIndicator.style.background =
            "#ef4444";

    }

}


/* =========================================================
   CURRENT PLAYER UI
   ========================================================= */

function updateCurrentPlayerUI(player) {

    if (player === player1.value) {

        p1Indicator.style.display =
            "block";

        p2Indicator.style.display =
            "none";

    } else if (player === player2.value) {

        p2Indicator.style.display =
            "block";

        p1Indicator.style.display =
            "none";

    } else {

        p1Indicator.style.display =
            "none";

        p2Indicator.style.display =
            "none";

    }

}


/* =========================================================
   MATCH TIMER
   ========================================================= */

function startMatch() {

    clearInterval(matchTimerInterval);


    matchTimerInterval =
        setInterval(function () {

            timeLimit--;


            matchTimer.textContent =
                formatTime(timeLimit);


            if (timeLimit <= 0) {

                timeLimit = 0;

                matchTimer.textContent =
                    formatTime(timeLimit);

                clearInterval(matchTimerInterval);

            }

        }, 1000);

}


/* =========================================================
   SHOT CLOCK
   ========================================================= */

function startShotClock() {

    clearInterval(scLimit);


    scLimit =
        setInterval(function () {

            shotClockLimit--;


            shotTimer.textContent =
                formatTime(shotClockLimit);


            if (shotClockLimit <= 0) {

                shotClockLimit = 0;

                shotTimer.textContent =
                    formatTime(shotClockLimit);

                clearInterval(scLimit);

            }

        }, 1000);

}


/* =========================================================
   DISABLE LAGS
   ========================================================= */

function disableLags() {

    lagP1.disabled = true;

    lagP2.disabled = true;

}


/* =========================================================
   SCORE - ADD
   ========================================================= */

function addScore(player) {

    if (player === 1) {

        playerOneScore++;

        playerOneScoreDisplay.textContent =
            playerOneScore;

    }


    if (player === 2) {

        playerTwoScore++;

        playerTwoScoreDisplay.textContent =
            playerTwoScore;

    }

}


/* =========================================================
   SCORE - SUBTRACT
   ========================================================= */

function subtractScore(player) {

    if (player === 1 && playerOneScore > 0) {

        playerOneScore--;

        playerOneScoreDisplay.textContent =
            playerOneScore;

    }


    if (player === 2 && playerTwoScore > 0) {

        playerTwoScore--;

        playerTwoScoreDisplay.textContent =
            playerTwoScore;

    }

}


/* =========================================================
   SCORE BUTTON EVENTS
   ========================================================= */

playerOnePlus.addEventListener("click", function () {

    addScore(1);

});


playerOneMinus.addEventListener("click", function () {

    subtractScore(1);

});


playerTwoPlus.addEventListener("click", function () {

    addScore(2);

});


playerTwoMinus.addEventListener("click", function () {

    subtractScore(2);

});


/* =========================================================
   FORMAT TIME
   ========================================================= */

function formatTime(totalSeconds) {

    const minutes =
        Math.floor(totalSeconds / 60);

    const seconds =
        totalSeconds % 60;


    return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

}