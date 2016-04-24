/**
 * Manages a collection of cards belonging to a player.
 * NOTE: This class should run on the server, rather than the client.
 **/
pc.script.create('deck', function (app) {
    // Creates a new Deck instance
    var Deck = function (entity) {
        this.cardList = [];        // Deck is a list of all cards, the content is not necessarily random
        this.currentDeck = [];     // Randomized list of cards
        this.entity = entity;
    };

    Deck.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var self = this;

            this.currentDeck = this.cardList.slice();
            this.shuffle();
        },

        /**
         * Inserts a new card into the available deck.
         * Inserting a card causes the deck to be suffled.
         **/
        insertCard: function(card) {
            this.currentDeck.push(card);
            this.shuffle();
        },

        /**
         * Retrieves the next card in the deck and removes it from the pending list.
         **/
        nextCard: function() {
            return this.currentDeck.shift();
        },

        /**
         * Randomizes the remaining contents of the players deck.
         **/
        shuffle: function() {
            var count = this.currentDeck.length;
            while (count > 0) {
                var r = Math.floor(Math.random() * count);
                count -= 1;

                var old = this.currentDeck[count];
                this.currentDeck[count] = this.currentDeck[r];
                this.currentDeck[r] = old;
            }
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return Deck;
});