/*
 * Create a list that holds all of your cards
 */
const listOfCards = ["diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb",
    "diamond", "paper-plane-o", "anchor", "bolt", "cube", "leaf", "bicycle", "bomb"
];


/*
 * Initial setup of game
 */
function myInit() {

    // Set event listener for restart button
    document.querySelector(".restart").addEventListener("click", restart);

    displayCards();

    setCardsEventListener();

}


/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
function displayCards() {
    let listOfShuffledCards = shuffle(listOfCards);

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < listOfShuffledCards.length; i++) {

        const cardNode = document.createElement("li");
        cardNode.className = "card";

        const cardFace = document.createElement("i");
        cardFace.className = `fa fa-${listOfShuffledCards[i]}`;

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

}


/*
 *	 Function to restart game
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


myInit();