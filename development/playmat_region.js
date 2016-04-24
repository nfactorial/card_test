
/**
 * Manages a list of cards contained within a specified region.
 *
 * It may be better if this were an entity script that could be setup
 * within the editor. Rather than loaded from a JSON file, would allow
 * the designer to place the regions visually. Have-to think which
 * is preferable.
 **/
var PlaymatRegion = function(data) {
    this.name = data.name;
    this.position = data.position;
    this.size = data.size;
    this.frontFace = data.frontFace;
    this.slots = data.slots;
    this.separation = data.separation;
    this.cards = [];
    this.positionCache = new pc.Vec3();
};

PlaymatRegion.CARD_WIDTH = 1;
PlaymatRegion.CARD_HEIGHT = 1.4;


/**
 * Inserts a card into the region.
 * @param cardPlacement {CardPlacement} The card placement object that wishes to play the card.
 * @param cardInfo {CardInfo} - The card to be added to the region.
 * @returns {Boolean} - True if the card was added successfully otherwise false.
 **/
PlaymatRegion.prototype.addCard = function(cardPlacement, cardInfo) {
    if (this.slots === 1 || (this.slots > 1 && this.cards.length < this.slots)) {
        var rotationZ = this.frontFace ? 360 : 180;
        var rotationY = 0.0;
        var rotationX = 180;

        cardPlacement.removeCard(cardInfo);

        this.computeCardPosition(this.positionCache, this.cards.length);
        this.cards.push(cardInfo.entity);

        cardInfo.entity.script.card.setAnimation(0.5, rotationX, rotationY, rotationZ, this.positionCache, "flip");

        return true;
    }

    return false;
};

/**
 * Computes the position of the card at the specified index within the region.
 * @param outPosition {pc.Vec3} Vector3 where the computed position will be stored.
 * @param index {Number} Integer index of the card within the region.
 **/
PlaymatRegion.prototype.computeCardPosition = function(outPosition, index) {
    // Not sure if this is the best place to manage the animations. Perhaps the region
    // should just manage what is inside and let the cards manage their own animation state.
    if (this.slots > 1) {
        outPosition.x = (this.position[0] + this.size[0]) - (PlaymatRegion.CARD_WIDTH + this.separation) * (index+1);
        outPosition.y = 0.1;
        outPosition.z = this.position[1];

        outPosition.x += PlaymatRegion.CARD_WIDTH / 2;
    } else {
        outPosition.x = this.position[0];
        outPosition.y = 0.1;
        outPosition.z = this.position[1];
    }
};


/**
 * Removes a specified card from the region.
 * @param card {Card} The card to be removed from the region.
 **/
PlaymatRegion.prototype.removeCard = function(card) {
    // TODO: Allow multiple cards to be removed
    // TODO: Don't allow removal if an animation is currently being processed
    // TODO: Inform all other cards they must move to their new location
    var count = this.cards.length;
    for (var loop = 0; loop < count; ++loop) {
        if (this.cards[loop] === card) {
            this.cards.splice(loop, 1);
            this.shiftCards(loop);
            return;
        }
    }
};

/**
 * Shifts all cards to a new position within the region.
 * @param startIndex {Number} The index of the first card to be shifted.
 **/
PlaymatRegion.prototype.shiftCards = function(startIndex) {
    var rotationZ = this.frontFace ? 360 : 180;
    var rotationY = 0.0;
    var rotationX = 180;

    for (var loop = startIndex; loop < this.cards.length; ++loop) {
        this.computeCardPosition(this.positionCache, loop);
        this.cards[loop].setAnimation(PlaymatRegion.SHIFT_ANIMATION_SPEED, rotationX, rotationY, rotationZ, this.positionCache, "easeinout");
    }
};


/**
 * Determines which (if any) card lies under the specified coordinates.
 * The coordinates must be local to the regions origin.
 * @param x {Number} Position along the horizontal axis of the location to be checked.
 * @param y {Number} Position along the vertical axis of the location to be checked.
 * @returns {Entity} The entity that lies under the specified coordinates, if no card exists this method returns null.
 **/
PlaymatRegion.prototype.findCardAtPosition = function(x, y) {
    var count = this.cards.length;

    x = x + this.position[0] + this.size[0];
    x = ( this.size[0] * 2) - x;        // Invert x position, as card at index 0 is on the right hand side
    if (x >= 0) {
        var index = Math.floor(PlaymatRegion.CARD_WIDTH + this.separation);

        x = x - index*(PlaymatRegion.CARD_WIDTH + this.separation);

        if (x > this.separation && index < this.cards.length) {
            return this.cards[index];
        }
    }

    return null;
};
