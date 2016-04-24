'use strict';

const express = require('express');

const DEFAULT_PORT = 2000;

/**
 * Represents the core game server that manages all users and session in progress.
 * This implementation is not intended for heavy load-use, but only during development
 * when there are not many users.
 */
class GameServer {
    constructor() {
        this.app = null;
        this.port = DEFAULT_PORT;
    }

    /**
     * Starts the game server on the specified port.
     * @param port {Number} The port number the server will listen on, if this is not specified the default will be used.
     */
    run(port) {
        this.port = port || DEFAULT_PORT;

        const self = this;

        this.app = express();

        this.app.listen(this.port, function() {
            console.log('Game Server listening on port ' + self.port);
        });
    }
}

module.exports = GameServer;
