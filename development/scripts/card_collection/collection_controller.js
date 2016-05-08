pc.script.attribute('drawerA', 'entity', null, {
    displayName: 'Drawer A',
    description: 'Entity that represents the first drawer in the collection manager,'
});

pc.script.attribute('drawerB', 'entity', null, {
    displayName: 'Drawer B',
    description: 'Entity that represents the second drawer in the collection manager,'
});

pc.script.create('collection_controller', function (app) {
    var CollectionController = function(entity) {
        this.entity = entity;
    };

    CollectionController.prototype = {
        initialize: function () {
        },

        update: function (dt) {
            //this.timer += dt;
        },

        onEnable: function() {
        },

        onDisable: function() {
        },

        /**
         * Moves the card collection to the next page (if available)
         */
        nextPage: function() {
            //
        },

        /**
         * Moves the card collection to the previous page (if available).
         */
        previousPage: function() {
            //
        },
    };

    return CardDrawer;
});
