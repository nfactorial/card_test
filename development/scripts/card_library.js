pc.script.attribute('cardDatabaseId', 'asset', null, {
    type: "json",
    max: 1,
    displayName: 'Card Database',
    description: 'JSON asset that contains a list of all the cards available within the game.'
});

/**
 * This script manages the information for all cards available within the game.
 * This class should be used to look-up information on a specific card.
 **/
pc.script.create('card_library', function (app) {
    // Creates a new Card_library instance
    var CardLibrary = function (entity) {
        this.entity = entity;
        this.isBusy = false;
    };

    CardLibrary.prototype = {
        // Called once after all resources are loaded and before the first update
        initialize: function () {
            var self = this;

            pc.http.get('development/data/cards/basic_cards.json', function(err, response) {
                console.log(response);
            });

//            var database = app.assets.get(this.cardDatabaseId);
        },

        // Called every frame, dt is time in seconds since last update
        update: function (dt) {
        }
    };

    return CardLibrary;
});