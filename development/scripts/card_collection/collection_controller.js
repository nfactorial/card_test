pc.script.attribute('drawerA', 'entity', null, {
    displayName: 'Drawer A',
    description: 'Entity that represents the first drawer in the collection manager,'
});

pc.script.attribute('drawerB', 'entity', null, {
    displayName: 'Drawer B',
    description: 'Entity that represents the second drawer in the collection manager,'
});

/**
 * This script manages the page display of the players card collection.
 * Each page contains a set of cards and the player may moev to the previous
 * or next page to traverse their list of available playing cards.
 *
 * Cards are presented on sliding 'drawers' within the view, the drawer entities
 * must be assigned to the controller within the PlayCanvas editor before the
 * script can be functional.
 */
pc.script.create('collection_controller', function (app) {
    var CollectionController = function(entity) {
        this.entity = entity;
        this.activeDrawer = 0;
        this.drawers = [];
    };

    CollectionController.prototype = {
        initialize: function () {
            this.drawers = [];
            this.activeDrawer = -1;
            this.drawers.push(this.drawerA);
            this.drawers.push(this.drawerB);

            this.nextPage();
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
            if(-1 === this.activeDrawer) {
                this.drawers.forEach(function(e){
                    e.enabled = true;
                });

                this.activeDrawer = 0;
                this.drawers[0].script.card_drawer.beginSlideIn();
            } else {
                this.drawers[activeDrawer].script.card_drawer.beginSlideIn();

                this.actveDrawer ^= 1;
            }
        },

        /**
         * Moves the card collection to the previous page (if available).
         */
        previousPage: function() {
            //
        },
    };

    return CollectionController;
});
