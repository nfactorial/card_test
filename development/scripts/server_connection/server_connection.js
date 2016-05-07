var ServerConnection = function(gameController, url) {
    if(!(this instanceof ServerConnection)) {
        throw 'ServerConnection called as function rather than constructor.';
    }

    if(!gameController) {
        throw 'ServerConnection must be constructed with a valid game controller.';
    }

    this.gameController = gameController;
    this.isConnected = false;
    this.url = url;
    this.socket = new SockJS(url);

    var self = this;
    this.socket.onopen = function() {
        self.onConnected();
    };

    this.socket.onclose = function() {
        self.onDisconnect();
    };

    this.socket.onmessage = function(e) {
        self.onMessage(e);
    };
};

/**
 * Function called when we have established a connection to our server
 */
ServerConnection.prototype.onConnected = function() {
    this.isConnected = true;
    this.gameController.emit(GAME_EVENTS.CONNECTED);
};

/**
 * Function called when we have been disconnected from the server.
 */
ServerConnection.prototype.onDisconnect = function() {
    this.isConnected = false;
    this.gameController.emit(GAME_EVENTS.DISCONNECT);
};

/**
 * Called when we receive a message from the server.
 * @param e {Object} Description of the event we have received.
 */
ServerConnection.prototype.onMessage = function(e) {
    //
};
