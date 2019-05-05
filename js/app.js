/*
 * Create a list that holds all of your cards
 */
const baseCards = ["gem", "paper-plane", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"];
const listOfCards = baseCards.concat(baseCards); // uses the base cards to have paired cards

// Create list of open cards
let listOfOpenCards = [];

// in game moves counter declaration
let movesCounter;

// game timer vars declaration
let timeVar, timerCount


/** 
 * Initial game setup
 */
function myInit() {

    // set moves to zero
    movesCounter = 0;
    document.getElementById("moves").textContent = movesCounter;

    // set list of open cards to null
    listOfOpenCards = [];

    displayCards();
    setCardsEventListener();

    // game timer vars initialization
    timerCount = 0;

    timeVar = setInterval(function() {
        ++timerCount;
        const calculatedTime = getTimeFromNumber(timerCount);
        document.getElementById("timer").textContent = `${calculatedTime[1]}:${calculatedTime[2]}`;
    }, 1000);

    // Set event listener for restart button
    document.querySelector(".restart").addEventListener("click", restart);
}

/**
 * @description Get an array with calculated time from a number
 * @param {integer} num
 * @returns {(integer|array)} hours minutes and seconds in array
 * @see [w3schools]{@link https://www.w3schools.com/howto/howto_js_countdown.asp}
 */
function getTimeFromNumber(num) {
    // Time calculations for hours, minutes and seconds
    const hours = Math.floor(timerCount / 3600);
    const minutes = Math.floor((timerCount - hours * 3600) / 60);
    const seconds = Math.floor(timerCount - (hours * 3600 + minutes * 60));

    const calculatedTime = [hours, checkTime(minutes), checkTime(seconds)];

    return calculatedTime;
}

/**
 * Add zero in front of numbers < 10
 * @param {integer} i 
 * @returns {string}
 * @see [w3schools]{@link https://www.w3schools.com/js/tryit.asp?filename=tryjs_timing_clock}
 */
function checkTime(i) {
    if (i < 10) { i = "0" + i };
    return i;
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

/**
 * @description Display the cards on the page
 */
function displayCards() {
    let listOfShuffledCards = shuffle(listOfCards);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < listOfShuffledCards.length; i++) {

        const cardNode = document.createElement("li");
        cardNode.className = "card";

        const cardFace = document.createElement("i");
        cardFace.className = `fas fa-${listOfShuffledCards[i]}`;

        cardNode.appendChild(cardFace);
        fragment.appendChild(cardNode);
    }

    document.querySelector(".deck").appendChild(fragment);

}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length,
        temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

/**
 * @description sets event listener for clicking on deck
 */
function setCardsEventListener() {
    let deck = document.querySelector(".deck");
    deck.addEventListener('click', displayCardSymbol);
}

/**
 * @description handle user clicking on card
 * @param {object} event 
 */
function displayCardSymbol(event) {
    let cardNode = event.target;

    // check if card node is a LI and that it has only one class (it should have only class 'card')
    if (cardNode.nodeName === "LI") {
        if (cardNode.classList.length === 1) {
            cardNode.classList.add("open", "show");

            // time interval to let user see open cards
            setTimeout(function() { checkOpenCard(cardNode); }, 1000);
        }
    }
}

/**
 * @description manage open card by user
 * @param {object} cardNode
 */
function checkOpenCard(cardNode) {
    // add the card to a list of "open" cards
    listOfOpenCards.push(cardNode);

    // if the list already has another card
    if (listOfOpenCards.length === 2) {
        // check to see if the two cards match
        if (listOfOpenCards[0].firstChild.classList[1] === listOfOpenCards[1].firstChild.classList[1]) {
            matchCards();
        } else {
            unmatchCards();
        }

        // increment the move counter
        updateMoveCounter();

        // update stars
        if (movesCounter > 16) {
            setGameStars("gameStars", getStarClasses(getNumberOfStars()));
        }

        // clear list of open cards
        listOfOpenCards = [];

        // check if all cards have been matched,
        if (document.querySelectorAll(".match").length === listOfCards.length) {
            // stop game time counter
            clearInterval(timeVar);

            // show final score
            setTimeout(showFinalScore, 2000);
        }
    }
}

/**
 * @description lock the cards in the open position
 */
function matchCards() {
    for (let i = 0; i < listOfOpenCards.length; i++) {
        listOfOpenCards[i].classList.remove("open", "show");
        listOfOpenCards[i].classList.add("match");
    }
}

/**
 * @description remove cards from the list and hide it's symbol
 */
function unmatchCards() {
    for (let i = 0; i < 2; i++) {
        listOfOpenCards[i].classList.remove("open", "show");
    }
}

/**
 * @description increment the move counter and display it on the page
 */
function updateMoveCounter() {
    movesCounter++;
    document.getElementById("moves").textContent = movesCounter;
}


/**
 * @description Display modal with the final score
 */
function showFinalScore() {
    // final moves
    let finalScoreDetails = document.getElementById("score-details");
    const finalMoves = document.getElementById("scoreMoves");
    const calculatedTime = getTimeFromNumber(timerCount);

    const finalTime = `${calculatedTime[1]}:${calculatedTime[2]}`

    finalScoreDetails.textContent = `In ${finalTime} With ${movesCounter} Moves`;

    // final score
    setGameStars("scoreStars", getStarClasses(getNumberOfStars()));

    modal.style.display = "block"; // display modal
}


/**
 * @description Set visual display of stars in game
 * @param {string} place 
 * @param {array} starClasses 
 */
function setGameStars(place, starClasses) {
    let starsList = document.getElementById(place);
    for (let i = 0; i < 3; i++) {
        starsList.children[i].firstChild.className = starClasses[i];
    }
}


/**
 * @description Gets number of stars based on game moves
 * @returns {float} numberOfStars
 * @see [Stackoverflow]{@link https://stackoverflow.com/a/5619997}
 * Was planning to use "trick" from this answer for a switch case
 * But, after reading comments on answer decided to for go for "if else"
 */
function getNumberOfStars() {
    let numberOfStars = 0;
    if (movesCounter > 26) {
        numberOfStars = 0;
    } else if (movesCounter > 24) {
        numberOfStars = 0.5;
    } else if (movesCounter > 22) {
        numberOfStars = 1;
    } else if (movesCounter > 20) {
        numberOfStars = 1.5;
    } else if (movesCounter > 18) {
        numberOfStars = 2;
    } else if (movesCounter > 16) {
        numberOfStars = 2.5;
    } else {
        numberOfStars = 3;
    }
    return numberOfStars;
}

/**
 * @description gets classe names based on game stars
 * @see {@link getNumberOfStars}
 * @param {float} numberOfStars - game stars
 * @returns {(string|array)} stars classes
 */
function getStarClasses(numberOfStars) {
    let starClasses = [];
    switch (numberOfStars) {
        case 0:
            starClasses = ["far fa-star", "far fa-star", "far fa-star"];
            break;
        case 0.5:
            starClasses = ["fas fa-star-half-alt", "far fa-star", "far fa-star"];
            break;
        case 1:
            starClasses = ["fas fa-star", "far fa-star", "far fa-star"];
            break;
        case 1.5:
            starClasses = ["fas fa-star", "fas fa-star-half-alt", "far fa-star"];
            break;
        case 2:
            starClasses = ["fas fa-star", "fas fa-star", "far fa-star"];
            break;
        case 2.5:
            starClasses = ["fas fa-star", "fas fa-star", "fas fa-star-half-alt"];
            break;
        default:
            starClasses = ["fas fa-star", "fas fa-star", "fas fa-star"];
            break;
    }
    return starClasses;
}


/**
 * @description Restart the game
 * @see [Stackoverflow]{@link https://stackoverflow.com/a/3955238}
 */
function restart() {
    // stop game time counter
    clearInterval(timeVar);

    // remove event listener for restart
    document.querySelector(".restart").removeEventListener("click", restart);

    // Remove all nodes from deck
    let deckNode = document.querySelector('.deck');

    while (deckNode.firstChild) {
        deckNode.removeChild(deckNode.firstChild);
    }

    // Reinitialize elements after some time so that user can see cards removed
    setTimeout(myInit, 300);
}

/**
 * Setup modals
 * @see [w3schools]{@link https://www.w3schools.com/howto/howto_css_modals.asp}
 */

// Get the  modal
const modal = document.getElementById("modal");

// Get the <span> element that closes the modal
const modalClose = document.getElementById("modalClose");

// When the user clicks on <span> (x), close the score modal
modalClose.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// initiate game setup after dom content load
document.addEventListener('DOMContentLoaded', myInit());