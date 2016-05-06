'use strict';

/**
 * Manages a collection of cards belonging to a player.
 **/
class Deck {
    constructor() {
        this.cardList = [];        // Deck is a list of all cards, the content is not necessarily random
        this.currentDeck = [];     // Randomized list of cards
    };

    /**
     * Resets the decks contents back to the default, un-shuffled order.
     */
    reset() {
        this.currentDeck = this.cardList.slice();
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
     * Retrieves the card at the specified index within the collection but does not remove it.
     * @param offset {Number} Index of the card to be retrieved.
     * @returns {Card} The card at the specified offset within the deck, if one does not exist this method returns null.
     */
    peekCard(offset) {
        const actualOffset = undefined === offset ? 0 : offset;
        if (actualOffset < this.currentDeck.length) {
            return this.currentDeck[actualOffset];
        }
        return null;
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
