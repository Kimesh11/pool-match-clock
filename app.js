// ============================================================
// ELEMENT REFERENCES
// ============================================================

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

const playerRace =
    document.getElementById("player-race-input");


const matchTime =
    document.getElementById("match-duration");

const shotClock =
    document.getElementById("shot-clock-duration");


const matchTimer =
    document.getElementById("match-timer");

const shotTimer =
    document.getElementById("shot-timer");


// ============================================================
// BALL SET BUTTONS
// ============================================================

const redBallButton =
    document.getElementById("red-ball-button");

const yellowBallButton =
    document.getElementById("yellow-ball-button");


// ============================================================
// BALL SET DISPLAY
// ============================================================

const playerOneBallIndicator =
    document.getElementById("player-one-ball-indicator");

const playerTwoBallIndicator =
    document.getElementById("player-two-ball-indicator");

const playerOneBallSet =
    document.getElementById("player-one-ball-set");

const playerTwoBallSet =
    document.getElementById("player-two-ball-set");


// ============================================================
// SCORES
// ============================================================

const playerOneScoreDisplay =
    document.getElementById("player-one-score");

const playerTwoScoreDisplay =
    document.getElementById("player-two-score");


const centerScoreOne =
    document.getElementById("center-score-one");

const centerScoreTwo =
    document.getElementById("center-score-two");


const playerOneMinus =
    document.getElementById("player-one-minus");

const playerOnePlus =
    document.getElementById("player-one-plus");

const playerTwoMinus =
    document.getElementById("player-two-minus");

const playerTwoPlus =
    document.getElementById("player-two-plus");


// ============================================================
// SHOT CLOCK UI
// ============================================================

const shotClockProgress =
    document.getElementById("shot-clock-progress");

const shotClockStatus =
    document.getElementById("shot-clock-status");


// ============================================================
// STATE
// ============================================================

let currentPlayer = null;

let matchStarted = false;

let shotClockDuration = 0;

let timeLimit = 0;

let shotClockLimit = 0;

let matchTimerInterval = null;

let scLimit = null;

let playerOneScore = 0;

let playerTwoScore = 0;


// ============================================================
// SETUP MATCH
// ============================================================

matchSetupButton.addEventListener("click", function () {

    if (
        player1.value.trim() === "" ||
        player2.value.trim() === "" ||
        matchTime.value === "" ||
        shotClock.value === ""
    ) {
        alert("Please complete all match setup fields.");
        return;
    }


    timeLimit =
        Number(matchTime.value);

    shotClockDuration =
        Number(shotClock.value);

    shotClockLimit =
        shotClockDuration;


    document.getElementById(
        "player-one-name"
    ).textContent = player1.value;

    document.getElementById(
        "player-two-name"
    ).textContent = player2.value;


    document.getElementById(
        "operator-player-one"
    ).textContent =
        player1.value;

    document.getElementById(
        "operator-player-two"
    ).textContent =
        player2.value;

    document.getElementById(
        "race-number"
    ).textContent = playerRace.value;

    matchTimer.textContent =
        formatTime(timeLimit);

    shotTimer.textContent =
        shotClockLimit;


    document.getElementById(
        "match-screen"
    ).style.display = "block";


    document.getElementById(
        "match-setup"
    ).style.display = "none";


    lagP1.textContent =
        player1.value;

    lagP2.textContent =
        player2.value;


    shotButton.disabled = true;

    changeTurnButton.disabled = true;

    matchStartButton.disabled = true;


    // Ball selection is deliberately disabled
    // until the match starts.

    redBallButton.disabled = true;

    yellowBallButton.disabled = true;


    document.body.classList.add(
        "match-active"
    );

});


// ============================================================
// PLAYER 1 WINS LAG
// ============================================================

lagP1.addEventListener("click", function () {

    currentPlayer =
        player1.value;

    updateCurrentPlayerUI(
        currentPlayer
    );

    matchStartButton.disabled = false;

});


// ============================================================
// PLAYER 2 WINS LAG
// ============================================================

lagP2.addEventListener("click", function () {

    currentPlayer =
        player2.value;

    updateCurrentPlayerUI(
        currentPlayer
    );

    matchStartButton.disabled = false;

});


// ============================================================
// START MATCH
// ============================================================

matchStartButton.addEventListener(
    "click",
    function () {

        if (currentPlayer === null) {
            return;
        }


        matchStarted = true;


        startMatch();

        startShotClock();


        disableLags();


        shotButton.disabled = false;

        changeTurnButton.disabled = false;


        playerOneMinus.disabled = false;

        playerOnePlus.disabled = false;

        playerTwoMinus.disabled = false;

        playerTwoPlus.disabled = false;


        // Ball buttons become available
        // once the match has started.

        redBallButton.disabled = false;

        yellowBallButton.disabled = false;


        shotClockStatus.textContent =
            "LIVE";

    }
);


// ============================================================
// SHOT TAKEN
//
// Important:
// The player does NOT change.
// The shot clock simply resets.
// ============================================================

shotButton.addEventListener(
    "click",
    function () {

        if (!matchStarted) {
            return;
        }

        if (currentPlayer === null) {
            return;
        }


        clearInterval(scLimit);


        shotClockLimit =
            shotClockDuration;


        shotTimer.textContent =
            shotClockLimit;


        updateShotClockProgress();


        startShotClock();

    }
);


// ============================================================
// END TURN
//
// Player changes.
// Shot clock resets.
// ============================================================

