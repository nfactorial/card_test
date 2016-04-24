'use strict';

const CardSet = require('../card_set');

/**
 * Maintains a collection of all available cards within the title.
 */
class CardLibrary {
    constructor() {
        this.cardSets = new Map();
    }

    /**
     * Retrieves the card set with the specified name.
     * @param name {String} The name of the card set to be retrieved.
     * @returns {CardSet} The card set associated witht he specified name, if one
     * could not be found this method returns null.
     */
    getCardSet( name ) {
        if ( name ) {
            if ( this.cardSets.has( name ) ) {
                return this.cardSets.get( name );
            }
        }

        return null;
    }

    /**
     * Adds a new card to the library, if the cards card-set does not exist it will be created.
     * @param card {Card} The card to be added to the library.
     * @returns {boolean} True if the card was successfully added to the library otherwise false.
     */
    addCard( card ) {
        if ( card && card.cardSet ) {
            let cardSet = this.getCardSet( card.cardSet );
            if ( !cardSet ) {
                cardSet = new CardSet(card.cardSet);
                this.cardSets.set(cardSet.name, cardSet);
            }

            return cardSet.addCard(card);
        }

        return false;
    }
}

module.exports = CardLibrary;
