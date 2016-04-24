'use strict';

/**
 * Manages a collection of cards that are grouped together into a single set.
 * Sets typically represent expansions, a card cannot exist more than once within a set.
 */
class CardSet {
    constructor( name ) {
        if ( !name ) {
            throw 'CardSet cannot be created without a valid name.';
        }

        this.name = name;
        this.cards = new Map();
    }

    /**
     * Adds a card to the card set.
     * @param card {Card} The card to be added to the set.
     * @returns {boolean} True if the card was added to the set successfully otherwise false.
     */
    addCard( card ) {
        if ( card && card.cardSet === this.name && !this.cards.get( card.id ) ) {
            this.cards.set( card.id, card );
            return true;
        }

        return false;
    }
}

module.exports = CardSet;