changeTurnButton.addEventListener(
    "click",
    function () {

        if (!matchStarted) {
            return;
        }


        if (
            currentPlayer === player1.value
        ) {

            currentPlayer =
                player2.value;

        } else {

            currentPlayer =
                player1.value;

        }


        updateCurrentPlayerUI(
            currentPlayer
        );


        clearInterval(scLimit);


        shotClockLimit =
            shotClockDuration;


        shotTimer.textContent =
            shotClockLimit;


        updateShotClockProgress();


        startShotClock();

    }
);


// ============================================================
// PLAYER ONE SCORE
// ============================================================

playerOnePlus.addEventListener(
    "click",
    function () {

        addScore(1);

    }
);


playerOneMinus.addEventListener(
    "click",
    function () {

        subtractScore(1);

    }
);


// ============================================================
// PLAYER TWO SCORE
// ============================================================

playerTwoPlus.addEventListener(
    "click",
    function () {

        addScore(2);

    }
);


playerTwoMinus.addEventListener(
    "click",
    function () {

        subtractScore(2);

    }
);


// ============================================================
// BALL SET SELECTION
//
// Player 1 selects their ball set.
// Player 2 automatically receives the opposite set.
// ============================================================

redBallButton.addEventListener(
    "click",
    function () {

        // Player 1 gets RED
        playerOneBallSet.textContent =
            "RED";

        playerOneBallIndicator.className =
            "ball-indicator red-ball";


        // Player 2 gets YELLOW
        playerTwoBallSet.textContent =
            "YELLOW";

        playerTwoBallIndicator.className =
            "ball-indicator yellow-ball";

    }
);


yellowBallButton.addEventListener(
    "click",
    function () {

        // Player 1 gets YELLOW
        playerOneBallSet.textContent =
            "YELLOW";

        playerOneBallIndicator.className =
            "ball-indicator yellow-ball";


        // Player 2 gets RED
        playerTwoBallSet.textContent =
            "RED";

        playerTwoBallIndicator.className =
            "ball-indicator red-ball";

    }
);


// ============================================================
// UPDATE CURRENT PLAYER UI
// ============================================================

function updateCurrentPlayerUI(player) {

    if (player === player1.value) {

        p1Indicator.style.display =
            "block";

        p2Indicator.style.display =
            "none";

    }

    else if (
        player === player2.value
    ) {

        p2Indicator.style.display =
            "block";

        p1Indicator.style.display =
            "none";

    }

    else {

        p1Indicator.style.display =
            "none";

        p2Indicator.style.display =
            "none";

    }

}


// ============================================================
// START MATCH TIMER
// ============================================================

function startMatch() {

    clearInterval(
        matchTimerInterval
    );


    matchTimerInterval =
        setInterval(
            function () {

                if (timeLimit <= 0) {

                    timeLimit = 0;

                    clearInterval(
                        matchTimerInterval
                    );

                    matchTimer.textContent =
                        formatTime(timeLimit);

                    return;
                }


                timeLimit--;


                matchTimer.textContent =
                    formatTime(timeLimit);

            },
            1000
        );

}


// ============================================================
// START SHOT CLOCK
// ============================================================

function startShotClock() {

    clearInterval(scLimit);


    updateShotClockProgress();


    scLimit =
        setInterval(
            function () {

                if (
                    shotClockLimit <= 0
                ) {

                    shotClockLimit = 0;

                    shotTimer.textContent =
                        0;

                    updateShotClockProgress();

                    shotClockStatus.textContent =
                        "TIME";

                    clearInterval(scLimit);

                    return;
                }


                shotClockLimit--;


                shotTimer.textContent =
                    shotClockLimit;


                updateShotClockProgress();


                if (
                    shotClockLimit <= 5
                ) {

                    shotClockStatus.textContent =
                        "HURRY";

                }

                else {

                    shotClockStatus.textContent =
                        "LIVE";

                }

            },
            1000
        );

}


// ============================================================
// SHOT CLOCK PROGRESS
// ============================================================

function updateShotClockProgress() {

    if (
        shotClockDuration <= 0
    ) {
        return;
    }


    const percentage =
        (
            shotClockLimit /
            shotClockDuration
        ) * 100;


    shotClockProgress.style.width =
        `${percentage}%`;

}


// ============================================================
// DISABLE LAGS
// ============================================================

function disableLags() {

    lagP1.disabled = true;

    lagP2.disabled = true;

}


// ============================================================
// FORMAT TIME
// ============================================================

function formatTime(totalSeconds) {

    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    return `${minutes}:${seconds
        .toString()
        .padStart(2, "0")}`;

}


// ============================================================
// ADD SCORE
// ============================================================

function addScore(player) {

    if (player === 1) {

        playerOneScore++;

        playerOneScoreDisplay.textContent =
            playerOneScore;

        centerScoreOne.textContent =
            playerOneScore;

    }


    if (player === 2) {

        playerTwoScore++;

        playerTwoScoreDisplay.textContent =
            playerTwoScore;

        centerScoreTwo.textContent =
            playerTwoScore;

    }

}


// ============================================================
// SUBTRACT SCORE
// ============================================================

function subtractScore(player) {

    if (
        player === 1 &&
        playerOneScore > 0
    ) {

        playerOneScore--;

        playerOneScoreDisplay.textContent =
            playerOneScore;

        centerScoreOne.textContent =
            playerOneScore;

    }


    if (
        player === 2 &&
        playerTwoScore > 0
    ) {

        playerTwoScore--;

        playerTwoScoreDisplay.textContent =
            playerTwoScore;

        centerScoreTwo.textContent =
            playerTwoScore;

    }

}