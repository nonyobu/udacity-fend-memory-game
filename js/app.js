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


/*
 * Initial setup of game
 */
function myInit() {

    // Set event listener for restart button
    document.querySelector(".restart").addEventListener("click", restart);

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
        // Display the result in the element with id="demo"
        document.getElementById("timer").textContent = `${calculatedTime[1]}:${calculatedTime[2]}`;
    }, 1000);

}

/*
 *  Get an array with calculated time from a number
 */
function getTimeFromNumber(num) {
    // Time calculations for hours, minutes and seconds
    const hours = Math.floor(timerCount / 3600);
    const minutes = Math.floor((timerCount - hours * 3600) / 60);
    const seconds = Math.floor(timerCount - (hours * 3600 + minutes * 60));

    const calculatedTime = [hours, checkTime(minutes), checkTime(seconds)];

    return calculatedTime;
}

function checkTime(i) {
    if (i < 10) { i = "0" + i }; // add zero in front of numbers < 10
    return i;
}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards() {
    let listOfShuffledCards = shuffle(listOfCards);
    /* let listOfShuffledCards = listOfCards; // for easy testing */

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
function setCardsEventListener() {
    let deck = document.querySelector(".deck");
    deck.addEventListener('click', displayCardSymbol);
}

// display the card's symbol
function displayCardSymbol(event) {
    let cardNode = event.target;

    // check if card node is a LI and that it has only one class. It should have only class 'card' to advance
    if (cardNode.nodeName === "LI") {
        if (cardNode.classList.length === 1) {
            cardNode.classList.add("open", "show");

            // time interval to let user see open cards
            setTimeout(function() { checkOpenCard(cardNode); }, 1000);
        }
    }
}

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
            updateGameStars("gameStars", getUpdatedStarsClasses());
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

// lock the cards in the open position
function matchCards() {
    for (let i = 0; i < listOfOpenCards.length; i++) {
        listOfOpenCards[i].classList.remove("open", "show");
        listOfOpenCards[i].classList.add("match");
    }
}

// remove the cards from the list and hide the card's symbol
function unmatchCards() {
    for (let i = 0; i < 2; i++) {
        listOfOpenCards[i].classList.remove("open", "show");
    }
}

// increment the move counter and display it on the page
function updateMoveCounter() {
    movesCounter += 1;
    document.getElementById("moves").textContent = movesCounter;
}

/*
 * END GAME
 *
 * Display a message with the final score
 *
 */
function showFinalScore() {
    // final moves
    //const finalMoves = document.getElementById("scoreMoves");
    document.getElementById("scoreMoves").textContent = movesCounter;

    // final time
    //const finalTime = document.getElementById("scoreTime");
    const calculatedTime = getTimeFromNumber(timerCount);
    document.getElementById("scoreTime").textContent = `${calculatedTime[1]}:${calculatedTime[2]}`;

    // final score
    updateGameStars("scoreStars", getUpdatedStarsClasses());

    modal.style.display = "block"; // display modal
}


// Update visual display of stars in game
function updateGameStars(place, starsClasses) {
    let starsList = document.getElementById(place);
    for (let i = 0; i < 3; i++) {
        starsList.children[i].firstChild.className = starsClasses[i];
    }

}


function getUpdatedStarsClasses() {
    let stars = [];
    switch (true) {
        case (movesCounter > 26):
            stars = ["far fa-star", "far fa-star", "far fa-star"];
            break;
        case (movesCounter > 24):
            stars = ["fas fa-star-half-alt", "far fa-star", "far fa-star"];
            break;
        case (movesCounter > 22):
            stars = ["fas fa-star", "far fa-star", "far fa-star"];
            break;
        case (movesCounter > 20):
            stars = ["fas fa-star", "fas fa-star-half-alt", "far fa-star"];
            break;
        case (movesCounter > 18):
            stars = ["fas fa-star", "fas fa-star", "far fa-star"];
            break;
        case (movesCounter > 16):
            stars = ["fas fa-star", "fas fa-star", "fas fa-star-half-alt"];
            break;
        default:
            stars = ["fas fa-star", "fas fa-star", "fas fa-star"];
            break;
    }
    return stars;
}


/*
 *	 restart the game
 */
function restart() {
    // Remove all nodes from deck
    // Snippet from https://stackoverflow.com/a/3955238
    let deckNode = document.querySelector('.deck');

    while (deckNode.firstChild) {
        deckNode.removeChild(deckNode.firstChild);
    }

    // Reinitialize elements after some time so that user can see cards removed
    setTimeout(myInit, 300);
}

// Get the modal
let modal = document.getElementById('scoreModal');

// Get the <span> element that closes the modal
const modalClose = document.getElementById("scoreModalClose");

// When the user clicks on <span> (x), close the modal
modalClose.onclick = function() {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}


myInit();