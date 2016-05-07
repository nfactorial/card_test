pc.script.attribute('serverAddress', 'string', 'http://127.0.0.1:2000');

pc.script.create('main_menu', function (app) {
    var MainMenu = function(entity) {
        this.entity = entity;
    };

    MainMenu.prototype = {
        initialize: function () {
            CARD_GAME.connect(this.serverAddress);
        },

        update: function (dt) {
        }
    };

    return MainMenu;
});
