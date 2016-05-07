pc.script.attribute('serverAddress', 'string', 'http://127.0.0.1:2000');

pc.script.create('main_menu', function (app) {
    var MainMenu = function(entity) {
        this.entity = entity;
    };

    MainMenu.prototype = {
        initialize: function () {
            var servers = {
                'local': 'http://localhost:2000/socket',
                'default': 'http://localhost:2000/socket'
            };

            //CARD_GAME.connect(this.serverAddress);
            CARD_GAME.connect(servers['local']);
        },

        update: function (dt) {
        }
    };

    return MainMenu;
});
