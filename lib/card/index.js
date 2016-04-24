'use strict';

/**
 * Represents a single card within the running title.
 */
class Card {
    constructor() {
        this.id = 0;
        this.name = null;
        this.title = null;
        this.subTitle = null;
        this.playerType = null;
        this.faction = null;
        this.cardSet = null;
        this.cardType = null;
        this.subType = null;
        this.regions = [];
        this.cost = 0;
        this.rezCost = 0;
        this.trashCost = 0;
        this.stength = 0;
        this.minDeckSize = -1;
        this.influenceLimit = -1;
        this.advancement = -1;
        this.agendaPoints = 0;
    }
}

module.exports = Card;
