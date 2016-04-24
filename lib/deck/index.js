/**
 * Manages a collection of cards belonging to a player.
 **/
class Deck {
    constructor() {
        this.cardList = [];        // Deck is a list of all cards, the content is not necessarily random
        this.currentDeck = [];     // Randomized list of cards
    };

    /**
     * Called once after all resources are loaded and before the first update.
     */
    initialize() {
        this.currentDeck = this.cardList.slice();
        this.shuffle();
    }

    /**
     * Inserts a new card into the available deck.
     * Inserting a card causes the deck to be suffled.
     * @param card {Card} The card to be added to the deck.
     **/
    insertCard( card ) {
        this.currentDeck.push( card );
        this.shuffle();
    }

    /**
     * Retrieves the next card in the deck and removes it from the pending list.
     * @returns {Card} The next card extracted from the deck.
     **/
    nextCard() {
        return this.currentDeck.shift();
    }

    /**
     * Randomizes the remaining contents of the players deck.
     **/
    shuffle() {
        var count = this.currentDeck.length;
        while ( count > 0 ) {
            var r = Math.floor( Math.random() * count );
            count -= 1;

            var old = this.currentDeck[ count ];
            this.currentDeck[ count ] = this.currentDeck[ r ];
            this.currentDeck[ r ] = old;
        }
    }
}

module.exports = Deck;
